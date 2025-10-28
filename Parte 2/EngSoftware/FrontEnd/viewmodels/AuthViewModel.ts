// src/viewmodels/AuthViewModel.ts
import { storeToken } from '@/services/api';
import { useState } from 'react';
import { User } from '../models/User';
import { authService } from '../services/authService';

export function useAuthViewModel() {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function login(email: string, password: string): Promise<{ success: boolean; user?: User; error?: string }> {
    try {
      setLoading(true);
      setError(null);
      const response: any = await authService.login(email, password);
      console.log(response);

      // Extrai token se necessário (não obrigatório aqui)
      const token: string | null =
        (response && (response.token || response.data?.token || response.data?.data?.token)) ??
        null;

      if (token) {
        storeToken(token);
      }


      // Extrai usuário de formas diferentes dependendo do formato da resposta
      const extractedUser: User | null =
        (response && response.data && response.data.user) ??
        (response && response.user) ??
        (response as User) ??
        null;

      if (extractedUser) {
        setUser(extractedUser);
        return { success: true, user: extractedUser };
      } else {
        return { success: false, error: 'Resposta de login inválida.' };
      }
    } catch (err: any) {
      setError('Email ou senha incorretos.');
      return { success: false, error: 'Email ou senha incorretos.' };
    } finally {
      setLoading(false);
    }
  }

  async function register(name:string, email: string, password: string): Promise<{ success: boolean; user?: User; error?: string }> {
    try {
      setLoading(true);
      setError(null);
      const response: any = await authService.register(name, email, password);

      const token: string | null =
        (response && (response.token || response.data?.token || response.data?.data?.token)) ??
        null;

      if (token) {
        storeToken(token);
      }
      const extractedUser: User | null =
        (response && response.data && response.data.user) ??
        (response && response.user) ??
        (response as User) ??
        null;

      if (extractedUser) {
        setUser(extractedUser);
        return { success: true, user: extractedUser };
      } else {
        return { success: false, error: 'Resposta de registro inválida.' };
      }
    } catch (err: any) {
      setError('Register Email ou senha incorretos.');
      return { success: false, error: 'Register Email ou senha incorretos.' };
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
