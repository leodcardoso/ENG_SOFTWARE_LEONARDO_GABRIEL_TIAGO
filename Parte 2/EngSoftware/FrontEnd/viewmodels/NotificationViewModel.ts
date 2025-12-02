import { useCallback, useEffect, useState } from "react";
import { NotificationModel } from "../models/NotificationModel";
import { NotificationService } from "../services/notificationService";

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
        switch (notification.type) {
          case "FRIEND_INVITE":
            console.log("Aceitando pedido de amizade...");
            await NotificationService.acceptFriendRequest(token, notification.inviteId!);
            break;
          
          case "CHALLENGE_INVITE":
            await NotificationService.acceptChallengeInvite(token, notification.inviteId!);
            break;
          
          default:
            console.log("Tipo de notificação não requer aceitação");
        }
        await loadNotifications();
      } catch (error) {
        console.error("Erro ao aceitar notificação:", error);
      }
    },
    [token, loadNotifications]
  );

  const acceptAllNotifications = useCallback(async () => {
    if (!token) return;
    try {
      // Filter pending friend invites
      const friendInvites = notifications.filter(
        (n) => n.type === "FRIEND_INVITE" && n.requiresAction && !n.isRead
      );

      // Use the existing acceptNotification function so behavior (notifications reload,
      // friendship creation, error handling) remains consistent.
      for (const invite of friendInvites) {
        try {
          await acceptNotification(invite);
        } catch (err) {
          console.error("Erro ao aceitar um pedido de amizade (aceitar todos):", err);
        }
      }

      // Final reload to ensure UI is in sync
      await loadNotifications();
    } catch (error) {
      console.error("Erro ao aceitar todos os convites:", error);
    }
  }, [token, loadNotifications, notifications, acceptNotification]);

  const rejectNotification = useCallback(
    async (notification: NotificationModel) => {
      if (!token) return;
      try {
        switch (notification.type) {
          case "FRIEND_INVITE":
            await NotificationService.rejectFriendRequest(token, notification.inviteId!);
            break;
          
          case "CHALLENGE_INVITE":
            await NotificationService.rejectChallengeInvite(token, notification.inviteId!);
            break;
          
          default:
            console.log("Tipo de notificação não requer rejeição");
        }
        await loadNotifications();
      } catch (error) {
        console.error("Erro ao recusar notificação:", error);
      }
    },
    [token, loadNotifications]
  );

  const markAsRead = useCallback(
    async (notificationId: string) => {
      if (!token) return;
      try {
        await NotificationService.markAsRead(token, notificationId);
        await loadNotifications();
      } catch (error) {
        console.error("Erro ao marcar como lida:", error);
      }
    },
    [token, loadNotifications]
  );

  useEffect(() => {
    loadNotifications(); 
  }, [loadNotifications]);

  return { 
    notifications, 
    loading, 
    acceptNotification, 
    rejectNotification, 
    markAsRead,
    reload: loadNotifications,
    acceptAllNotifications,
  };
}
