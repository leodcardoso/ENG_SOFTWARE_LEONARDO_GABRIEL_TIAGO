import { useState, useEffect, useCallback } from "react";
import { NotificationService } from "../services/notificationService";
import { NotificationModel } from "../models/NotificationModel";

export function useNotificationViewModel(token: string) {
  const [notifications, setNotifications] = useState<NotificationModel[]>([]);
  const [loading, setLoading] = useState(false);

  const loadNotifications = useCallback(async () => {
    if (!token) return;
    setLoading(true);
    try {
      const data = await NotificationService.getNotifications(token);
      setNotifications(data);
    } catch (error) {
      console.error("Erro ao carregar notificações:", error);
    } finally {
      setLoading(false);
    }
  }, [token]);

  const acceptNotification = useCallback(
    async (notification: NotificationModel) => {
      if (!token) return;
      try {
        if (notification.type === "friend_request") {
          await NotificationService.acceptFriendRequest(token, notification.id);
        } else if (notification.type === "challenge_invite") {
          await NotificationService.acceptChallengeInvite(token, notification.id);
        }
        await loadNotifications(); // recarrega lista após aceitar
      } catch (error) {
        console.error("Erro ao aceitar notificação:", error);
      }
    },
    [token, loadNotifications]
  );

  useEffect(() => {
    loadNotifications(); // ✅ só roda quando o token muda
  }, [loadNotifications]);

  return { notifications, loading, acceptNotification, reload: loadNotifications };
}
