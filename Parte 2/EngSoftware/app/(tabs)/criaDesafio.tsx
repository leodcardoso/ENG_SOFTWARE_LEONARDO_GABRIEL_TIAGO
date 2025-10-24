import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  FlatList,
  Image,
  StyleSheet,
  Button
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
// import DateTimePicker from '@react-native-community/datetimepicker';
// import { DateTimePickerEvent } from "@react-native-community/datetimepicker";
export default function CriarDesafioScreen() {
  const [nome, setNome] = useState("");
  const [meta, setMeta] = useState("");
  const [data, setData] = useState("");
  const [showPicker, setShowPicker] = useState(false);
  const [amigos, setAmigos] = useState([
    { idd: 1, nome: "João Silva", imagem: "https://randomuser.me/api/portraits/men/1.jpg", selecionado: false },
    { idd: 2, nome: "Ana Costa", imagem: "https://randomuser.me/api/portraits/women/2.jpg", selecionado: false },
    { idd: 3, nome: "Carlos Santos", imagem: "https://randomuser.me/api/portraits/men/3.jpg", selecionado: false },
    { idd: 4, nome: "Beatriz Lima", imagem: "https://randomuser.me/api/portraits/women/4.jpg", selecionado: false },
  ]);

  const toggleAmigo = (idd:number) => {
    setAmigos((prev) =>
      prev.map((a) => (a.idd === idd ? { ...a, selecionado: !a.selecionado } : a))
    );
  };


const onChangeDate = (event: DateTimePickerEvent, selectedDate?: Date): void => {
  setShowPicker(false);

  if (selectedDate) {
    const d = new Date(selectedDate);
    const dataFormatada = `${d.getDate().toString().padStart(2, "0")}/${(
      d.getMonth() + 1
    )
      .toString()
      .padStart(2, "0")}/${d.getFullYear()}`;
    setData(dataFormatada);
  }
};



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
        keyExtractor={(item) => item.idd}
        renderItem={({ item }) => (
          <TouchableOpacity
            style={styles.amigoCard}
            onPress={() => toggleAmigo(item.idd)}
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
      <Button title="Criar Desafio" onPress={() => {}} />
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
