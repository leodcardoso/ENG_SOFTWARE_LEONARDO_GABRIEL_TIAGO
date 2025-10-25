import React, { useState, useEffect } from "react";
import { 
  View, 
  Text, 
  TouchableOpacity, 
  FlatList, 
  Image, 
  StyleSheet, 
  Button 
} from "react-native";

interface Amigo {
  id: number;
  nome: string;
  imagem: string;
  pontuacao: number;
}

export default function CriarDesafioScreen() {
  const [amigos, setAmigos] = useState<Amigo[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchAmigos() {
      try {
        // ⚠️ Substitua pelo IP da sua máquina
        const response = await fetch("http://localhost:3000/users");
        const data = await response.json();

        if (Array.isArray(data)) {
 const amigosFormatados = data.map((user) => ({
          id: user.id,
          nome: user.name,
          imagem: user.profile?.avatar 
            ? user.profile.avatar 
            : "https://cdn-icons-png.flaticon.com/512/149/149071.png", // imagem padrão se avatar for null
          pontuacao: user.stats?.points || 0
        }));
          setAmigos(amigosFormatados);
        } else {
          console.error("Dados inválidos:", data);
        }
      } catch (error) {
        console.error("Erro ao buscar amigos:", error);
      } finally {
        setLoading(false);
      }
    }

    fetchAmigos();
  }, []);

  const perfilAmigo = (id: number) => {
    console.log("Perfil do amigo:", id);
  };

  const adicionaAmigo = () => {
    console.log("Adicionar novo amigo");
  };

  if (loading) {
    return (
      <View style={styles.container}>
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
          <TouchableOpacity
            style={styles.amigoCard}
            onPress={() => perfilAmigo(item.id)}
          >
            <View style={styles.amigoInfo}>
              <Image source={{ uri: item.imagem }} style={styles.foto} />
              <Text style={styles.nomeAmigo}>{item.nome}</Text>
              <Text>{item.pontuacao}</Text>
            </View>
          </TouchableOpacity>
        )}
      />
      <Button title="Novo Amigo" onPress={adicionaAmigo} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#fff", padding: 20 },
  amigoCard: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    backgroundColor: "#fafafa",
    borderRadius: 12,
    padding: 10,
    marginBottom: 10,
    borderWidth: 1,
    borderColor: "#eee",
  },
  amigoInfo: {
    flexDirection: "row",
    alignItems: "center",
  },
  foto: { width: 40, height: 40, borderRadius: 20, marginRight: 12 },
  nomeAmigo: { fontSize: 15, fontWeight: "500" },
});
