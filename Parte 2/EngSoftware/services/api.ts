import AsyncStorage from '@react-native-async-storage/async-storage';

// Define a URL base da sua API local
const API_URL = 'http://localhost:3000'; // <- Usando localhost

// Chave para salvar o token no AsyncStorage
const TOKEN_KEY = '@MyApp:token'; // Use um nome específico para seu App

// --- Funções de Gerenciamento de Token ---

// Salva o token no AsyncStorage
export const storeToken = async (token: string): Promise<void> => {
  try {
    await AsyncStorage.setItem(TOKEN_KEY, token);
    console.log('Token armazenado com sucesso!');
  } catch (e) {
    console.error('Erro ao armazenar o token:', e);
    // Poderia lançar o erro novamente ou lidar com ele de outra forma
  }
};

// Recupera o token do AsyncStorage
export const getToken = async (): Promise<string | null> => {
  try {
    const token = await AsyncStorage.getItem(TOKEN_KEY);
    return token;
  } catch (e) {
    console.error('Erro ao recuperar o token:', e);
    return null; // Retorna null em caso de erro
  }
};

// --- Funções de Chamada de API ---

export const apiRequest = async (
  endpoint: string,
  method: 'GET' | 'POST' | 'PUT' | 'DELETE' = 'GET',
  body?: object | null // Corpo da requisição (para POST, PUT)
): Promise<any> => { // Retorna 'any' por simplicidade, idealmente use tipos genéricos
  try {
    const token = await getToken();
    const headers: HeadersInit = {
      'Content-Type': 'application/json',
    };

    // Adiciona o cabeçalho Authorization se o token existir
    if (token) {
      headers['Authorization'] = `Bearer ${token}`; // Formato esperado pelo backend
    }

    const config: RequestInit = {
      method: method,
      headers: headers,
    };

    // Adiciona o corpo se ele for fornecido (para POST/PUT)
    if (body) {
      config.body = JSON.stringify(body);
    }

    console.log(`API Request: ${method} ${API_URL}${endpoint}`); // Log da requisição
    const response = await fetch(`${API_URL}${endpoint}`, config);

    // Se a resposta não for OK (ex: 401, 403, 404, 500), lança um erro
    if (!response.ok) {
      let errorData = { error: `Erro ${response.status}: ${response.statusText}` }; // Erro padrão
      try {
        // Tenta pegar uma mensagem de erro mais específica do JSON da resposta
        errorData = await response.json();
      } catch (jsonError) {
        // Ignora se a resposta não for JSON
        console.warn('Resposta de erro da API não era JSON:', response.statusText);
      }

      console.error(`Erro na API ${method} ${endpoint}: ${response.status}`, errorData);

      // Se for erro de autenticação (401 ou 403), pode ser útil limpar o token inválido
      if (response.status === 401 || response.status === 403) {
         console.log("Erro de autenticação (401/403), limpando token armazenado...");
         await removeToken();
         // Aqui você poderia disparar um evento ou navegação para a tela de login
      }
      // Lança um erro com a mensagem recebida da API ou uma padrão
      throw new Error(errorData.error || `Erro ${response.status}`);
    }

    // Se a resposta for OK, retorna o JSON
    // Trata respostas sem corpo (ex: DELETE pode retornar 204 No Content)
    if (response.status === 204) {
        console.log(`API Response: ${method} ${endpoint} - 204 No Content`);
        return { success: true }; // Ou o que fizer sentido
    }

    const responseData = await response.json();
    console.log(`API Response: ${method} ${endpoint} - ${response.status}`, responseData);
    return responseData;

  } catch (error) {
    console.error(`Falha na requisição para ${method} ${endpoint}:`, error);

    let errorMessage = 'Erro de rede ou falha na requisição'; // Mensagem padrão
    if (error instanceof Error) {
      errorMessage = error.message; 
    } else if (typeof error === 'string') {
      errorMessage = error; 
    }
    throw new Error(errorMessage);
  }
};

// --- Funções Específicas da API (Usando apiRequest) ---

export const login = async (
  email: string, // <-- CORREÇÃO 1: Adiciona tipo string
  password: string // <-- CORREÇÃO 2: Adiciona tipo string
): Promise<{ success: boolean; error?: string }> => {
  try {
    const data = await apiRequest('/login', 'POST', { email, password }); //
    if (data && data.token) { // Verifica se data e data.token existem
      await storeToken(data.token); // Salva o token recebido
      return { success: true };
    }
    // Se não veio token, mesmo com status 200 (improvável, mas seguro)
    return { success: false, error: 'Token não recebido do servidor' };
  } catch (error) {
    // --- CORREÇÃO 3 e 4: Tratar erro 'unknown' ---
    let errorMessage = 'Erro desconhecido ao tentar fazer login'; // Mensagem padrão
    if (error instanceof Error) {
      errorMessage = error.message; // Acessa .message apenas se for do tipo Error
    } else if (typeof error === 'string') {
      errorMessage = error; // Se o próprio erro for uma string
    }
    console.error('Erro capturado no login:', error); // Loga o erro original para depuração
    return { success: false, error: errorMessage };
  }
};
// Função de Registro
// Retorna { success: true, user: any } ou { success: false, error: string }

export const register = async (
  name: string,
  email: string,
  password: string
): Promise<{ success: boolean; user?: any; error?: string }> => {
    try {
        // Chama a função genérica apiRequest para fazer a chamada POST para /register
        // Não precisamos nos preocupar com o token aqui; apiRequest não o enviará
        // se ele não existir (o que é o caso durante o registro).
        const registeredUser = await apiRequest('/register', 'POST', { name, email, password }); // Chama o endpoint POST /register

        // Se apiRequest foi bem-sucedido (não lançou erro), retorna sucesso
        // e os dados do usuário recém-criado (sem o hash da senha, como definido no backend)
        return { success: true, user: registeredUser };

    } catch(error) {
        // Se apiRequest lançou um erro (capturado do fetch ou do backend),
        // trata o erro para retornar a mensagem correta.
        let errorMessage = 'Erro desconhecido ao tentar registrar a conta.'; // Mensagem padrão
        if (error instanceof Error) {
          errorMessage = error.message; // Usa a mensagem do erro capturado
        } else if (typeof error === 'string') {
          errorMessage = error; // Se o erro for apenas uma string
        }
        console.error('Erro capturado na função register:', error); // Loga o erro original
        // Retorna falha com a mensagem de erro tratada
        return { success: false, error: errorMessage };
    }
};
// --- Funções Específicas da API (Continuação) ---

interface CreateChallengeData {
  title: string;
  startDate: string; 
  endDate: string;   
  goal: {
    categoryTitle: string;
    checksRequired: number;
  };
  invitedFriendIds: number[]; // <-- MUDANÇA (antes era participantIds)
  privacy: 'public' | 'participants_only' | 'private';
}

// Função para Criar um Novo Desafio (ATUALIZADA)
export const createChallenge = async (
  challengeData: Omit<CreateChallengeData, 'creatorId'> // Omitimos creatorId, pois o backend define
): Promise<{ success: boolean; challenge?: any; error?: string }> => {
    try {
        // A chamada continua a mesma, mas o objeto 'challengeData' agora tem 'invitedFriendIds'
        const newChallenge = await apiRequest('/challenges', 'POST', challengeData); 
        return { success: true, challenge: newChallenge };
    } catch(error) {
        let msg = 'Erro desconhecido ao criar desafio.'; 
        if (error instanceof Error) { msg = error.message; } 
        else if (typeof error === 'string') { msg = error; }
        console.error('Erro em createChallenge:', error); 
        return { success: false, error: msg };
    }
};

// Remove o token (Função auxiliar)
export const removeToken = async (): Promise<void> => {
  try {
    await AsyncStorage.removeItem(TOKEN_KEY); // <-- APAGA O TOKEN
    console.log('Token removido com sucesso (Logout)!');
  } catch (e) {
    console.error('Erro ao remover o token:', e);
  }
};

// Função de Logout principal (Exportada e usada pela UI)
export const logout = async (): Promise<void> => {
    await removeToken(); // Chama a função para apagar o token
    // Adicional: Aqui você poderia limpar algum estado global (Context API, Redux, etc.) se necessário
    console.log("Usuário deslogado.");
};

export const checkInHabit = async (habitId: number): Promise<{ success: boolean; command?: any; error?: string }> => {
  
  // 1. Monta o objeto 'command' que o backend (db.js) espera
  const commandBody = {
    type: 'checkin',
    target: {
      type: 'habit',
      id: habitId
    },
    metadata: {
      source: 'app' // Informa que a ação veio do aplicativo
    }
  };

  try {
    // 2. Chama o endpoint POST /commands com o objeto do comando
    // apiRequest já lida com o método POST e o token JWT
    const result = await apiRequest('/commands', 'POST', commandBody); //
    
    // 3. Retorna sucesso com o resultado do comando
    return { success: true, command: result };

  } catch (error) {
    // 4. Trata qualquer erro (ex: 401, 500, ou erro de rede)
    let errorMessage = 'Erro desconhecido ao tentar fazer check-in';
    if (error instanceof Error) {
      errorMessage = error.message;
    } else if (typeof error === 'string') {
      errorMessage = error;
    }
    console.error('Erro capturado em checkInHabit:', error);
    return { success: false, error: errorMessage };
  }
};

// ... (Restante das suas funções em api.ts: getVisibleHabits, logout, etc.)