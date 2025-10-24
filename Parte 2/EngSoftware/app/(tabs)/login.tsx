import React, { useState } from "react";
import {  View,  Text,  TextInput,  TouchableOpacity,  FlatList,  Image,  StyleSheet,  Button} from "react-native";
import { Ionicons } from "@expo/vector-icons";
// import DateTimePicker from '@react-native-community/datetimepicker';
// import { DateTimePickerEvent } from "@react-native-community/datetimepicker";

function salvaConta(nome:string, login:string, senha:string) {
  // Lógica para salvar o desafio no banco de dados
    let idd = Math.floor(Math.random() * 1000000);// preciso gerar um id no back
  console.log("Conta Salva:", { nome, login, senha, idd});
  // preciso percorrer os amigos e salvar só os que foram selecionados
}




export default function CriarDesafioScreen() {
  const [nome, setNome] = useState("");
  const [login, setLogin] = useState("");
  const [senha, setSenha] = useState("");
  
  return (
    <View style={styles.container}>
      <Text style={styles.titulo}>Login</Text>
      <View style={styles.card}>
        <Text style={styles.label}>Nome de usuario</Text>
        <TextInput
          style={styles.input}
          value={nome}
          onChangeText={setNome}
        />
        <Text style={styles.label}>login</Text>
        <TextInput
          style={styles.input}
          value={login}
          onChangeText={setLogin}
        />
        <Text style={styles.label}>senha</Text>
        <TextInput
          style={styles.input}
          value={senha}
          onChangeText={setSenha}
        />
        

      </View>
      <Button title="Criar conta" onPress={() => {salvaConta(nome, login, senha)}} />
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
