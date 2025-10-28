export type NotificationType = 
  | "FRIEND_INVITE"
  | "FRIEND_ACCEPTED"
  | "CHALLENGE_INVITE"
  | "CHALLENGE_JOINED"
  | "HABIT_REMINDER"
  | "ACHIEVEMENT"
  | "LEVEL_UP";

export interface NotificationModel {
  id: string;
  type: NotificationType;
  description: string;
  date: string;
  inviteId?: string;
  actorUserId: string;
  actorUserName: string;
  isRead: boolean;
  data?: any; // Dados específicos de cada tipo
  requiresAction: boolean; // Se precisa de botões de ação
}
