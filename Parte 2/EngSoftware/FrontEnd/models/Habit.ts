export interface IHabit {
  id: string;
  name: string;
  description: string;
  frequency: string;
  streak: number;
  progress: number;
  iconName?: string;
  // Indicates whether the backend marked this habit as expired
  is_expired?: boolean;
  // optional expiration date (ISO string)
  expiration_date?: string | null;
}

export default class HabitModel implements IHabit {
  id: string;
  name: string;
  description: string;
  frequency: string;
  streak: number;
  progress: number;
  iconName?: string;
  is_expired?: boolean;
  expiration_date?: string | null;

  constructor(data: Partial<IHabit> = {}) {
    this.id = data.id || '';
    this.name = data.name || '';
    this.description = data.description || '';
    this.frequency = data.frequency || '';
    this.streak = data.streak || 0;
    this.progress = data.progress || 0;
    this.iconName = data.iconName;
    this.is_expired = (data as any).is_expired;
    this.expiration_date = (data as any).expiration_date ?? null;
  }
}
