import { getToken } from "../../services/api.ts";
import { useRouter } from "expo-router";
import React, { useEffect, useState } from "react";
import {
  ActivityIndicator,
  FlatList,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { useNotificationViewModel } from "../../viewmodels/NotificationViewModel";

export default function NotificationScreen() {
  const router = useRouter();
  const [token, setToken] = useState<string | null>(null);
  const [loadingToken, setLoadingToken] = useState(true);

  // ✅ Hook SEMPRE é chamado (mesmo antes do token existir)
  const { notifications, loading, acceptNotification, rejectNotification, markAsRead, reload } =
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

  // Função para renderizar ícone baseado no tipo
  const getNotificationIcon = (type: string) => {
    switch (type) {
      case "FRIEND_INVITE":
      case "FRIEND_ACCEPTED":
        return "👥";
      case "CHALLENGE_INVITE":
      case "CHALLENGE_JOINED":
        return "🏆";
      case "HABIT_REMINDER":
        return "⏰";
      case "ACHIEVEMENT":
        return "🎖️";
      case "LEVEL_UP":
        return "⬆️";
      default:
        return "🔔";
    }
  };

  // Função para renderizar botões de ação
  const renderActionButtons = (item: any) => {
    // ✅ Se já foi lida, não exibe botões
    if (item.isRead) {
      return null;
    }

    // ✅ Se não requer ação, apenas marcar como lida
    if (!item.requiresAction) {
      return (
        <TouchableOpacity
          onPress={() => markAsRead(item.id)}
          style={{
            marginTop: 8,
            backgroundColor: "#2196F3",
            padding: 8,
            borderRadius: 6,
          }}
        >
          <Text style={{ color: "#fff", textAlign: "center", fontWeight: "bold" }}>
            ✓ Marcar como lida
          </Text>
        </TouchableOpacity>
      );
    }

    // ✅ Se requer ação (FRIEND_INVITE ou CHALLENGE_INVITE)
    return (
      <View style={{ flexDirection: "row", gap: 8, marginTop: 8 }}>
        <TouchableOpacity
          onPress={() => acceptNotification(item)}
          style={{
            flex: 1,
            backgroundColor: "#4CAF50",
            padding: 8,
            borderRadius: 6,
          }}
        >
          <Text style={{ color: "#fff", textAlign: "center", fontWeight: "bold" }}>
            ✓ Aceitar
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          onPress={() => rejectNotification(item)}
          style={{
            flex: 1,
            backgroundColor: "#f44336",
            padding: 8,
            borderRadius: 6,
          }}
        >
          <Text style={{ color: "#fff", textAlign: "center", fontWeight: "bold" }}>
            ✗ Recusar
          </Text>
        </TouchableOpacity>
      </View>
    );
  };

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
              backgroundColor: item.isRead ? "#f8f8f8" : "#e3f2fd",
              borderRadius: 8,
              borderLeftWidth: 4,
              borderLeftColor: item.isRead ? "#ccc" : "#2196F3",
            }}
          >
            <View style={{ flexDirection: "row", alignItems: "center", marginBottom: 4 }}>
              <Text style={{ fontSize: 24, marginRight: 8 }}>
                {getNotificationIcon(item.type)}
              </Text>
              <Text style={{ fontSize: 16, fontWeight: "bold", flex: 1 }}>
                {item.actorUserName}
              </Text>
              {!item.isRead && (
                <View
                  style={{
                    width: 8,
                    height: 8,
                    borderRadius: 4,
                    backgroundColor: "#2196F3",
                  }}
                />
              )}
            </View>
            
            <Text style={{ fontSize: 14, color: "#333", marginLeft: 32 }}>
              {item.description}
            </Text>
            
            <Text style={{ color: "gray", fontSize: 12, marginTop: 4, marginLeft: 32 }}>
              📅 {item.date}
            </Text>

            {renderActionButtons(item)}
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
