export interface IHabit {
  id: string;
  name: string;
  description: string;
  frequency: string;
  streak: number;
  progress: number;
}

export default class HabitModel implements IHabit {
  id: string;
  name: string;
  description: string;
  frequency: string;
  streak: number;
  progress: number;

  constructor(data: Partial<IHabit> = {}) {
    this.id = data.id || '';
    this.name = data.name || '';
    this.description = data.description || '';
    this.frequency = data.frequency || '';
    this.streak = data.streak || 0;
    this.progress = data.progress || 0;
  }
}
