export interface NotificationModel {
  id: string;
  type: "FRIEND_INVITE" | "CHALLENGE_INVITE";
  description: string;
  date: string;
  inviteId: string;
  actorUserId: string;
  actorUserName: string;
  isRead: boolean;
}
