import React, { useState, useEffect } from "react";
import { 
  View, 
  Text, 
  FlatList, 
  Image, 
  TouchableOpacity, 
  StyleSheet, 
  ActivityIndicator 
} from "react-native";

interface User {
  id: number;
  name: string;
  profile?: {
    avatar: string | null;
    bio?: string;
  };
  stats?: {
    points?: number;
  };
}

interface Amigo {
  id: number;
  nome: string;
  imagem: string;
  pontuacao: number;
}

export default function AmigosScreen() {
  const [amigos, setAmigos] = useState<Amigo[]>([]);
  const [loading, setLoading] = useState(true);

  const idLocal = 1; // <-- substitua pelo ID do usuário logado

  useEffect(() => {
    async function fetchAmigos() {
      try {
        // 1️⃣ Buscar usuário principal
        const resUser = await fetch(`http://localhost:3000/users/${idLocal}`);
        const user: User & { friends: number[] } = await resUser.json();

        if (!user?.friends || user.friends.length === 0) {
          console.log("Usuário não possui amigos.");
          setAmigos([]);
          return;
        }

        // 2️⃣ Buscar todos os amigos em paralelo
        const friendsResponses = await Promise.all(
          user.friends.map(id => fetch(`http://localhost:3000/users/${id}`))
        );

        const friendsData: User[] = await Promise.all(
          friendsResponses.map(res => res.json())
        );

        // 3️⃣ Converter formato para o esperado na tela
        const amigosFormatados = friendsData.map(friend => ({
          id: friend.id,
          nome: friend.name,
          imagem: friend.profile?.avatar 
            ? friend.profile.avatar 
            : "https://cdn-icons-png.flaticon.com/512/149/149071.png",
          pontuacao: friend.stats?.points || 0,
        }));

        setAmigos(amigosFormatados);
      } catch (error) {
        console.error("Erro ao buscar amigos:", error);
      } finally {
        setLoading(false);
      }
    }

    fetchAmigos();
  }, []);

  if (loading) {
    return (
      <View style={styles.centered}>
        <ActivityIndicator size="large" color="#007AFF" />
        <Text>Carregando amigos...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <FlatList
        data={amigos}
        keyExtractor={(item) => item.id.toString()}
        renderItem={({ item }) => (
          <TouchableOpacity style={styles.amigoCard}>
            <Image source={{ uri: item.imagem }} style={styles.foto} />
            <View>
              <Text style={styles.nome}>{item.nome}</Text>
              <Text style={styles.pontos}>{item.pontuacao} pontos</Text>
            </View>
          </TouchableOpacity>
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#fff", padding: 20 },
  centered: { flex: 1, justifyContent: "center", alignItems: "center" },
  amigoCard: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#fafafa",
    borderRadius: 12,
    padding: 12,
    marginBottom: 10,
    borderWidth: 1,
    borderColor: "#eee",
  },
  foto: { width: 40, height: 40, borderRadius: 20, marginRight: 12 },
  nome: { fontSize: 16, fontWeight: "500" },
  pontos: { fontSize: 13, color: "#666" },
});
