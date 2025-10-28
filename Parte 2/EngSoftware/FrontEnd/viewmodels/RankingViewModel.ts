import RankingModel, { IRankingUser } from '../models/Ranking';
import { RankingService } from '../services/rankingService';

export default class RankingViewModel {
  ranking: RankingModel | null = null;
  loading = false;
  error = '';

  async fetchRanking(token: string, challengeId: string): Promise<void> {
    this.loading = true;
    this.error = '';

    try {
      this.ranking = await RankingService.getRanking(token, challengeId);
    } catch (err: any) {
      this.error = err.message || 'Erro ao carregar ranking';
    } finally {
      this.loading = false;
    }
  }

  get users(): IRankingUser[] {
    return this.ranking ? this.ranking.users : [];
  }
}
