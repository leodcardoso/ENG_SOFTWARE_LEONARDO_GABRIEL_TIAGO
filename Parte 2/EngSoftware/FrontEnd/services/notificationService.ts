export const NotificationService = {
  async getNotifications(token: string) {
    try {
      const response = await fetch("http://localhost:3000/user/notifications", {
        method: "GET",
        headers: {
          "Authorization": `Bearer ${token}`,
        },
      });

      const result = await response.json();
      console.log("res notificacao", result);
      if (!response.ok) {
        throw new Error(result.message || "Erro ao buscar notificações");
      }

      return result.notifications || [];
    } catch (error) {
      console.error("Erro ao carregar notificações:", error);
      return [];
    }
  },

  async acceptFriendRequest(token: string, notificationId: string) {
    const response = await fetch(`http://localhost:3000/friend/accept/${notificationId}`, {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    });
    return response.json();
  },

  async acceptChallengeInvite(token: string, notificationId: string) {
    const response = await fetch(`http://localhost:3000/challenge/accept/${notificationId}`, {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    });
    return response.json();
  },
};
