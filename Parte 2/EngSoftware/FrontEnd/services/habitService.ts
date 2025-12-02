import HabitModel, { IHabit } from '../models/Habit';
import { HABIT_CATEGORIES } from '../models/HabitoCategoria';

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
    const data: IHabit[] = rawData.map((item: any) => {
      const categoryId = item.category;
      // backend might store category as id or title, so try matching both
      const category = HABIT_CATEGORIES.find(
        (c) => c.id === categoryId || c.title === categoryId || String(c.id) === String(categoryId)
      );
      return {
        id: item.id,
        name: item.title ?? "Sem título",
        description: item.description ?? "",
        frequency: item.category ?? "Diário",
        streak: item.points ?? 0,
        progress: item.active ? 0.5 : 1, // keep previous semantics but normalized [0-1]
        iconName: category?.iconName || undefined,
        is_expired: item.is_expired ?? false,
        expiration_date: item.expiration_date ?? null,
      } as IHabit;
    });
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
    const category = HABIT_CATEGORIES.find(c => c.id === data.category);
    return new HabitModel({
      id: data.id,
      name: data.title,
      description: data.description,
      streak: data.updated_at,
      iconName: category?.iconName,
      is_expired: data.is_expired ?? false,
      expiration_date: data.expiration_date ?? null,
    });
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
      // Try to parse JSON error body like { success:false, message: 'Hábito expirado' }
      let parsedMessage = errorText;
      try {
        const parsed = JSON.parse(errorText);
        if (parsed && typeof parsed === 'object') {
          if (parsed.message) parsedMessage = parsed.message;
          else if (parsed.error) parsedMessage = parsed.error;
        }
      } catch (e) {
        // not JSON, keep raw text
      }
      throw new Error(parsedMessage || 'Erro ao dar checkin.');
    }

    const data: IHabit = await response.json();
    return new HabitModel(data);
  },
};
