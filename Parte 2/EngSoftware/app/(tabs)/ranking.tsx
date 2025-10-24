import React, { useState } from "react";
import {  View,  Text,  TextInput,  TouchableOpacity,  FlatList,  Image,  StyleSheet,  Button} from "react-native";
import { Ionicons } from "@expo/vector-icons";
// import DateTimePicker from '@react-native-community/datetimepicker';
// import { DateTimePickerEvent } from "@react-native-community/datetimepicker";

// login
// tela com os habitos completos e incompletos
// tela de ranking dos amigos
// tela do perfil
// tela de criação de habitos
// tela com o habito especifico


function perfilAmigo(idd:number): void {
  console.log("Perfil do amigo:", idd);
}

function adicionaAmigo(): void {
  console.log("Adicionar novo amigo");
}
export default function CriarDesafioScreen() {
  // preciso pegar os amigos do back
  // aqui to assumindo que ja vem ordenado por pontuacao
  const [amigos, setAmigos] = useState([
    { idd: 1, nome: "João Silva", imagem: "https://randomuser.me/api/portraits/men/1.jpg", pontuacao: 1240 },
    { idd: 2, nome: "Ana Costa", imagem: "https://randomuser.me/api/portraits/women/2.jpg", pontuacao: 980 },
    { idd: 3, nome: "Carlos Santos", imagem: "https://randomuser.me/api/portraits/men/3.jpg", pontuacao: 1500 },
    { idd: 4, nome: "Beatriz Lima", imagem: "https://randomuser.me/api/portraits/women/4.jpg", pontuacao: 1100 },
  ]);

  return (
    <View style={styles.container}>
      <FlatList
        data={amigos}
        keyExtractor={(item) => item.idd}
        renderItem={({ item }) => (
          <TouchableOpacity
            style={styles.amigoCard}
            onPress={() => perfilAmigo(item.idd)}
          >
            <View style={styles.amigoInfo}>
              <Image source={{ uri: item.imagem }} style={styles.foto} />
              <Text style={styles.nomeAmigo}>{item.nome}</Text>
              <Text>{item.pontuacao}</Text>
            </View>
          </TouchableOpacity>
        )}
      />
      <Button title="Novo Amigo" onPress={() => {adicionaAmigo()}} />
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
});
