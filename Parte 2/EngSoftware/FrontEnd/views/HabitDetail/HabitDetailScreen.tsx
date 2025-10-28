// FrontEnd/views/HabitDetail/HabitDetailScreen.tsx
import React from "react";
import { View, Text, ActivityIndicator, StyleSheet, Button } from "react-native";
import { useLocalSearchParams, useRouter } from "expo-router";
import { useHabitDetailViewModel } from "../../viewmodels/useHabitDetailViewModel";

export default function HabitDetailScreen() {
  const { token, habitId } = useLocalSearchParams<{ token: string; habitId: string }>();
  const router = useRouter();

  const { habit, loading_one, checkIn, reload } = useHabitDetailViewModel(token, habitId);
  console.log(habit);
  if (loading_one) {
    return (
      <View style={styles.centered}>
        <ActivityIndicator size="large" color="#007AFF" />
        <Text style={styles.loadingText}>Carregando hábito...</Text>
      </View>
    );
  }

  if (!habit) {
    return (
      <View style={styles.centered}>
        <Text style={styles.errorText}>{"Hábito não encontrado."}</Text>
        <Button title="Tentar novamente" onPress={reload} />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>{habit.name}</Text>
      <Text style={styles.description}>{habit.description || "Sem descrição."}</Text>
      <Text style={styles.progress}>
        Ultimo Check-in {habit.streak ? `${habit.streak}%` : "Não iniciado"}
      </Text>
      <Button title="Check-in" onPress={()=>checkIn()}/>
      <Button title="Voltar" onPress={() => router.back()} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: "#fff",
  },
  centered: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  loadingText: {
    marginTop: 10,
    fontSize: 16,
    color: "#555",
  },
  errorText: {
    fontSize: 16,
    color: "red",
    textAlign: "center",
  },
  title: {
    fontSize: 22,
    fontWeight: "bold",
    marginBottom: 10,
  },
  category: {
    fontSize: 16,
    color: "#666",
    marginBottom: 8,
  },
  description: {
    fontSize: 15,
    color: "#333",
    marginBottom: 12,
  },
  progress: {
    fontSize: 15,
    color: "#007AFF",
    marginBottom: 20,
  },
});
