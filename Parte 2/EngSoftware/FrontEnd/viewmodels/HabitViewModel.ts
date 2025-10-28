import HabitModel from '../models/Habit';
import { HabitService } from '../services/habitService';
import { useState, useEffect } from 'react';

export function HabitViewModel(token: string, habitId:string) { 

    const [habits, setHabits] = useState<HabitModel[]>([]);
    const [habit, setHabit] = useState<HabitModel>();
    const [loading, setLoading] = useState(false);

    async function loadHabits(token:string) {
        setLoading(true);
        const data = await HabitService.getAllHabits(token);
        setHabits(data);
        setLoading(false);
    }
    async function loadHabitById(token:string, habitId:string){
      setLoading(true);
      const data = await HabitService.getHabitById(token, habitId);
      setHabit(data);
      setLoading(false);
    }

    useEffect(() => {
        loadHabits(token);
    }, []);

    return { habit, habits, loading, reload: loadHabits };
    }