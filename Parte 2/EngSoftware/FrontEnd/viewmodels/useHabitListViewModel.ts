// FrontEnd/viewmodels/useHabitListViewModel.ts
import { useState, useEffect } from "react";
import HabitModel from "../models/Habit";
import { HabitService } from "../services/habitService";

export function useHabitListViewModel(token?: string | null) {
  const [habits, setHabits] = useState<HabitModel[]>([]);
  const [loading, setLoading] = useState(false);

  async function loadHabits() {
    if (!token) return;
    setLoading(true);
    try {
      const data = await HabitService.getAllHabits(token);
      setHabits(data);
      console.log('Loaded habits:', data);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    if (token) loadHabits();
  }, [token]);

  return { habits, loading, reload: loadHabits };
}
