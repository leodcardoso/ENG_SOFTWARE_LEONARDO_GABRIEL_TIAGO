export type ChallengePrivacy = "public" | "participants_only" | "private";

export interface Desafio {
  title: string;
  startDate: string;
  endDate: string;
  goal: {
    categoryTitle: string;
    checksRequired: number;
  };
  invitedFriendIds: number[];
  privacy: ChallengePrivacy;
}
