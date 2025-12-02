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
  // Return a structured result so UI can react without uncaught exceptions
  async function checkIn() : Promise<{ success: boolean; expired?: boolean; message?: string; data?: HabitModel } | undefined> {
    if (!habitId || !token) return { success: false, message: 'Missing token or habitId' };
    try {
      const data = await HabitService.setCheckIn(token, habitId);
      return { success: true, data };
    } catch (err: any) {
      const raw = err?.message ?? String(err);
      // If backend returned JSON string, try to parse it
      let message = raw;
      try {
        const parsed = JSON.parse(raw);
        if (parsed && typeof parsed === 'object' && parsed.message) message = parsed.message;
      } catch (e) {
        // not JSON
      }
      if (typeof message === 'string' && message.includes('Hábito expirado')) {
        return { success: false, expired: true, message };
      }
      return { success: false, message };
    }
  }
  useEffect(() => {
    if (token && habitId) loadHabit();
  }, [token, habitId]);

  return { habit, loading_one, checkIn, reload: loadHabit };
}
