// src/viewmodels/HabitViewModel.ts
import { useState, useEffect } from 'react';
import { User } from '../models/User';
import { authService } from '../services/authService';

export function useUserViewModel(token?: string | null) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function getUser(token: string) {
    try {
        setLoading(true);
        setError(null);
        const data = await authService.getUser(token);
        setUser(data);
      } catch (err: any) {
        setError('Email ou senha incorretos.');
      } finally {
        setLoading(false);
      }
  }

  // Auto-load user when a token becomes available. Guarded to avoid running on null/undefined token.
  useEffect(() => {
    if (token) {
      getUser(token);
    }
  }, [token]);

    return {
    user,
    loading,
    error,
    getUser,
  };
}
