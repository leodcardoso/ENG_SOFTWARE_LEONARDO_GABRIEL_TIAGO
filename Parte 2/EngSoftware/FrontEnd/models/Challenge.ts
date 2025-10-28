// src/models/Habit.ts
export interface Challenge {
  id: string;
  owner_id: number;
  title: string;
  description: string;
  category: string;
  expiration_date: Date | null;
  created_at: Date;
  updated_at: Date;
  is_active: boolean;
  max_members: number | null;
  is_private: boolean;

}