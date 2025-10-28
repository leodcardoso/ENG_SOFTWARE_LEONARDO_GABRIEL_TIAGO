import RankingModel from '../models/Ranking';

const API_URL = "http://localhost:3000";  // troque pela sua URL real

export const RankingService = {
  async getRanking(token: string, challengeId: string): Promise<RankingModel> {
    const response = await fetch(`${API_URL}/challenges/${challengeId}/ranking`, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(errorText || 'Erro ao buscar ranking');
    }

    const data = await response.json();
    return RankingModel.fromApi(data);
  },
};
