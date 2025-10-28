import HabitModel, { IHabit } from '../models/Habit';

const API_URL = 'http://localhost:3000'; // substitua pela URL real da sua API

export const HabitService = {
  // Buscar todos os hábitos do usuário
  async getAllHabits(token: string): Promise<HabitModel[]> {
    console.log(token);
    const response = await fetch(`${API_URL}/habits`, {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(errorText || 'Erro ao buscar hábitos.');
    }

    const rawData = (await response.json()).data;

    // 🔄 Converter o retorno em IHabit[]
    const data: IHabit[] = rawData.map((item: any) => ({
      id: item.id,
      name: item.title ?? "Sem título",
      description: item.description ?? "",
      frequency: item.category ?? "Diário", // ou ajuste conforme sua regra
      streak: item.points ?? 0, // se points for usado como sequência
      progress: item.active ? 50 : 100, // exemplo: 50% se ativo, 100% se concluído
    }));
    return data;
  },

  // Buscar um hábito específico
  async getHabitById(token: string, habitId: string): Promise<HabitModel> {
    const response = await fetch(`${API_URL}/habits/${habitId}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(errorText || 'Erro ao buscar hábito específico.');
    }

    const data = (await response.json()).data;
    console.log("d10", data);
    return new HabitModel({id:data.id, name:data.title, description:data.description, streak:data.updated_at});
  },


  async setCheckIn(token:string, habitId:string): Promise<HabitModel> {
    const response = await fetch(`${API_URL}/habits/${habitId}/checkin`, {
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

    const data: IHabit = await response.json();
    return new HabitModel(data);
  },
};
