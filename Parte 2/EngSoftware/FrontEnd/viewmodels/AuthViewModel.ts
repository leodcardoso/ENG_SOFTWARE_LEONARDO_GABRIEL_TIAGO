// src/viewmodels/AuthViewModel.ts
import { useState } from 'react';
import { authService } from '../services/authService';
import {User} from '../models/User';

export function useAuthViewModel() {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function login(email: string, password: string) {
    console.log(email, password);
    try {
      console.log(email, password);
      setLoading(true);
      setError(null);
      const data = await authService.login(email, password);
      setUser(data);
      // aqui você poderia salvar o token no AsyncStorage, se quiser
    } catch (err: any) {
      setError('Email ou senha incorretos.');
    } finally {
      setLoading(false);
    }
  }
  async function register(name:string, email: string, password: string) {
    try {
      setLoading(true);
      setError(null);
      const data = await authService.register(name, email, password);
      setUser(data);
      // aqui você poderia salvar o token no AsyncStorage, se quiser
    } catch (err: any) {
      setError('Register Email ou senha incorretos.');
    } finally {
      setLoading(false);
    }
  }
  return {
    user,
    loading,
    error,
    login,
    register,
  };
}
