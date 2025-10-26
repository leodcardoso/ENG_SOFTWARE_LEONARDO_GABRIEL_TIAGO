import React, { useEffect, useState, useCallback } from 'react';
import {
  View,
  Text,
  Image,
  ScrollView,
  TouchableOpacity, // Importado mas não usado
  StyleSheet,
  SafeAreaView,
  Button,
  ActivityIndicator,
  FlatList,
  RefreshControl
} from 'react-native';
import { useRouter, useFocusEffect } from 'expo-router';
// Ajuste o caminho se necessário
import { apiRequest, getToken, logout } from '../../services/api';
// Importe seus componentes de Hábito (AJUSTE O CAMINHO!)
import { HabitoConcluido, HabitoProgresso } from '../../components/habito'; // <-- VERIFIQUE ESTE CAMINHO
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

  // --- Função para buscar todos os dados ---
  const fetchData = useCallback(async (isRefreshing = false) => {
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

      if (currentUserId && (!usuario || isRefreshing)) {
          console.log(`Buscando perfil para userId: ${currentUserId}`);
          userProfileData = await apiRequest(`/users/${currentUserId}`);
          setUsuario(userProfileData);
      } else if (usuario) {
          currentUserId = usuario.id;
      }

      if (!currentUserId) { throw new Error("Não foi possível obter o ID do usuário.");}

    } catch (err) { // --- CORREÇÃO ERRO 'unknown' ---
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
      // --- FIM CORREÇÃO ---
    }

    // 2. Buscar Hábitos do Usuário
    try {
      console.log(`Buscando hábitos visíveis para userId: ${currentUserId}`);
      const habitsResponse = await apiRequest('/habits-visible');
      if (Array.isArray(habitsResponse)) {
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
  }, [usuario, router]); // Dependências

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

  // --- Renderização ---

  if (loading) {
    return <View style={styles.centered}><ActivityIndicator size="large" color="#007AFF" /><Text style={styles.loadingText}>Carregando perfil...</Text></View>;
  }

  // Erro Fatal (não conseguiu carregar usuário)
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
             <Text style={styles.statItem}>🔥 { Math.max(0, ...(habitos.ativos.map(h => h.streak || 0))) } Dias</Text>
             <Text style={styles.statItem}>💧 {usuario!.stats.points} pts</Text>
             <Text style={styles.statItem}>⭐ Nível {usuario!.stats.level}</Text>
          </View>
        </View>

        {/* Seção de erro não fatal (ex: falha ao carregar hábitos) */}
        {error && <Text style={styles.errorText}>{error}</Text>}

        {/* Hábitos Ativos */}
        <Text style={styles.sectionTitle}>Hábitos Ativos</Text>
        {refreshing ? <ActivityIndicator style={{marginTop: 10}}/> : habitos.ativos.length === 0 ? (
            <Text style={styles.infoText}>Nenhum hábito ativo.</Text>
        ) : (
            <FlatList
                data={habitos.ativos}
                keyExtractor={(item) => item.id.toString()}
                renderItem={({ item }) => (
                     // Passando 'progresso' como o componente espera
                     <HabitoProgresso
                        idd={item.id}
                        titulo={item.title}
                        progresso={item.lastCheckIn === new Date().toISOString().slice(0, 10) ? 1 : 0.5} // Placeholder
                     />
                )}
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
                     <HabitoConcluido
                        titulo={item.title}
                        tempoConcluido={item.bestStreak || 0}
                     />
                 )}
                 scrollEnabled={false}
             />
         )}

        {/* Botões de Ação */}
        <View style={styles.buttonContainer}>
          {/* --- CORREÇÃO Navegação --- */}
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
  // Estilos para HabitoProgresso/HabitoConcluido devem vir
  // dos seus arquivos importados (ex: ../../components/habito)
});