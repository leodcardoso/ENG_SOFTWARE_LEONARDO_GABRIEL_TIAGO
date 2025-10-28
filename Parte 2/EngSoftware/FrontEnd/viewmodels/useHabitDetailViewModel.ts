// FrontEnd/viewmodels/useHabitDetailViewModel.ts
import { useState, useEffect } from "react";
import HabitModel from "../models/Habit";
import { HabitService } from "../services/habitService";

export function useHabitDetailViewModel(token?: string | null, habitId?: string) {
  const [habit, setHabit] = useState<HabitModel>();
  const [loading_one, setLoading] = useState(false);

  async function loadHabit() {
    if (!habitId || !token) return;
    setLoading(true);
    try {
      const data = await HabitService.getHabitById(token, habitId);
      console.log("d9", data);
      setHabit(data);
    } finally {
      setLoading(false);
    }
  }
  async function checkIn(){
    if (!habitId || !token) return;
    try {
      const data = await HabitService.setCheckIn(token, habitId);
    } finally {
    }
  }
  useEffect(() => {
    if (token && habitId) loadHabit();
  }, [token, habitId]);

  return { habit, loading_one, checkIn, reload: loadHabit };
}
