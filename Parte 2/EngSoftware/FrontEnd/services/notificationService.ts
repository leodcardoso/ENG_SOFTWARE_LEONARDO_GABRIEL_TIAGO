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

      // ✅ Transforma a resposta da API no formato do Model
      const notifications = await Promise.all(
        (result.data || []).map(async (item: any) => {
          const userName = await this.getUserName(token, item.actor_user_id);
          const notificationData = this.formatNotificationByType(item.type, userName, item.data);
          
          return {
            id: item.id,
            type: item.type,
            actorUserId: item.actor_user_id,
            actorUserName: userName,
            inviteId: item.data?.inviteId || "",
            isRead: !!item.read_at,
            date: new Date(item.created_at).toLocaleDateString("pt-BR", {
              day: "2-digit",
              month: "2-digit",
              year: "numeric",
              hour: "2-digit",
              minute: "2-digit",
            }),
            description: notificationData.description,
            requiresAction: notificationData.requiresAction,
            data: item.data,
          };
        })
      );

      return notifications;
    } catch (error) {
      console.error("Erro ao carregar notificações:", error);
      return [];
    }
  },

  formatNotificationByType(type: string, userName: string, data: any) {
    switch (type) {
      case "FRIEND_INVITE": // ✅ Backend retorna FRIEND_INVITE
      case "FRIEND_INVITE":
        return {
          description: `${userName} enviou um pedido de amizade`,
          requiresAction: true,
        };

      case "FRIEND_ACCEPTED":
        return {
          description: `${userName} aceitou seu pedido de amizade`,
          requiresAction: false,
        };

      case "CHALLENGE_INVITE":
        return {
          description: `${userName} te convidou para o desafio "${data?.challengeName || 'um desafio'}"`,
          requiresAction: true,
        };

      case "CHALLENGE_JOINED":
        return {
          description: `${userName} entrou no desafio "${data?.challengeName || 'seu desafio'}"`,
          requiresAction: false,
        };

      case "HABIT_REMINDER":
        return {
          description: `Lembrete: Não esqueça de completar seu hábito "${data?.habitName || 'hoje'}"`,
          requiresAction: false,
        };

      case "ACHIEVEMENT":
        return {
          description: `Parabéns! Você conquistou a conquista "${data?.achievementName || 'nova conquista'}"! 🏆`,
          requiresAction: false,
        };

      case "LEVEL_UP":
        return {
          description: `Level Up! Você atingiu o nível ${data?.newLevel || '?'}! 🎉`,
          requiresAction: false,
        };

      default:
        return {
          description: "Nova notificação",
          requiresAction: false,
        };
    }
  },

  async getUserName(token: string, userId: string): Promise<string> {
    try {
      const response = await fetch(`http://localhost:3000/user/${userId}`, {
        method: "GET",
        headers: {
          "Authorization": `Bearer ${token}`,
        },
      });
      
      if (!response.ok) return "Usuário desconhecido";
      
      const result = await response.json();
      return result.data?.name || result.data?.username || "Usuário desconhecido";
    } catch (error) {
      console.error("Erro ao buscar nome do usuário:", error);
      return "Usuário desconhecido";
    }
  },

  async acceptFriendRequest(token: string, inviteId: string) {
    console.log("Aceitando pedido de amizade...");
    const response = await fetch(`http://localhost:3000/friend/status/${inviteId}`, {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ accept: true }),
    });
    return response.json();
  },

  async rejectFriendRequest(token: string, inviteId: string) {
    const response = await fetch(`http://localhost:3000/friend/status/${inviteId}`, {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ accept: false }),
    });
    return response.json();
  },

  async acceptAllFriendRequests(token: string) {
    const response = await fetch(`http://localhost:3000/friend/status/accept-all`, {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({}),
    });
    return response.json();
  },

  async acceptChallengeInvite(token: string, inviteId: string) {
    //                            http://localhost:3000/challenges/invite/13/status
    const response = await fetch(`http://localhost:3000/challenges/invite/${inviteId}/status`, {
      method: "PUT",
      headers: {
        "Authorization": `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ "status": "ACCEPTED" })
    });
    return response.json();
  },

  async rejectChallengeInvite(token: string, inviteId: string) {
    const response = await fetch(`http://localhost:3000/challenges/invite/${inviteId}/status`, {
      method: "PUT",
      headers: {
        "Authorization": `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ "status": "REJECTED" })
    });
    return response.json();
  },

  // ✅ Adicione endpoints específicos conforme necessário
  async markAsRead(token: string, notificationId: string) {
    const response = await fetch(`http://localhost:3000/user/notifications/${notificationId}/read`, {
      method: "PUT",
      headers: {
        "Authorization": `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    });
    return response.json();
  },
};
