import { useFocusEffect, useRouter } from 'expo-router';
import React, { useCallback, useState } from 'react';
import {
  ActivityIndicator,
  Button,
  FlatList,
  Image,
  RefreshControl,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View
} from 'react-native';
// Ajuste o caminho se necessário
import { apiRequest, checkInHabit, getToken, logout } from '../../services/api';
// REMOVIDO: HabitoConcluido e HabitoProgresso (Substituído por renderização inline)
import { Ionicons } from '@expo/vector-icons';
import { jwtDecode } from "jwt-decode"; 

// --- Interfaces ---
interface UserProfile {
  id: number;
  name: string;
  email: string;
  role?: string; // <- TORNAR OPCIONAL
  createdAt?: string; // <- TORNAR OPCIONAL
  profile: {
    avatar: string | null;
    bio: string;
    locale?: string;
    timezone?: string;
  };
  settings: {
    notifications?: boolean;
    remindersDefault?: string;
    privateByDefault?: boolean;
  };
  friends: number[];
  stats: { points: number; level: number };
  points?: number;
  level?: number;
  user?: any;
}
interface Habit {
  id: number;
  userId: number;
  title: string;
  description: string;
  frequency: string;
  schedule: string[];
  reminders: string[];
  streak: number;
  bestStreak: number;
  lastCheckIn: string | null;
  pointsPerCheckIn: number;
  active: boolean;
  privacy: string;
  createdAt: string;
  jokerUsedDates: string[];
}
interface HabitsByStatus {
  ativos: Habit[];
  inativos: Habit[];
}
interface JwtPayload {
  userId: number /* outros campos... */;
} 

export default function IndexScreen() {
  const router = useRouter();
  const [usuario, setUsuario] = useState<UserProfile | null>(null);
  const [habitos, setHabitos] = useState<HabitsByStatus>({ ativos: [], inativos: [] });
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [checkInLoading, setCheckInLoading] = useState<number | null>(null);

  // --- Função para buscar todos os dados ---
  const fetchData = useCallback(async (isRefreshing = false) => {
    if (!isRefreshing && !usuario) setLoading(true);
    setError(null);
    let currentUserId: number | null = null;
    let userProfileData: UserProfile | null = null;

    // 1. Obter User ID e Perfil
    try {
      const token = await getToken();
      if (!token) { 
        setError("Sessão expirada."); 
        if (!isRefreshing) setLoading(false); 
        router.replace('/login'); 
        return; 
      }

      try {
          const decoded = jwtDecode<JwtPayload>(token); currentUserId = decoded.userId;
      } catch (decodeError) { 
        console.error("Erro decode:", decodeError); 
        setError("Sessão inválida."); 
        await logout(); 
        if (!isRefreshing) setLoading(false); 
        router.replace('/login'); 
        return; 
      }

      // Sempre busca o perfil se currentUserId for diferente de null
      if (currentUserId) {
          console.log(`Buscando perfil para userId: ${currentUserId}`);
        userProfileData = await apiRequest(`/user/`);
        console.log('Dados brutos do perfil:', userProfileData);
        const raw: any = userProfileData;

        // EXTRAI O CAMPO 'data' SE EXISTIR (formato: {success: true, data: {...}})
        const userData = raw.data || raw;

        let normalized: any = {};

        // Normaliza quando backend retorna { token, user: { ... } } ou retorna user direto
        if (userData?.user) {
          normalized = {
            id: userData.user.userId ?? userData.user.id ?? userData.id,
            name: userData.user.name ?? userData.name ?? 'Usuário',
            email: userData.user.email ?? userData.email ?? '',
            createdAt: userData.user.created_at ?? userData.created_at,
            profile: userData.user.profile ?? userData.profile ?? { avatar: null, bio: '' },
            settings: userData.user.settings ?? userData.settings ?? {},
            friends: userData.user.friends ?? userData.friends ?? [],
            stats: {
              points: userData.user.points ?? userData.points ?? 0,
              level: userData.user.level ?? userData.level ?? 1,
            },
          };
        } else {
          // Caso o backend retorne o usuário plano (sem wrapper "user")
          normalized = {
            id: userData.id,
            name: userData.name ?? 'Usuário',
            email: userData.email ?? '',
            createdAt: userData.created_at ?? userData.createdAt,
            profile: { avatar: userData.avatar_url ?? null, bio: '' },
            settings: {},
            friends: [],
            stats: { points: userData.points ?? 0, level: userData.level ?? 1 },
          };
        }

        userProfileData = normalized as UserProfile;
        console.log('Perfil normalizado:', userProfileData);
          setUsuario(userProfileData); // <-- ATUALIZA ESTADO DO USUÁRIO AQUI
      }
      //  else if (usuario) {
      //     currentUserId = usuario.id;
      // }

      if (!currentUserId) { 
        throw new Error("Não foi possível obter o ID do usuário.");
      }

    } catch (err) {
      console.error('Erro user/token:', err);
      let errorMsg = 'Erro ao carregar dados do usuário.';
      if (err instanceof Error) {
        errorMsg = err.message;
        if (errorMsg.includes('401') || errorMsg.includes('403') || errorMsg.includes('Token inválido')) {
          errorMsg = 'Sessão inválida ou expirada.';
          await logout();
          router.replace('/login');
        }
      } else if (typeof err === 'string') {
        errorMsg = err;
      }
      setError(errorMsg);
      setLoading(false); 
      setRefreshing(false); 
      return;
    }

    // 2. Buscar Hábitos do Usuário
    try {
      console.log(`Buscando hábitos visíveis para userId: ${currentUserId}`);
      const habitsResponse = await apiRequest('/user/allHabits');
      console.log('Hábitos recebidos:', habitsResponse);
      if (Array.isArray(habitsResponse)) {
        // FILTRAGEM CORRETA:
        const ativos = habitsResponse.filter((h: Habit) => h.active);
        const inativos = habitsResponse.filter((h: Habit) => !h.active); // ID 3 ("Academia") deve vir para cá
        setHabitos({ ativos, inativos });
      } else { setHabitos({ ativos: [], inativos: [] }); }
    } catch (err) {
       console.error('Erro hábitos:', err);
       setError('Não foi possível carregar os hábitos.');
       setHabitos({ ativos: [], inativos: [] });
     }
    finally { 
      if (!isRefreshing) setLoading(false); 
      setRefreshing(false); 
    }
  }, [router]);

  // --- useFocusEffect para Recarregar ao Voltar para a Tela ---
  useFocusEffect(
    useCallback(() => {
      console.log('Tela Index em foco, buscando dados...');
      fetchData();
    }, [fetchData])
  );

  const onRefresh = useCallback(() => {
    console.log('Iniciando refresh...');
    setRefreshing(true);
    fetchData(true);
  }, [fetchData]);

  // --- Função para fazer Check-in ---
  const handleCheckIn = async (habitId: number) => {
      if (checkInLoading) return;
      setCheckInLoading(habitId);
      setError(null);

      const result = await checkInHabit(habitId);

      if (result.success) {
          console.log('Check-in com sucesso:', result.command);
          setHabitos(prev => ({
              ...prev,
              ativos: prev.ativos.map(h => 
                  h.id === habitId 
                  ? { ...h, 
                      lastCheckIn: new Date().toISOString().slice(0, 10), 
                      streak: (h.streak || 0) + 1 
                    }
                  : h
              )
          }));
          fetchData(true); // Faz um refresh silencioso
      } else {
          console.error("Erro no check-in:", result.error);
          setError(result.error || "Falha ao fazer check-in.");
      }
      setCheckInLoading(null);
  };


  // --- Renderização ---

  if (loading) {
    return <View style={styles.centered}><ActivityIndicator size="large" color="#007AFF" /><Text style={styles.loadingText}>Carregando perfil...</Text></View>;
  }

  if (!usuario) {
       return (
         <View style={styles.centered}>
            <Ionicons name="alert-circle-outline" size={40} color="red" />
            <Text style={[styles.errorText, { marginTop: 15 }]}>{error || "Não foi possível carregar os dados do perfil."}</Text>
            <Button title="Tentar Novamente" onPress={() => fetchData()} />
            <View style={{marginTop: 10}}>
             <Button title="Logout" onPress={async () => { await logout(); router.replace('/login'); }} color="red" />
            </View>
         </View>
      );
  }

  // Renderização principal do perfil
  return (
    <SafeAreaView style={styles.containerSafeArea}>
      <ScrollView
        showsVerticalScrollIndicator={false}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} colors={["#007AFF"]} tintColor={"#007AFF"}/>}
        contentContainerStyle={styles.scrollContainer}
      >
        {/* Seção Perfil */}
        <View style={styles.profileSection}>
          <Image
            source={{ uri: usuario!.profile?.avatar || 'https://placehold.co/100x100/007AFF/FFFFFF?text=' + (usuario!.name?.charAt(0).toUpperCase() || 'U') }}
            style={styles.avatar}
          />
          <Text style={styles.name}>{usuario!.name}</Text>

          {usuario!.profile?.bio ? <Text style={styles.bio}>{usuario!.profile.bio}</Text> : null}
          <View style={styles.statsRow}>
             {/* Estatísticas baseadas no usuário logado */}
             <Text style={styles.statItem}>🔥 { Math.max(0, ...(habitos.ativos.map(h => h.streak || 0))) } Dias</Text>
             <Text style={styles.statItem}>💧 {usuario!.stats.points} pts</Text>
             <Text style={styles.statItem}>⭐ Nível {usuario!.stats.level}</Text>
          </View>
        </View>

        {/* Seção de erro não fatal */}
        {error && <Text style={styles.errorText}>{error}</Text>}

        {/* Habitos Ativos */}
        <Text style={styles.sectionTitle}>Hábitos Ativos</Text>
        {refreshing && !loading ? <ActivityIndicator style={{marginTop: 10}}/> : habitos.ativos.length === 0 ? (
            <Text style={styles.infoText}>Nenhum hábito ativo.</Text>
        ) : (
            <FlatList
                data={habitos.ativos}
                keyExtractor={(item) => item.id.toString()}
                renderItem={({ item }) => {
                    const isDoneToday = item.lastCheckIn === new Date().toISOString().slice(0, 10);
                    const isLoadingThis = checkInLoading === item.id;
                    return (
                        // Card de Hábito Ativo
                        <View style={styles.habitCard}>
                            <View style={styles.habitInfo}>
                                <Text style={styles.habitTitle}>{item.title}</Text>
                                <Text style={styles.habitStreak}>Sequência: {item.streak || 0} dias</Text>
                            </View>
                            <View style={styles.habitCheck}>
                                {isLoadingThis ? (
                                    <ActivityIndicator color="#007AFF" /> 
                                ) : isDoneToday ? (
                                    // Checkmark Verde
                                    <Ionicons name="checkmark-circle" size={32} color="#34C759" />
                                ) : (
                                    // Botão de Check-in (Círculo Vazio)
                                    <TouchableOpacity 
                                      onPress={() => handleCheckIn(item.id)} 
                                      disabled={checkInLoading !== null} 
                                    >
                                        <Ionicons name="ellipse-outline" size={32} color="#ccc" />
                                    </TouchableOpacity>
                                )}
                            </View>
                        </View>
                    );
                }}
                scrollEnabled={false}
             />
        )}

        {/* Hábitos Inativos */}
        <Text style={styles.sectionTitle}>Hábitos Arquivados</Text>
         {refreshing ? <ActivityIndicator style={{marginTop: 10}}/> : habitos.inativos.length === 0 ? (
            <Text style={styles.infoText}>Nenhum hábito arquivado.</Text>
         ) : (
             <FlatList
                 data={habitos.inativos}
                 keyExtractor={(item) => item.id.toString()}
                 renderItem={({ item }) => (
                    // Card de Hábito Arquivado
                    <View style={[styles.habitCard, styles.habitDoneCard]}>
                        <Ionicons name="archive-outline" size={24} color="#888" style={{marginRight: 10}} />
                        <View style={styles.habitInfo}>
                            <Text style={styles.habitDoneTitle}>{item.title}</Text>
                            <Text style={styles.habitDoneStreak}>Melhor Sequência: {item.bestStreak || 0} dias</Text>
                        </View>
                    </View>
                 )}
                 scrollEnabled={false}
             />
         )}

        {/* Botões de Ação */}
        <View style={styles.buttonContainer}>
          <Button title="Criar Desafio" onPress={() => router.push('//criarDesafio')} />
          <View style={{ marginTop: 15 }}>
            <Button title="Logout" onPress={async () => { await logout(); router.replace('/login'); }} color="#FF3B30" />
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

// --- Estilos ---
const styles = StyleSheet.create({
  containerSafeArea: { flex: 1, backgroundColor: '#f0f0f0' },
  scrollContainer: { paddingBottom: 40, },
  centered: { flex: 1, justifyContent: "center", alignItems: "center", padding: 20, backgroundColor: '#f0f0f0', },
  profileSection: { alignItems: 'center', marginVertical: 25, paddingHorizontal: 20, },
  avatar: { width: 100, height: 100, borderRadius: 50, marginBottom: 12, borderWidth: 3, borderColor: '#fff', backgroundColor: '#eee', shadowColor: "#000", shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.1, shadowRadius: 4, elevation: 5, },
  name: { fontSize: 22, fontWeight: 'bold', color: '#333', marginBottom: 5, },
  bio: { fontSize: 15, color: '#666', textAlign: 'center', marginBottom: 15, },
  statsRow: { flexDirection: 'row', justifyContent: 'space-around', marginTop: 10, backgroundColor: '#fff', paddingVertical: 16, paddingHorizontal: 16, borderRadius: 16, width: '100%', elevation: 4, shadowColor: "#000", shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.08, shadowRadius: 6, },
  statItem: { fontSize: 15, color: '#333', fontWeight: '500', textAlign: 'center', },
  sectionTitle: { fontSize: 20, fontWeight: '600', marginTop: 28, marginBottom: 12, marginLeft: 15, color: '#444', },
  buttonContainer: { marginTop: 32, paddingHorizontal: 20, },
  errorText: { color: 'red', textAlign: 'center', marginVertical: 10, paddingHorizontal: 20, fontSize: 15, fontWeight: '500', },
  infoText: { textAlign: 'center', color: '#666', marginVertical: 15, fontSize: 15, paddingHorizontal: 20, },
  loadingText: { marginTop: 10, color: '#666', fontSize: 16 },
  
  // --- NOVOS ESTILOS PARA HÁBITOS (Substituindo os componentes) ---
  habitCard: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#fff',
    borderRadius: 12,
    paddingVertical: 14,
    paddingHorizontal: 16,
    marginHorizontal: 15,
    marginBottom: 10,
    elevation: 2,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2.5,
  },
  habitInfo: {
    flex: 1, // Ocupa o espaço disponível
    marginRight: 10,
  },
  habitTitle: {
    fontSize: 17, // Fonte maior
    fontWeight: '600',
    color: '#333',
  },
  habitStreak: {
    fontSize: 14,
    color: '#666',
    marginTop: 3,
  },
  habitCheck: {
    paddingLeft: 10,
    alignItems: 'center',
    justifyContent: 'center',
    width: 40, // Largura fixa para ícone/loading
  },
  habitDoneCard: { // Estilo para hábitos arquivados
    backgroundColor: '#f9f9f9', // Fundo diferente
    opacity: 0.8,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-start',
    elevation: 0,
    shadowOpacity: 0,
    borderWidth: 1, // Borda sutil para diferenciar
    borderColor: '#eee',
  },
  habitDoneTitle: {
    fontSize: 16,
    fontWeight: '500',
    color: '#888',
    textDecorationLine: 'line-through', // Riscado
    marginLeft: 10, // Se não tiver o ícone de check
  },
  habitDoneStreak: {
    fontSize: 14,
    color: '#999',
    marginTop: 2,
  },
});