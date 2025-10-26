import React, { useEffect, useState, useCallback } from 'react';
import {
  View,
  Text,
  Image,
  ScrollView,
  TouchableOpacity, // Agora será usado para o check-in
  StyleSheet,
  SafeAreaView,
  Button,
  ActivityIndicator,
  FlatList,
  RefreshControl
} from 'react-native';
import { useRouter, useFocusEffect } from 'expo-router';
// Ajuste o caminho se necessário (ex: ../services/api)
import { apiRequest, getToken, logout, checkInHabit } from '../../services/api'; 
// REMOVIDO: HabitoConcluido, HabitoProgresso
import { Ionicons } from '@expo/vector-icons';

// Opcional: Se for decodificar token no frontend
import { jwtDecode } from "jwt-decode"; 

// --- Interfaces ---
interface UserProfile { id: number; name: string; email: string; role: string; createdAt: string; profile: { avatar: string | null; bio: string; locale?: string; timezone?: string; }; settings: { notifications?: boolean; remindersDefault?: string; privateByDefault?: boolean; }; friends: number[]; stats: { points: number; level: number; }; }
interface Habit { id: number; userId: number; title: string; description: string; frequency: string; schedule: string[]; reminders: string[]; streak: number; bestStreak: number; lastCheckIn: string | null; pointsPerCheckIn: number; active: boolean; privacy: string; createdAt: string; jokerUsedDates: string[]; }
interface HabitsByStatus { ativos: Habit[]; inativos: Habit[]; }
interface JwtPayload { userId: number; /* outros campos... */ } // Interface mínima para o decode

export default function IndexScreen() {
  const router = useRouter();
  const [usuario, setUsuario] = useState<UserProfile | null>(null);
  const [habitos, setHabitos] = useState<HabitsByStatus>({ ativos: [], inativos: [] });
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  // Estado para bloquear cliques durante check-in
  const [checkInLoading, setCheckInLoading] = useState<number | null>(null); // Guarda o ID do hábito

  // --- Função para buscar todos os dados ---
  const fetchData = useCallback(async (isRefreshing = false) => {
    // Só mostra loading inicial na primeira carga
    if (!isRefreshing && !usuario) setLoading(true); 
    setError(null);
    let currentUserId: number | null = null;
    let userProfileData: UserProfile | null = null;

    // 1. Obter User ID e Perfil
    try {
      const token = await getToken();
      if (!token) { setError("Sessão expirada."); if (!isRefreshing) setLoading(false); router.replace('/login'); return; }

      try {
          const decoded = jwtDecode<JwtPayload>(token); currentUserId = decoded.userId;
      } catch (decodeError) { console.error("Erro decode:", decodeError); setError("Sessão inválida."); await logout(); if (!isRefreshing) setLoading(false); router.replace('/login'); return; }

      // Busca perfil completo SE ainda não tiver ou for um refresh manual
      if (currentUserId && (!usuario || isRefreshing)) {
          console.log(`Buscando perfil para userId: ${currentUserId}`);
          userProfileData = await apiRequest(`/users/${currentUserId}`);
          setUsuario(userProfileData);
      } else if (usuario) {
          // Se já tem usuário e não é refresh, usa o ID do estado atual
          currentUserId = usuario.id;
      }

      if (!currentUserId) { throw new Error("Não foi possível obter o ID do usuário.");}

    } catch (err) { // Tratamento de erro 'unknown'
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
      setLoading(false); setRefreshing(false); return;
    }

    // 2. Buscar Hábitos do Usuário
    try {
      console.log(`Buscando hábitos visíveis para userId: ${currentUserId}`);
      // Chama a API que já filtra pela privacidade (baseado no token)
      const habitsResponse = await apiRequest('/habits-visible'); 
      if (Array.isArray(habitsResponse)) {
        // Separa os hábitos entre ativos e inativos
        const ativos = habitsResponse.filter((h: Habit) => h.active);
        const inativos = habitsResponse.filter((h: Habit) => !h.active);
        setHabitos({ ativos, inativos });
      } else { setHabitos({ ativos: [], inativos: [] }); }
    } catch (err) {
       console.error('Erro hábitos:', err);
       setError('Não foi possível carregar os hábitos.');
       setHabitos({ ativos: [], inativos: [] });
     }
    finally { if (!isRefreshing) setLoading(false); setRefreshing(false); }
  // Dependência [router] para a função 'replace'
  // [usuario] foi removido para evitar loops (lógica !usuario || isRefreshing já controla)
  }, [router]); 

  // --- useFocusEffect para Recarregar ao Voltar para a Tela ---
  useFocusEffect(
    useCallback(() => {
      console.log('Tela Index em foco, buscando dados...');
      fetchData(); // Chama fetchData toda vez que a tela recebe foco
    }, [fetchData]) // Depende da função fetchData
  );

  // --- onRefresh (Pull-to-Refresh) ---
  const onRefresh = useCallback(() => {
    console.log('Iniciando refresh...');
    setRefreshing(true);
    fetchData(true); // Chama fetchData indicando que é refresh manual
  }, [fetchData]); // Depende de fetchData

  // --- Função para fazer Check-in ---
  const handleCheckIn = async (habitId: number) => {
      if (checkInLoading) return; // Impede clique duplo
      setCheckInLoading(habitId); // Define o ID do hábito que está carregando
      setError(null); // Limpa erros antigos

      // Chama a função 'checkInHabit' da api.ts
      const result = await checkInHabit(habitId); 

      if (result.success) {
          console.log('Check-in com sucesso:', result.command);
          // Otimista: Atualiza a UI imediatamente para o usuário ver
          setHabitos(prev => ({
              ...prev,
              ativos: prev.ativos.map(h => 
                  h.id === habitId 
                  ? { ...h, 
                      lastCheckIn: new Date().toISOString().slice(0, 10), // Marca como feito hoje
                      streak: (h.streak || 0) + 1 // Incrementa streak (pode ser corrigido pelo fetchData)
                    }
                  : h
              )
          }));
          // Atualiza dados completos (recarrega pontos e streaks corretos do backend)
          fetchData(true); // Faz um refresh silencioso em background
      } else {
          console.error("Erro no check-in:", result.error);
          setError(result.error || "Falha ao fazer check-in.");
      }
      setCheckInLoading(null); // Libera o botão
  };


  // --- Renderização ---

  // Estado de Loading Inicial
  if (loading) {
    return <View style={styles.centered}><ActivityIndicator size="large" color="#007AFF" /><Text style={styles.loadingText}>Carregando perfil...</Text></View>;
  }

  // Estado de Erro Fatal (não conseguiu carregar usuário)
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
  // Adicionado '!' para 'usuario' para corrigir erros de 'possibly null'
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
            source={{ uri: usuario!.profile?.avatar || 'https://placehold.co/100x100/007AFF/FFFFFF?text=' + usuario!.name.charAt(0).toUpperCase() }}
            style={styles.avatar}
          />
          <Text style={styles.name}>{usuario!.name}</Text>
          {usuario!.profile?.bio ? <Text style={styles.bio}>{usuario!.profile.bio}</Text> : null}
          <View style={styles.statsRow}>
             {/* Calcula o maior streak ATIVO */}
             <Text style={styles.statItem}>🔥 { Math.max(0, ...(habitos.ativos.map(h => h.streak || 0))) } Dias</Text>
             <Text style={styles.statItem}>💧 {usuario!.stats.points} pts</Text>
             <Text style={styles.statItem}>⭐ Nível {usuario!.stats.level}</Text>
          </View>
        </View>

        {/* Seção de erro não fatal (ex: falha ao carregar hábitos) */}
        {error && <Text style={styles.errorText}>{error}</Text>}

        {/* Hábitos Ativos */}
        <Text style={styles.sectionTitle}>Hábitos Ativos</Text>
        {refreshing && !loading ? <ActivityIndicator style={{marginTop: 10}}/> : habitos.ativos.length === 0 ? (
            <Text style={styles.infoText}>Nenhum hábito ativo.</Text>
        ) : (
            <FlatList
                data={habitos.ativos}
                keyExtractor={(item) => item.id.toString()}
                renderItem={({ item }) => {
                    // --- RENDERIZAÇÃO INLINE (Sem HabitoProgresso) ---
                    // Verifica se o último check-in foi hoje
                    const isDoneToday = item.lastCheckIn === new Date().toISOString().slice(0, 10);
                    // Verifica se este hábito específico está carregando o check-in
                    const isLoadingThis = checkInLoading === item.id;
                    
                    return (
                        // Card clicável (mas o clique agora é no botão de check-in)
                        <View style={styles.habitCard}>
                            <View style={styles.habitInfo}>
                                <Text style={styles.habitTitle}>{item.title}</Text>
                                {/* Exibe o dado REAL 'streak' do db.json */}
                                <Text style={styles.habitStreak}>Sequência: {item.streak || 0} dias</Text>
                            </View>
                            {/* Lógica do Botão de Check-in */}
                            <View style={styles.habitCheck}>
                                {isLoadingThis ? (
                                    <ActivityIndicator color="#007AFF" /> // Mostra loading
                                ) : isDoneToday ? (
                                    // Hábito feito hoje (baseado na imagem 1401c8.png)
                                    <Ionicons name="checkmark-circle" size={32} color="#34C759" />
                                ) : (
                                    // Botão (TouchableOpacity) para fazer check-in
                                    <TouchableOpacity 
                                      onPress={() => handleCheckIn(item.id)} 
                                      disabled={checkInLoading !== null} // Desabilita se QUALQUER check-in estiver ocorrendo
                                    >
                                        <Ionicons name="ellipse-outline" size={32} color="#ccc" />
                                    </TouchableOpacity>
                                )}
                            </View>
                        </View>
                    );
                    // --- FIM DA RENDERIZAÇÃO INLINE ---
                }}
                scrollEnabled={false} // Desabilita scroll da lista interna
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
                    // --- RENDERIZAÇÃO INLINE (Sem HabitoConcluido) ---
                    <View style={[styles.habitCard, styles.habitDoneCard]}>
                        <Ionicons name="archive-outline" size={24} color="#888" style={{marginRight: 10}} />
                        <View style={styles.habitInfo}>
                            <Text style={styles.habitDoneTitle}>{item.title}</Text>
                            {/* Exibe o dado REAL 'bestStreak' do db.json */}
                            <Text style={styles.habitDoneStreak}>Melhor Sequência: {item.bestStreak || 0} dias</Text>
                        </View>
                    </View>
                    // --- FIM DA RENDERIZAÇÃO INLINE ---
                 )}
                 scrollEnabled={false} // Desabilita scroll da lista interna
             />
         )}

        {/* Botões de Ação */}
        <View style={styles.buttonContainer}>
          {/* --- CORREÇÃO Navegação (Usando o caminho que você confirmou) --- */}
          <Button title="Criar Desafio" onPress={() => router.push('/(tabs)/criarDesafio')} />
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
    paddingVertical: 14, // Um pouco mais de altura
    paddingHorizontal: 16,
    marginHorizontal: 15, // Alinha com o título da seção
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
    marginLeft: 10,
    marginTop: 2,
  },
});