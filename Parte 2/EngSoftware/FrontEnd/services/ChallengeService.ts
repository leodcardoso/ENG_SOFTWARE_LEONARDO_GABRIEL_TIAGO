import { jwtDecode } from "jwt-decode";
import { Challenge } from "../models/Challenge";
import RankingModel from "../models/Ranking";

interface CustomJwtPayload {
  userId?: string;
  id?: string;
  sub?: string;
  // adicione outros campos se precisar
}
interface JwtPayload {
  userId: string;
  email: string;
  role: string;
}
export const challengeService = {
  async getByToken(token: string): Promise<Challenge[]> {
    if (!token || token.trim() === "") {
      throw new Error("Token vazio — impossível decodificar");
    }
    console.log("antes", token);
    // decodifica o token JWT
    const decoded = jwtDecode<JwtPayload>(token); // .replace(/^Bearer\s+/i, "")
    console.log("decoded", decoded);
    // tenta extrair o ID do usuário
    const userId = decoded.userId;
    if (!userId) throw new Error("Token inválido ou sem userId");

    // faz a requisição passando o ID como query param ou header
    const response = await fetch(
      `http://localhost:3000/challenges?userId=${userId}`,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      }
    );

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`Erro ao buscar desafios: ${errorText}`);
    }

    const data = await response.json();
    console.log("data2", data);
    return Array.isArray(data.data) ? data.data : [];
  },


   async getChallengeById(id: string, token: string): Promise<Challenge> {
    const response = await fetch(`http://localhost:3000/challenges/${id}`, {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    });

    if (!response.ok) {
      throw new Error("Erro ao buscar desafio");
    }

    const data = await response.json();
    return data.data as Challenge;
  },

  async getRanking(id: string, token: string): Promise<RankingModel> {
    const response = await fetch(`http://localhost:3000/challenges/${id}/allUsers`, {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    });

    if (!response.ok) {
      throw new Error("Erro ao buscar ranking");
    }

    const data = await response.json();
    console.log(data);
    return RankingModel.fromApi(data.data);
  },
  async setCheckIn(token:string, id:string): Promise<Challenge> {
    const response = await fetch(`http://localhost:3000/challenges/${id}/checkin`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(errorText || 'Erro ao dar checkin.');
    }

    const data: Challenge = await response.json();
    console.log(data);
    return data;
  },
};
