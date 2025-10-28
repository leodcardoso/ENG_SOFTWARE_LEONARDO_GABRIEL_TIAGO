export interface FriendModel {
  id: string;
  name: string;
  email?: string;
  isFriend?: boolean; // usado quando vem da busca
  has_pending_invite?: boolean; // indica se existe convite de amizade pendente
}
