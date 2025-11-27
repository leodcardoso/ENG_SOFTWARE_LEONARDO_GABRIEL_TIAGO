import { getToken } from "../../services/api.ts";
import { useRouter } from "expo-router";
import React, { useEffect, useState } from "react";
import {
  ActivityIndicator,
  Alert,
  FlatList,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { FriendModel } from "../../models/FriendModel";
import { useFriendViewModel } from "../../viewmodels/FriendViewModel";

// Tipagem dos amigos
interface Friend {
  id: string;
  name: string;
  email?: string;
}

interface FriendsScreenProps {
  token: string;
}

export default function FriendsScreen() {
  const router = useRouter();
  const [token, setToken] = useState<string | null>(null);
  const [loadingToken, setLoadingToken] = useState(true);
  // 1️⃣ Buscar token uma única vez
  useEffect(() => {
    (async () => {
      const t = await getToken();
      if (!t) router.push("/login");
      setToken(t);
      setLoadingToken(false);
    })();
  }, []);
  const {
    friends,
    searchResult,
    loading,
    actionLoading,
    error,
    reload,
    searchFriendByName,
    addFriend,
  } = useFriendViewModel(token ?? "");

  const [search, setSearch] = useState<string>("");

  const onSearch = async (): Promise<void> => {
    if (!search.trim()) return;
    await searchFriendByName(search.trim());
  };

  const onAddFriend = async (userId: string): Promise<void> => {
    const ok = await addFriend(userId);
    if (ok) {
      Alert.alert("Sucesso", "Pedido de amizade realizado / amigo adicionado.");
    } else {
      Alert.alert("Erro", "Não foi possível adicionar o amigo.");
    }
  };
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Meus Amigos</Text>

      {/* Campo de busca */}
      <View style={styles.searchContainer}>
        <TextInput placeholder="Procurar por nome..."
          style={styles.input}
          value={search}
          onChangeText={setSearch}
          onSubmitEditing={onSearch}
          returnKeyType="search"/>
        <TouchableOpacity
          style={styles.button}
          onPress={onSearch}
          disabled={loading}
        >
          <Text style={styles.buttonText}>Buscar</Text>
        </TouchableOpacity>
      </View>

      {/* Indicador de carregamento */}
      {loading && !actionLoading && (
        <ActivityIndicator style={{ marginVertical: 12 }} size="large" />
      )}

      {/* Mensagem de erro */}
      {error ? <Text style={styles.errorText}>{error}</Text> : null}

      {/* Resultado da busca */}
      {searchResult && searchResult.length > 0 ? (
        <View>
          <Text style={styles.sectionTitle}>Resultados da Busca</Text>
          <FlatList<FriendModel>
            data={searchResult}
            keyExtractor={(item) => item.id.toString()}
            renderItem={({ item }) => (
              <View style={styles.resultCard}>
                <Text style={styles.friendName}>{item.name}</Text>
                <Text style={styles.friendStatus}>
                  {item.isFriend
                    ? "Já é seu amigo"
                    : item.has_pending_invite
                    ? "Convite pendente"
                    : "Não é seu amigo"}
                </Text>

                {!item.isFriend && !item.has_pending_invite && (
                  <TouchableOpacity
                    style={[styles.button, { marginTop: 12 }]}
                    onPress={() => onAddFriend(item.id)}
                    disabled={actionLoading}
                  >
                    <Text style={styles.buttonText}>
                      {actionLoading ? "Enviando..." : "Adicionar amigo"}
                    </Text>
                  </TouchableOpacity>
                )}
              </View>
            )}
            style={{ width: "100%", marginBottom: 12 }}
          />
          <TouchableOpacity
            style={[styles.link, { alignSelf: "center" }]}
            onPress={() => {
              setSearch("");
              reload();
            }}
          >
            <Text style={styles.linkText}>Voltar à lista de amigos</Text>
          </TouchableOpacity>
        </View>
      ) : searchResult && searchResult.length === 0 ? (
        <View style={styles.resultCard}>
          <Text style={styles.emptyText}>Nenhum resultado encontrado.</Text>
          <TouchableOpacity
            style={[styles.link, { marginTop: 8 }]}
            onPress={() => {
              setSearch("");
              reload();
            }}
          >
            <Text style={styles.linkText}>Voltar à lista</Text>
          </TouchableOpacity>
        </View>
      ) : (
        <FlatList<Friend>
          data={friends}
          keyExtractor={(item) => item.id.toString()}
          renderItem={({ item }) => (
            <View style={styles.friendCard}>
              <Text style={styles.friendName}>{item.name}</Text>
              {item.email ? (
                <Text style={styles.friendEmail}>{item.email}</Text>
              ) : null}
            </View>
          )}
          ListEmptyComponent={
            !loading ? (
              <Text style={styles.emptyText}>Nenhum amigo encontrado.</Text>
            ) : null
          }
          style={{ width: "100%" }}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 16, backgroundColor: "#fff" },
  title: { fontSize: 22, fontWeight: "700", marginBottom: 12 },
  sectionTitle: { fontSize: 18, fontWeight: "600", marginBottom: 8 },
  searchContainer: { flexDirection: "row", alignItems: "center", marginBottom: 12 },
  input: {
    flex: 1,
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 8,
    paddingHorizontal: 12,
    height: 42,
  },
  button: {
    marginLeft: 8,
    backgroundColor: "#007AFF",
    paddingHorizontal: 14,
    paddingVertical: 10,
    borderRadius: 8,
  },
  buttonText: { color: "#fff", fontWeight: "600" },
  friendCard: {
    backgroundColor: "#f7f7f7",
    padding: 12,
    borderRadius: 8,
    marginBottom: 8,
  },
  friendName: { fontWeight: "700", fontSize: 16 },
  friendEmail: { color: "#666", marginTop: 4 },
  resultCard: {
    backgroundColor: "#f1f9ff",
    padding: 16,
    borderRadius: 10,
    marginBottom: 8,
  },
  friendStatus: { marginTop: 8, color: "#444" },
  link: { marginTop: 6 },
  linkText: { color: "#007AFF" },
  emptyText: { textAlign: "center", color: "#999", marginTop: 20 },
  errorText: { color: "red", textAlign: "center", marginVertical: 8 },
});
