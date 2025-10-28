// FriendService.ts
import { FriendModel } from "../models/FriendModel";

const API_BASE_URL = "http://localhost:3000"; // <--- ajuste aqui

export const FriendService = {
  async getFriends(token: string): Promise<FriendModel[]> {
    const res = await fetch(`${API_BASE_URL}/user/friends`, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    });

    if (!res.ok) {
      const txt = await res.text().catch(() => "");
      throw new Error(`Erro ao buscar amigos (${res.status}) ${txt}`);
    }

    const data = await res.json();
    // Normaliza: suporta { data: [...] } ou array direto
    const arr = Array.isArray(data) ? data : Array.isArray(data.data) ? data.data : [];
    return arr.map((a: any) => ({
      id: String(a.id ?? a.userId),
      name: a.name ?? a.username ?? a.fullName ?? a.nome ?? "",
      email: a.email,
      isFriend: !!a.isFriend,
    }));
  },

  async searchFriendByName(token: string, name: string): Promise<{ userId: string; isFriend: boolean } | null> {
    const res = await fetch(`${API_BASE_URL}/user/search`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ name: name }),
    });

    if (!res.ok) {
      const txt = await res.text().catch(() => "");
      throw new Error(`Erro ao procurar amigo (${res.status}) ${txt}`);
    }

    const result = await res.json();
    if (!result || !result.success || !result.data) return null;
    console.log(result);
    if (result.success && Array.isArray(result.data) && result.data.length > 0) {
      const firstUser = result.data[0];
      return { 
        userId: String(firstUser.id), 
        isFriend: !!firstUser.is_friend 
      };
    }
  },

  /**
   * Tenta adicionar um amigo. Adapte o endpoint caso seu backend use outro.
   * Aqui usamos POST /user/friends com body { userId }.
   */
  async addFriend(token: string, userId: string): Promise<{ success: boolean; message?: string }> {
    console.log("tentando adiconar amigo", userId);
    const res = await fetch(`${API_BASE_URL}/friend/invit/${userId}`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    });

    // Se backend usa outro endpoint, ajuste aqui (ex: /user/friends/add)

    if (!res.ok) {
      const txt = await res.text().catch(() => "");
      throw new Error(`Erro ao adicionar amigo (${res.status}) ${txt}`);
    }

    const data = await res.json();
    // espera algo como { success: true, message?: "..." }
    return { success: !!data.success, message: data.message };
  },
};
