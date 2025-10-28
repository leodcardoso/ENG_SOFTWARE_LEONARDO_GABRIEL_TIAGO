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

    const data: IHabit[] = await response.json();
    console.log("habitos", data); // Log the parsed data instead
  
    return Array.isArray(data.data) ? data.data.map((h) => new HabitModel(h)) : [];

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

    const data: IHabit = await response.json();
    return new HabitModel(data);
  },


  async setCheckIn(token:string, habitId:string): Promise<HabitModel> {
    const response = await fetch(`${API_URL}/habits/${habitId}/checkin`, {
      method: 'GET',
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
