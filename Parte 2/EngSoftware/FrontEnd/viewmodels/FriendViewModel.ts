// FriendViewModel.ts
import { useState, useEffect, useCallback } from "react";
import { FriendService } from "../services/FriendService";
import { FriendModel } from "../models/FriendModel";

export function useFriendViewModel(token: string) {
  const [friends, setFriends] = useState<FriendModel[]>([]);
  const [searchResult, setSearchResult] = useState<FriendModel | null>(null);
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
        const result = await FriendService.searchFriendByName(token, name);
        console.log(result);
        if (!result) {
          setSearchResult(null);
        } else {
          setSearchResult({
            id: result.userId,
            name,
            isFriend: result.isFriend,
          });
        }
      } catch (err: any) {
        setError(err.message || "Erro ao buscar usuário");
        setSearchResult(null);
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

        // marca o resultado da busca como amigo
        setSearchResult((prev) => (prev && prev.id === userId ? { ...prev, isFriend: true } : prev));

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
    reload: loadFriends,
    searchFriendByName,
    addFriend,
  };
}
