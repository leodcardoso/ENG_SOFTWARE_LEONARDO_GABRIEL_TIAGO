// FriendViewModel.ts
import { useCallback, useEffect, useState } from "react";
import { FriendModel } from "../models/FriendModel";
import { FriendService } from "../services/FriendService";

export function useFriendViewModel(token: string) {
  const [friends, setFriends] = useState<FriendModel[]>([]);
  const [searchResult, setSearchResult] = useState<FriendModel[] | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [actionLoading, setActionLoading] = useState<boolean>(false); // para adicionar amigo
  const [error, setError] = useState<string | null>(null);

  const loadFriends = useCallback(async () => {
    if (!token) return;
    try {
      setLoading(true);
      setError(null);
      const list = await FriendService.getFriends(token);
      setFriends(list);
    } catch (err: any) {
      setError(err.message || "Erro ao carregar amigos");
    } finally {
      setLoading(false);
    }
  }, [token]);

  const searchFriendByName = useCallback(
    async (name: string) => {
      if (!token) return;
      if (!name.trim()) {
        setSearchResult(null);
        return;
      }

      try {
        setLoading(true);
        setError(null);
        const results = await FriendService.searchFriendByName(token, name);
        setSearchResult(results);
      } catch (err: any) {
        setError(err.message || "Erro ao buscar usuário");
        setSearchResult([]);
      } finally {
        setLoading(false);
      }
    },
    [token]
  );

  const addFriend = useCallback(
    async (userId: string) => {
      if (!token) throw new Error("Token ausente");
      try {
        setActionLoading(true);
        setError(null);
        const res = await FriendService.addFriend(token, userId);
        if (!res.success) throw new Error(res.message || "Falha ao adicionar amigo");

        // atualiza o resultado da busca marcando como convite pendente
        setSearchResult((prev) =>
          prev ? prev.map((user) =>
            user.id === userId
              ? { ...user, has_pending_invite: true }
              : user
          ) : prev
        );

        // recarrega a lista de amigos
        await loadFriends();
        return true;
      } catch (err: any) {
        setError(err.message || "Erro ao adicionar amigo");
        return false;
      } finally {
        setActionLoading(false);
      }
    },
    [token, loadFriends]
  );

  const reload = useCallback(async () => {
    setSearchResult(null);
    await loadFriends();
  }, [loadFriends]);

  useEffect(() => {
    // carrega inicialmente
    loadFriends();
  }, [loadFriends]);

  return {
    friends,
    searchResult,
    loading,
    actionLoading,
    error,
    reload,
    searchFriendByName,
    addFriend,
  };
}
