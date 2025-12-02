import { Challenge } from "../models/Challenge";
import RankingModel from "../models/Ranking";
import { HABIT_CATEGORIES } from "../models/HabitoCategoria";

export const challengeService = {
  async getByToken(token: string): Promise<(Challenge & { iconName?: string; progress?: number })[]> {
    if (!token || token.trim() === "") {
      throw new Error("Token vazio — impossível buscar desafios");
    }

    const authHeader = token.startsWith("Bearer ") ? token : `Bearer ${token}`;

    const response = await fetch(`http://localhost:3000/challenges`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: authHeader,
      },
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`Erro ao buscar desafios: ${errorText}`);
    }

    const data = await response.json();
    const items = Array.isArray(data.data) ? data.data : [];

    return items.map((ch: any) => {
      const found = HABIT_CATEGORIES.find((c) => c.id === ch.category || c.title === ch.category);
      return {
        ...ch,
        iconName: found?.iconName ?? "flag-outline",
        progress: typeof ch.progress === "number" ? ch.progress : 0,
      } as Challenge & { iconName?: string; progress?: number };
    });
  },


   async getChallengeById(id: string, token: string): Promise<Challenge> {
    const response = await fetch(`http://localhost:3000/challenges/${id}`, {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    });

    if (!response.ok) {
      throw new Error("Erro ao buscar desafio");
    }

    const data = await response.json();
    return data.data as Challenge;
  },

  async getRanking(id: string, token: string): Promise<RankingModel> {
    const response = await fetch(`http://localhost:3000/challenges/${id}/allUsers`, {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    });

    if (!response.ok) {
      throw new Error("Erro ao buscar ranking");
    }

    const data = await response.json();
    console.log(data);
    return RankingModel.fromApi(data.data);
  },
  async setCheckIn(token:string, id:string): Promise<Challenge> {
    const response = await fetch(`http://localhost:3000/challenges/${id}/checkin`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(errorText || 'Erro ao dar checkin.');
    }

    const data: Challenge = await response.json();
    console.log(data);
    return data;
  },
};
