export interface NotificationModel {
  id: string;
  type: "friend_request" | "challenge_invite" | string;
  date: string;
  description: string;
}
