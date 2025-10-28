// src/screens/ChallengeDetailScreen.tsx
import React from "react";
import {
  View,
  Text,
  ActivityIndicator,
  StyleSheet,
  FlatList,
  Button,
} from "react-native";
import { useLocalSearchParams } from "expo-router";
import { useChallengeDetailViewModel } from "../../viewmodels/useChallengeViewModel";

export default function ChallengeDetailScreen() {
  const { id, token } = useLocalSearchParams<{ id: string; token: string }>();
  const { challenge, ranking, checkIn, loading, error } = useChallengeDetailViewModel(id, token);

  if (loading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" color="#0000ff" />
        <Text>Carregando desafio...</Text>
      </View>
    );
  }

  if (error) {
    return (
      <View style={styles.center}>
        <Text style={{ color: "red" }}>{error}</Text>
      </View>
    );
  }

  if (!challenge) {
    return (
      <View style={styles.center}>
        <Text>Nenhum desafio encontrado.</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {/* 🔹 Informações do desafio */}
      <View style={styles.infoBox}>
        <Text style={styles.title}>{challenge.title}</Text>
        <Text style={styles.description}>{challenge.description}</Text>
        <Text>Categoria: {challenge.category}</Text>

        <Text>
          Expira em:{" "}
          {challenge.expiration_date
            ? new Date(challenge.expiration_date).toLocaleDateString()
            : "Sem data"}
        </Text>
        <Button title="Check-in" onPress={()=>checkIn()}/>
      </View>

      {/* 🏆 Ranking */}
      <Text style={styles.sectionTitle}>🏆 Ranking</Text>

      <FlatList
        data={ranking?.users ?? []}
        keyExtractor={(item) => item.id}
        contentContainerStyle={{ minHeight: 150 }}
        renderItem={({ item }) => (
          <View style={styles.rankingItem}>
            <Text style={styles.position}>{item.position}º</Text>
            <Text style={styles.name}>{item.name}</Text>
            <Text style={styles.score}>{item.score} pts</Text>
          </View>
        )}
        ListEmptyComponent={
          <Text style={{ textAlign: "center", color: "gray", marginTop: 20 }}>
            Nenhum participante ainda.
          </Text>
        }
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#f9f9f9", padding: 20 },
  center: { flex: 1, justifyContent: "center", alignItems: "center" },
  infoBox: {
    backgroundColor: "#fff",
    padding: 15,
    borderRadius: 10,
    marginBottom: 20,
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowRadius: 5,
  },
  title: { fontSize: 20, fontWeight: "bold", marginBottom: 8 },
  description: { color: "#555", marginBottom: 8 },
  sectionTitle: { fontSize: 18, fontWeight: "bold", marginBottom: 10 },
  rankingItem: {
    flexDirection: "row",
    justifyContent: "space-between",
    backgroundColor: "#fff",
    padding: 12,
    borderRadius: 8,
    marginBottom: 8,
  },
  position: { fontWeight: "bold", width: 30 },
  name: { flex: 1 },
  score: { fontWeight: "bold" },
});
