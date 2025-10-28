import { Amigo } from "../models/Amigo";
import { Desafio, ChallengePrivacy } from "../models/Desafio";
import { HABIT_CATEGORIES } from "../models/HabitoCategoria";
import { DesafioService } from "../services/DesafioService";

export class CriarDesafioViewModel {
  private service = new DesafioService();

  amigos: Amigo[] = [];
  loading = false;
  error: string | null = null;

  async carregarAmigos(token: string) {
    try {
      this.loading = true;
      this.error = null;
      this.amigos = await this.service.getAmigos(token);
    } catch (err: any) {
      this.error = err.message;
    } finally {
      this.loading = false;
    }
  }

  async criarDesafio(
    token: string,
    titulo: string,
    categoriaId: string,
    checkIns: number,
    dataFim: string,
    privacidade: ChallengePrivacy
  ) {
    try {
      this.loading = true;
      this.error = null;

      const categoria = HABIT_CATEGORIES.find((c) => c.id === categoriaId);

      const desafio: Desafio = {
        title: titulo,
        startDate: new Date().toISOString().slice(0, 10),
        endDate: dataFim,
        goal: {
          categoryTitle: categoria?.title || "Outro",
          checksRequired: checkIns,
        },
        invitedFriendIds: this.amigos
          .filter((a) => a.selecionado)
          .map((a) => a.id),
        privacy: privacidade,
      };

      return await this.service.createDesafio(token, desafio);
    } catch (err: any) {
      this.error = err.message;
      throw err;
    } finally {
      this.loading = false;
    }
  }

  toggleAmigo(id: number) {
    this.amigos = this.amigos.map((a) =>
      a.id === id ? { ...a, selecionado: !a.selecionado } : a
    );
  }
}
