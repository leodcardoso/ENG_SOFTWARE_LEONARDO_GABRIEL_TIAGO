import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  FlatList,
  ActivityIndicator,
  TouchableOpacity,
} from "react-native";
import { useNotificationViewModel } from "../../viewmodels/NotificationViewModel";
import { useRouter } from "expo-router";
import { getToken } from "@/services/api";

export default function NotificationScreen() {
  const router = useRouter();
  const [token, setToken] = useState<string | null>(null);
  const [loadingToken, setLoadingToken] = useState(true);

  // ✅ Hook SEMPRE é chamado (mesmo antes do token existir)
  const { notifications, loading, acceptNotification, reload } =
    useNotificationViewModel(token ?? "");

  useEffect(() => {
    (async () => {
      try {
        const t = await getToken();

        if (!t) {
          router.replace("/login");
          return;
        }

        setToken(t);
      } catch (error) {
        console.error("Erro ao buscar token:", error);
        router.replace("/login");
      } finally {
        setLoadingToken(false);
      }
    })();
  }, []);

  // 🔹 Exibe carregando enquanto busca token
  if (loadingToken) {
    return (
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
        <ActivityIndicator size="large" color="#0000ff" />
        <Text>Carregando...</Text>
      </View>
    );
  }

  // 🔹 Se não houver token, evita crash e exibe aviso
  if (!token) {
    return (
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
        <Text>Token não encontrado. Redirecionando...</Text>
      </View>
    );
  }

  // 🔹 Conteúdo principal
  if (loading) {
    return (
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
        <ActivityIndicator size="large" color="#0000ff" />
        <Text>Carregando notificações...</Text>
      </View>
    );
  }

  return (
    <View style={{ flex: 1, padding: 16, backgroundColor: "#fff" }}>
      <Text style={{ fontSize: 22, fontWeight: "bold", marginBottom: 16 }}>
        Notificações
      </Text>

      <FlatList
        data={notifications}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <View
            style={{
              padding: 12,
              marginBottom: 10,
              backgroundColor: "#f8f8f8",
              borderRadius: 8,
            }}
          >
            <Text style={{ fontSize: 16 }}>{item.description}</Text>
            <Text style={{ color: "gray", fontSize: 12 }}>📅 {item.date}</Text>

            <TouchableOpacity
              onPress={() => acceptNotification(item)}
              style={{
                marginTop: 8,
                backgroundColor: "#4CAF50",
                padding: 8,
                borderRadius: 6,
              }}
            >
              <Text style={{ color: "#fff", textAlign: "center" }}>
                {item.type === "friend_request"
                  ? "Aceitar Amizade"
                  : "Aceitar Desafio"}
              </Text>
            </TouchableOpacity>
          </View>
        )}
        ListEmptyComponent={
          <Text style={{ textAlign: "center", color: "gray", marginTop: 20 }}>
            Nenhuma notificação encontrada.
          </Text>
        }
      />
    </View>
  );
}
