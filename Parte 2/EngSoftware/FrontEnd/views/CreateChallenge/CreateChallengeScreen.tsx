import React, { useEffect, useState } from "react";
import { View, Text, TextInput, Button, ActivityIndicator, FlatList, TouchableOpacity, Image, StyleSheet } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { HABIT_CATEGORIES } from "../../models/HabitoCategoria";
import { CriarDesafioViewModel } from "../../viewmodels/CriaDesafioViewModel";
import { getToken } from "../../../services/api"; // seu util que pega o token
import { router } from "expo-router";

export default function CriarDesafioView() {
  const [viewModel] = useState(() => new CriarDesafioViewModel());
  const [token, setToken] = useState<string | null>(null);
  const [titulo, setTitulo] = useState("");
  const [categoria, setCategoria] = useState<string | null>(null);
  const [checkIns, setCheckIns] = useState("");
  const [dataFim, setDataFim] = useState("");
  const [privacidade, setPrivacidade] = useState<"public" | "participants_only" | "private">("public");
  const [refresh, setRefresh] = useState(false);
  const [descricao, setDescricao] = useState<string | null>(null);
  useEffect(() => {
    (async () => {
      const t = await getToken();
      setToken(t);
      if (t) {
        await viewModel.carregarAmigos(t);
        setRefresh((prev) => !prev);
      }
    })();
  }, []);

  if (viewModel.loading) {
    return <ActivityIndicator size="large" style={{ marginTop: 40 }} />;
  }

  return (
    <View style={styles.container}>
      <Text style={styles.titulo}>Criar Novo Desafio</Text>

      {viewModel.error && <Text style={styles.error}>{viewModel.error}</Text>}

      <TextInput style={styles.input} placeholder="Título" value={titulo} onChangeText={setTitulo} />
      <TextInput style={styles.input} placeholder="Data Fim (AAAA-MM-DD)" value={dataFim} onChangeText={setDataFim} />

      <Text style={styles.subtitulo}>Categoria</Text>
      <FlatList
        data={HABIT_CATEGORIES}
        numColumns={4}
        keyExtractor={(i) => i.id}
        renderItem={({ item }) => (
          <TouchableOpacity
            style={[
              styles.categoriaItem,
              categoria === item.id && styles.categoriaSelecionada,
            ]}
            onPress={() => setCategoria(item.id)}
          >
            <Ionicons
              name={item.iconName}
              size={24}
              color={categoria === item.id ? "#fff" : "#007AFF"}
            />
            <Text
              style={[
                styles.categoriaTexto,
                categoria === item.id && { color: "#fff" },
              ]}
            >
              {item.title}
            </Text>
          </TouchableOpacity>
        )}
      />

      <TextInput
        style={styles.input}
        placeholder="Nº Check-ins"
        keyboardType="numeric"
        value={checkIns}
        onChangeText={setCheckIns}
      />

      <Text style={styles.subtitulo}>Convidar Amigos</Text>
      <FlatList
        data={viewModel.amigos}
        keyExtractor={(a) => a.id.toString()}
        extraData={refresh}
        renderItem={({ item }) => (
          <TouchableOpacity
            style={styles.amigoCard}
            onPress={() => {
              viewModel.toggleAmigo(item.id);
              setRefresh((p) => !p);
            }}
          >
            <View style={{ flexDirection: "row", alignItems: "center" }}>
              <Image source={{ uri: item.imagem }} style={styles.foto} />
              <Text style={styles.nome}>{item.nome}</Text>
            </View>
            <Ionicons
              name={item.selecionado ? "checkbox" : "square-outline"}
              size={24}
              color={item.selecionado ? "#007AFF" : "#ccc"}
            />
          </TouchableOpacity>
        )}
        ListEmptyComponent={
                    <Text style={{ textAlign: "center", marginTop: 10, color: "gray" }}>
                    Nenhum Amigo Adicionado.
                    </Text>
                    } 
      />

      <Button
        title="Criar Desafio"
        onPress={async () => {
          if (token && categoria) {
            router.push("/main");
            await viewModel.criarDesafio(token, titulo, categoria, parseInt(checkIns, 10), dataFim, privacidade);
            
            alert("Desafio criado com sucesso!");
          }
        }}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20, backgroundColor: "#fff" },
  titulo: { fontSize: 22, fontWeight: "bold", marginBottom: 16 },
  input: { borderWidth: 1, borderColor: "#ccc", borderRadius: 8, padding: 10, marginBottom: 10 },
  subtitulo: { fontSize: 16, fontWeight: "600", marginVertical: 10 },
  categoriaItem: { flex: 1, alignItems: "center", justifyContent: "center", padding: 8, borderWidth: 1, borderColor: "#ccc", borderRadius: 8, margin: 4 },
  categoriaSelecionada: { backgroundColor: "#007AFF", borderColor: "#007AFF" },
  categoriaTexto: { fontSize: 12, color: "#333" },
  amigoCard: { flexDirection: "row", justifyContent: "space-between", alignItems: "center", padding: 10, borderBottomWidth: 1, borderColor: "#eee" },
  foto: { width: 40, height: 40, borderRadius: 20, marginRight: 10 },
  nome: { fontSize: 16 },
  error: { color: "red", marginBottom: 10 },
});
