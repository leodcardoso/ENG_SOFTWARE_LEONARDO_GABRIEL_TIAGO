// FrontEnd/views/HabitDetail/HabitDetailScreen.tsx
import React, { useState } from "react";
import { View, Text, ActivityIndicator, StyleSheet, Button, Alert } from "react-native";
import { Ionicons } from '@expo/vector-icons';
import { useLocalSearchParams, useRouter } from "expo-router";
import { useHabitDetailViewModel } from "../../viewmodels/useHabitDetailViewModel";

export default function HabitDetailScreen() {
  const { token, habitId } = useLocalSearchParams<{ token: string; habitId: string }>();
  const router = useRouter();

  const { habit, loading_one, checkIn, reload } = useHabitDetailViewModel(token, habitId);
  const [feedback, setFeedback] = useState<string | null>(null);
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
      <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8, marginBottom: 8 }}>
        <Ionicons name={(habit as any).iconName || 'book-outline'} size={28} color="#333" />
        <Text style={styles.title}>{habit.name}</Text>
      </View>
      <Text style={styles.description}>{habit.description || "Sem descrição."}</Text>
      <Text style={styles.progress}>
        Ultimo Check-in {habit.streak ? `${habit.streak}%` : "Não iniciado"}
      </Text>
      {feedback ? (
        <View style={styles.feedbackContainer}>
          <Text style={styles.feedbackText}>{feedback}</Text>
        </View>
      ) : null}
      <Button title="Check-in" onPress={async () => {
        setFeedback(null);
        const res = await checkIn();
        if (!res) return;
        if (res.expired) {
          const msg = 'Este hábito está expirado e não pode ser marcado como concluído.';
          Alert.alert('Hábito expirado', msg);
          setFeedback(msg);
        } else if (res.success) {
          setFeedback('Check-in realizado com sucesso.');
          reload();
          setTimeout(() => setFeedback(null), 2000);
        } else if (res.message) {
          Alert.alert('Erro', res.message);
          setFeedback(res.message);
        }
      }} />
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
  feedbackContainer: {
    padding: 10,
    backgroundColor: '#fff3f3',
    borderRadius: 6,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: '#ffcccc'
  },
  feedbackText: {
    color: '#cc0000',
  },
});
