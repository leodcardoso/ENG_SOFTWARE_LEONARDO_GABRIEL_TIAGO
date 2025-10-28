// src/services/authService.ts
import { User } from '../models/User';

const API_URL = 'http://localhost:3000';

export const authService = {
    async login(email: string, password: string): Promise<User> {
        console.log("teste", email, password);
        const response = await fetch(`${API_URL}/auth/login`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ email, password }), // corpo da requisição
        });

    if (!response.ok) {
        throw new Error('Falha ao fazer login');
    }

        const data = await response.json();
        return data as User;
    },

    async register(name: string, email: string, password: string): Promise<User> {
        console.log(name, email, password);
        const response = await fetch(`${API_URL}/auth/register`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ name, email, password }),
        });

        if (!response.ok) {
            throw new Error('Falha ao criar conta');
        }

        const data = await response.json();
        return data as User;
    },




    async getUser(token: string): Promise<User> {
        console.log("TOKEN", token);
        const response = await fetch(`${API_URL}/user`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${token}`,
            },
        });
        console.log(response);
        if (!response.ok) {
            throw new Error('Falha ao criar conta');
        }

        const data = await response.json();
        console.log("d4", data);
        return data.data as User;
    },
};
