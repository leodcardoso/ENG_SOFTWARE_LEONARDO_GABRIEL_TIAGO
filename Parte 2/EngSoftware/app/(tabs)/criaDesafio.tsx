import React, { useState, useEffect } from "react";
import {  View,  Text,  TextInput,  TouchableOpacity,  FlatList,  Image,  StyleSheet,  Button, ActivityIndicator} from "react-native";
import { Ionicons } from "@expo/vector-icons";
// import DateTimePicker from '@react-native-community/datetimepicker';
// import { DateTimePickerEvent } from "@react-native-community/datetimepicker";
function salvaDesafio(nome:string, meta:string, data:string, amigos:any) {
  // Lógica para salvar o desafio no banco de dados
  console.log("Desafio salvo:", { nome, meta, data, amigos });
  // preciso percorrer os amigos e salvar só os que foram selecionados
}


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
  selecionado: boolean;
}

export default function CriarDesafioScreen() {
  const [nome, setNome] = useState("");
  const [meta, setMeta] = useState("");
  const [data, setData] = useState("");
  const [showPicker, setShowPicker] = useState(false);
  // preciso pegar os amigos do back

  const toggleAmigo = (idd:number) => {    setAmigos((prev) =>
     prev.map((a) => (a.id === idd ? { ...a, selecionado: !a.selecionado } : a))
    ); };

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
          selecionado: false,
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
      <Text style={styles.titulo}>Criar Novo Desafio</Text>
      <View style={styles.card}>
        <Text style={styles.label}>Nome do Desafio</Text>
        <TextInput
          style={styles.input}
          placeholder="Ex: Desafio dos 30 dias de exercício"
          value={nome}
          onChangeText={setNome}
        />

        <Text style={styles.label}>Meta</Text>
        <TextInput
          style={[styles.input, styles.textArea]}
          placeholder="Descreva a meta do desafio..."
          multiline
          value={meta}
          onChangeText={setMeta}
        />

        <Text style={styles.label}>Data de Término</Text>
        <TouchableOpacity
          style={styles.dateInput}
          onPress={() => setShowPicker(true)}
        >
          <Text style={styles.dateText}>{data || "dd/mm/aaaa"}</Text>
          <Ionicons name="calendar-outline" size={20} color="#888" />
        </TouchableOpacity>

        {showPicker && (
          <DateTimePicker
            value={new Date()}
            mode="date"
            display="default"
            onChange={onChangeDate}
          />
        )}
      </View>

      <Text style={styles.subtitulo}>Convidar Amigos</Text>

      <FlatList
        data={amigos}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <TouchableOpacity
            style={styles.amigoCard}
            onPress={() => toggleAmigo(item.id)}
          >
            <View style={styles.amigoInfo}>
              <Image source={{ uri: item.imagem }} style={styles.foto} />
              <Text style={styles.nomeAmigo}>{item.nome}</Text>
            </View>
            <View
              style={[
                styles.radio,
                item.selecionado && styles.radioSelecionado,
              ]}
            />
          </TouchableOpacity>
        )}
      />
      <Button title="Criar Desafio" onPress={() => {salvaDesafio(nome, meta, data, amigos)}} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    padding: 20,
  },
  titulo: {
    fontSize: 18,
    fontWeight: "700",
    marginBottom: 16,
  },
  card: {
    backgroundColor: "#fafafa",
    borderRadius: 12,
    padding: 16,
    marginBottom: 24,
    borderWidth: 1,
    borderColor: "#eee",
  },
  label: {
    fontWeight: "600",
    fontSize: 14,
    marginTop: 8,
  },
  input: {
    backgroundColor: "#fff",
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "#ddd",
    padding: 10,
    marginTop: 4,
  },
  textArea: {
    height: 80,
    textAlignVertical: "top",
  },
  dateInput: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 8,
    padding: 10,
    marginTop: 4,
  },
  dateText: {
    color: "#666",
  },
  subtitulo: {
    fontWeight: "600",
    fontSize: 16,
    marginBottom: 10,
  },
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
  foto: {
    width: 40,
    height: 40,
    borderRadius: 20,
    marginRight: 12,
  },
  nomeAmigo: {
    fontSize: 15,
    fontWeight: "500",
  },
  radio: {
    width: 20,
    height: 20,
    borderRadius: 10,
    borderWidth: 2,
    borderColor: "#aaa",
  },
  radioSelecionado: {
    backgroundColor: "#007AFF",
    borderColor: "#007AFF",
  },
  centered: { flex: 1, justifyContent: "center", alignItems: "center" },
});
