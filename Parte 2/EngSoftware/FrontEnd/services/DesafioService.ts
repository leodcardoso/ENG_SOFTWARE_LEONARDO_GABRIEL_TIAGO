import { Amigo } from "../models/Amigo";
import { Desafio } from "../models/Desafio";

const API_BASE_URL = "http://localhost:3000"; // ajuste aqui

export class DesafioService {
  async getAmigos(token: string): Promise<Amigo[]> {
    const response = await fetch(`${API_BASE_URL}/user/friends`, {
      headers: { Authorization: `Bearer ${token}` },
    });

    if (!response.ok) {
      throw new Error("Erro ao buscar amigos");
    }

    const amigosData = await response.json();
    console.log(response);
    console.log(amigosData)
    
    return Array.isArray(amigosData.data) ? amigosData.data.map((a: any) => ({
      id: a.id,
      nome: a.name || "Amigo",
      imagem: a.profile?.avatar || "https://placehold.co/40x40/ccc/fff?text=?",
      selecionado: false,
    })) : [];
  }

  async createDesafio(token: string, desafio: Desafio): Promise<any> {

    if (desafio.invitedFriendIds.length > 0){
      
      
      
    const response = await fetch(`${API_BASE_URL}/challenges`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({
        title: desafio.title,
        goal: { checksRequired: desafio.goal.checksRequired },
        endDate: desafio.endDate,
        startDate: desafio.startDate,
        privacy: "participants_only",
        category: desafio.goal.categoryTitle,
        invitedFriendIds: desafio.invitedFriendIds,
      }),
    });

    const dataCriacao = await response.json(); // ✅ lê o corpo uma vez

    if (!response.ok) {
      throw new Error(`Erro ao criar desafio: ${JSON.stringify(dataCriacao)}`);
    }

    // segunda requisição
    console.log(dataCriacao.data.id);
    // console.log(dataCriacao.id);
    const response2 = await fetch(`${API_BASE_URL}/challenges/invit`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({
        challengeId: dataCriacao.data.id,
        userIds: desafio.invitedFriendIds,
      }),
    });

    const dataInvit = await response2.json();

    if (!response2.ok) {
      throw new Error(`Erro ao convidar usuários: ${JSON.stringify(dataInvit)}`);
    }

    return dataCriacao;
  }else{
    // crio um habito
    const response = await fetch(`${API_BASE_URL}/habits`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({
        title: desafio.title,
        goal: { checksRequired: desafio.goal.checksRequired },
        expirationDate: desafio.endDate,
        startDate: desafio.startDate,
        privacy: "participants_only",
        category: desafio.goal.categoryTitle,
        invitedFriendIds: desafio.invitedFriendIds,
      }),
    });

    const dataCriacao = await response.json(); // ✅ lê o corpo uma vez

    if (!response.ok) {
      throw new Error(`Erro ao criar habito: ${JSON.stringify(dataCriacao)}`);
    }

    return dataCriacao;
  }
}
}