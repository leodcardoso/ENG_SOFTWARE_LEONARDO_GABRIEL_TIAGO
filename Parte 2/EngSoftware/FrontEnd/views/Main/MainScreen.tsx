import { HabitoConcluido, HabitoProgresso } from "../../components/habito";
import { useRouter } from "expo-router";
import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  Image,
  StyleSheet,
  ActivityIndicator,
  FlatList,
  Pressable,
  TouchableOpacity,
  ScrollView,
} from "react-native";
import { Switch } from 'react-native';

import { useHabitListViewModel } from "../../viewmodels/useHabitListViewModel";
import { useUserViewModel } from "../../viewmodels/ProfileViewModel";
import { useChallengeViewModel } from "../../viewmodels/ChallengeViewModel";
import { getToken } from "../../services/api.ts";
import Icon from 'react-native-vector-icons/FontAwesome';
const styles = StyleSheet.create({
    scrollContainer: {
    flexGrow: 1, // permite rolar mesmo se o conteúdo for pequeno
    padding: 20,
    backgroundColor: "#f9f9f9",
  },
  container: { flex: 1, backgroundColor: "#f9f9f9" },
  profileSection: { alignItems: "center", marginVertical: 20 },
  avatar: { width: 80, height: 80, borderRadius: 40 },
  name: { fontSize: 18, fontWeight: "bold", marginTop: 10 },
  statsRow: { flexDirection: "row", gap: 10, marginTop: 5 },
  sectionTitle: { fontSize: 16, fontWeight: "bold", margin: 10 },
  topButtonsRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginHorizontal: 10,
    marginTop: 10,
  },
  button: {
    backgroundColor: "#4CAF50",
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 10,
  },
  buttonSecondary: {
    backgroundColor: "#2196F3",
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 10,
  },
  buttonText: { color: "#fff", fontWeight: "bold" },
});

export default function MainScreen() {
  const router = useRouter();
  const [token, setToken] = useState<string | null>(null);
  const [loadingToken, setLoadingToken] = useState(true);

  // 🔑 Buscar token uma única vez
  useEffect(() => {
    (async () => {
      try {
        const t = await getToken();
        if (!t) {
          router.push("/login");
          return;
        }
        setToken(t);
      } catch (error) {
        console.error("Erro ao carregar token:", error);
      } finally {
        setLoadingToken(false);
      }
    })();
  }, []);

  // Call token-dependent hooks unconditionally so hook order stays stable across renders.
  // These hooks themselves guard side-effects based on the token value.
  // UI state: whether to hide expired habits
  const [hideExpired, setHideExpired] = useState(false);

  const { user } = useUserViewModel(token);
  console.log("t", token);
  const { habits, loading } = useHabitListViewModel(token);
  const { challenges, loading2 } = useChallengeViewModel(token);

  // ⚠️ Enquanto o token ainda está sendo carregado
  if (loadingToken) {
    return (
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
        <ActivityIndicator size="large" color="#0000ff" />
        <Text>Carregando suas informações...</Text>
      </View>
    );
  }

  // ⚠️ Se não houver token após o carregamento
  if (!token) {
    return (
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
        <Text>Token inválido. Redirecionando para login...</Text>
      </View>
    );
  }

  // ✅ hooks are already called above; continue rendering

  // compute filtered list
  const filteredHabits = hideExpired ? habits.filter(h => !(h as any).is_expired) : habits;

  if (loading || loading2)
    return (
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
        <ActivityIndicator size="large" color="#0000ff" />
      </View>
    );

  const handlePressHabit = (habitId: string) => {
    router.push({ pathname: "/habitDetail", params: { token, habitId } });
  };

  const handlePressChallenge = (challengeId: string)=>{
    router.push({ pathname: "/challengeDetail", params: { token, id: challengeId } });
  }
  const handleGoToNotifications = () => {
    router.push("/notification");
  };

  const handleGoToCreateChallenge = () => {
    router.push("/createChallenge");
  };
const handleGoToAddFriends = () => {
  router.push("/friends");
};
  return (
    <ScrollView contentContainerStyle={styles.scrollContainer}>
    <View style={styles.container}>
      {/* 🔝 Botões do topo */}
      <View style={[styles.topButtonsRow, { flexWrap: "wrap", gap: 10 }]}>
        <TouchableOpacity style={styles.button} onPress={handleGoToNotifications}>
            <Text style={styles.buttonText}>🔔 Notificações</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.buttonSecondary} onPress={handleGoToCreateChallenge}>
            <Text style={styles.buttonText}>➕ Novo Desafio</Text>
        </TouchableOpacity>

        <TouchableOpacity
            style={[styles.button, { backgroundColor: "#FF9800" }]}
            onPress={handleGoToAddFriends}
        >
            <Text style={styles.buttonText}>👥 Adicionar Amigos</Text>
        </TouchableOpacity>
        </View>
      {/* 👤 Informações do usuário */}
      <View style={styles.profileSection}>
        
        <Icon name="user" size={30} color="#900" />
        <Text style={styles.name}>{user?.name}</Text>
        <View style={styles.statsRow}>
          <Text>{user?.level} lvl</Text>
          <Text>💧 {user?.points} pts</Text>
        </View>
      </View>

      {/* 🏆 Desafios */}
      <Text style={styles.sectionTitle}>Desafios em Grupo</Text>
      <FlatList
        data={challenges}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
            <Pressable onPress={() => handlePressChallenge(item.id)}>
            <View style={{ marginVertical: 8 }}>
              <HabitoProgresso idd={item.id} titulo={item.title || item.name} progresso={item.progress ?? 0} onView={handlePressChallenge} iconName={(item as any).iconName} />
            </View>
          </Pressable>
        )}
        contentContainerStyle={{ minHeight: 200 }}
        ListEmptyComponent={

            
          <Text style={{ textAlign: "center", marginTop: 10, color: "gray" }}>
            Nenhum Desafio em Grupo.
          </Text>
        }
      />

      {/* 🔄 Hábitos em progresso */}
      <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
        <Text style={styles.sectionTitle}>Hábitos em Progresso</Text>
        <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}>
          <Text style={{ color: '#666' }}>Ocultar expirados</Text>
          <Switch value={hideExpired} onValueChange={setHideExpired} />
        </View>
      </View>
      <FlatList
        data={filteredHabits}
        keyExtractor={(item) => item.id.toString()}
        renderItem={({ item }) => (
          <Pressable onPress={() => handlePressHabit(item.id)}>
            <View style={{ marginVertical: 8 }}>
              <HabitoProgresso idd={item.id} titulo={item.name} progresso={item.progress} onView={handlePressHabit} iconName={item.iconName} />
            </View>
          </Pressable>
        )}
        contentContainerStyle={{ minHeight: 200 }}
        ListEmptyComponent={
          <Text style={{ textAlign: "center", marginTop: 10, color: "gray" }}>
            Nenhum Hábito em Progresso.
          </Text>
        }
      />

      {/* ✅ Hábitos concluídos */}
      {/* <Text style={styles.sectionTitle}>Hábitos Concluídos</Text>
      <FlatList
        data={habits}
        keyExtractor={(item) => item.id.toString()}
        renderItem={({ item }) => (
          <Pressable onPress={() => handlePressHabit(item.id)}>
            <View style={{ marginVertical: 8 }}>
              <HabitoConcluido titulo={item.name} tempoConcluido={10} />
            </View>
          </Pressable>
        )}
        ListEmptyComponent={
          <Text style={{ textAlign: "center", marginTop: 10, color: "gray" }}>
            Nenhum Hábito Concluído.
          </Text>
        }
      /> */}
    </View>
    </ScrollView>
  );
}
