import React, { useState, useEffect, useRef, useCallback } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  FlatList,
  Image,
  StyleSheet,
  Button,
  ActivityIndicator,
  ScrollView,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useRouter, useFocusEffect } from 'expo-router';
import { Picker } from '@react-native-picker/picker';
// Ajuste o caminho conforme sua estrutura
import { apiRequest, getToken, createChallenge } from '../../services/api'; // Ajustado para ../
// Opcional - se for decodificar o token
import { jwtDecode } from "jwt-decode"; 

// --- Interfaces ---
interface Amigo { id: number; nome: string; imagem: string; selecionado: boolean; }
interface HabitoCategoria { id: string; title: string; iconName: keyof typeof Ionicons.glyphMap; }
interface JwtPayload { userId: number; email: string; role: string; }
type ChallengePrivacy = 'public' | 'participants_only' | 'private';

// --- Lista Fixa de Categorias de Hábito ---
const HABIT_CATEGORIES: HabitoCategoria[] = [
    { id: 'cat-leitura', title: 'Leitura', iconName: 'book-outline' },
    { id: 'cat-exercicio', title: 'Exercício', iconName: 'barbell-outline' },
    { id: 'cat-alimentacao', title: 'Alimentação', iconName: 'restaurant-outline' },
    { id: 'cat-hidratacao', title: 'Hidratação', iconName: 'water-outline' },
    { id: 'cat-meditacao', title: 'Meditação', iconName: 'prism-outline' },
    { id: 'cat-sono', title: 'Sono', iconName: 'moon-outline' },
    { id: 'cat-saude', title: 'Saúde', iconName: 'heart-outline' },
    { id: 'cat-musica', title: 'Música', iconName: 'musical-notes-outline' },
    { id: 'cat-criatividade', title: 'Criatividade', iconName: 'camera-outline' },
    { id: 'cat-entretenimento', title: 'Entretenimento', iconName: 'game-controller-outline' },
    { id: 'cat-trabalho', title: 'Trabalho', iconName: 'briefcase-outline' },
    { id: 'cat-outro', title: 'Outro', iconName: 'flag-outline' },
];


// --- Componente Principal ---
export default function CriarDesafioScreen() {
  const router = useRouter();
  const scrollRef = useRef<ScrollView>(null);

  // --- Estados do Formulário ---
  const [titulo, setTitulo] = useState("");
  const [categoriaSelecionadaId, setCategoriaSelecionadaId] = useState<string | null>(null);
  const [checkInsNecessarios, setCheckInsNecessarios] = useState("");
  const [dataFim, setDataFim] = useState<string>("");
  const [privacidade, setPrivacidade] = useState<ChallengePrivacy>('public');

  // --- Estados de Dados ---
  const [amigos, setAmigos] = useState<Amigo[]>([]);
  const [userIdLogado, setUserIdLogado] = useState<number | null>(null);

  // --- Estados de Controle ---
  const [loadingAmigos, setLoadingAmigos] = useState(true); // Agora controla o loading inicial
  const [submitLoading, setSubmitLoading] = useState(false);
  const [error, setError] = useState("");

  // --- Função de busca de dados ---
  // (Separada para ser chamada pelo useFocusEffect)
  const fetchData = async () => {
    setLoadingAmigos(true); // Começa a carregar
    setError("");
    let currentUserId: number | null = null;
    
    try {
        const token = await getToken();
        if (token) {
            // Decodifica o token para pegar o ID do usuário logado
             try {
                const decoded = jwtDecode<JwtPayload>(token);
                currentUserId = decoded.userId;
                setUserIdLogado(currentUserId);
             } catch (decodeError) {
                console.error("Erro decode:", decodeError);
                setError("Sessão inválida. Faça login novamente.");
                setLoadingAmigos(false);
                router.replace('/login');
                return;
             }
        } else {
            setError("Não autenticado. Redirecionando para login.");
            setLoadingAmigos(false);
            router.replace('/login');
            return;
        }

        if (!currentUserId) {
             setError("Não foi possível identificar o usuário.");
             setLoadingAmigos(false);
             return;
        }

        // Buscar Amigos
        try {
            const user = await apiRequest(`/users/${currentUserId}`);
            if (user?.friends?.length > 0) {
                const friendsData: any[] = await Promise.all(user.friends.map((id: number) => apiRequest(`/users/${id}`)));
                setAmigos(friendsData.filter(f => f).map(f => ({ id: f.id, nome: f.name || `?`, imagem: f.profile?.avatar || "https://placehold.co/40x40/ccc/fff?text=??", selecionado: false })));
            } else {
                setAmigos([]); // Usuário não tem amigos
            }
        } catch (err) {
            console.error("Erro amigos:", err);
            setError("Falha ao carregar amigos.");
            setAmigos([]);
        } finally {
            setLoadingAmigos(false); // Termina de carregar
        }
    } catch (e) {
        setError("Erro ao verificar sessão.");
        console.error("Erro token:", e);
        setLoadingAmigos(false);
        router.replace('/login');
    }
  };

  // --- Efeito para buscar dados iniciais (UserId e Amigos) ---
  // Este useEffect roda 1x na montagem inicial (onde pode falhar se não estiver logado)
  useEffect(() => {
    fetchData();
  }, []); // Dependência vazia, roda 1x

  // --- useFocusEffect para limpar erro, rolar E RECARREGAR OS DADOS ---
  useFocusEffect(
    useCallback(() => {
      console.log('Tela Criar Desafio em foco: Limpando erros, rolando para o topo e buscando dados.');
      setError(""); // Limpa a mensagem de erro ao entrar na tela
      scrollRef.current?.scrollTo({ y: 0, animated: false });
      
      // CHAMA A BUSCA DE DADOS NOVAMENTE
      // Isso garante que, se o usuário fez login agora, os dados serão carregados
      fetchData(); 

    }, []) // Dependência vazia (cuidado com re-execuções, mas fetchData deve ser estável)
          // Se fetchData causar loops, adicione 'router' como dependência: }, [router])
  );

  // --- Efeito para limpar seleção de amigos se privacidade mudar para 'private' ---
  useEffect(() => {
      if (privacidade === 'private') {
          if (amigos.some(a => a.selecionado)) {
              console.log("Privacidade 'private' selecionada, desmarcando amigos...");
              setAmigos(prevAmigos => prevAmigos.map(amigo => amigo.selecionado ? { ...amigo, selecionado: false } : amigo));
          }
      }
  }, [privacidade, amigos]); // Dependências corretas


  // --- Funções de Manipulação ---
  const toggleAmigo = (idSel: number) => setAmigos(prev => prev.map(a => a.id === idSel ? { ...a, selecionado: !a.selecionado } : a ));
  const isValidDateString = (dateString: string): boolean => { const regex = /^\d{4}-\d{2}-\d{2}$/; if (!regex.test(dateString)) return false; const date = new Date(dateString + "T00:00:00"); const timestamp = date.getTime(); if (typeof timestamp !== 'number' || Number.isNaN(timestamp)) return false; return date.toISOString().startsWith(dateString); };

  // --- Função de Submissão ---
 // Em app/(tabs)/criaDesafio.tsx

  // --- Função de Submissão (ATUALIZADA) ---
  const handleCriarDesafio = async () => {
     setError(""); setSubmitLoading(true);

     // --- Validações ---
     // ... (Validações idênticas às anteriores) ...
     const tomorrow = new Date(); tomorrow.setDate(tomorrow.getDate() + 1); tomorrow.setHours(0, 0, 0, 0); if (!titulo || !categoriaSelecionadaId || !checkInsNecessarios || !dataFim) { setError("Preencha Título, Categoria, Nº Check-ins e Data Fim (AAAA-MM-DD)."); console.error("Validação:", "Campos obrigatórios"); setSubmitLoading(false); return; } if (!isValidDateString(dataFim)) { setError("Formato da Data Fim inválido (AAAA-MM-DD)."); console.error("Validação:", "Formato data"); setSubmitLoading(false); return; } const numCheckIns = parseInt(checkInsNecessarios, 10); if (isNaN(numCheckIns) || numCheckIns <= 0) { setError("Nº de check-ins inválido."); console.error("Validação:", "Nº check-ins"); setSubmitLoading(false); return; } const dataFimObj = new Date(dataFim + "T00:00:00"); if (dataFimObj < tomorrow) { setError("Data de término deve ser a partir de amanhã."); console.error("Validação:", "Data passada"); setSubmitLoading(false); return; }

     // --- Preparar Dados (ATUALIZADO) ---
     
     // 1. Pega APENAS os IDs dos amigos selecionados
     const invitedFriendIds = amigos.filter(a => a.selecionado).map(a => a.id);
     
     // 2. Não precisamos mais verificar o userIdLogado aqui, o backend fará isso pelo token

     const selectedCategory = HABIT_CATEGORIES.find(cat => cat.id === categoriaSelecionadaId);

     // Objeto de dados MODIFICADO
     const challengeData = {
       // creatorId NÃO é mais enviado
       title: titulo,
       startDate: new Date().toISOString().slice(0, 10),
       endDate: dataFim,
       goal: {
            categoryTitle: selectedCategory?.title || 'Outro',
            checksRequired: numCheckIns
       },
       invitedFriendIds: invitedFriendIds, // <-- MUDANÇA: Envia IDs dos amigos aqui
       // participantIds foi removido
       privacy: privacidade
     };

     console.log("Enviando dados do desafio (com convites):", challengeData);

     // --- Chamar API REAL ---
     try {
       console.log("Chamando createChallenge...");
       const result = await createChallenge(challengeData); // Envia o novo objeto

       if (result.success) {
         console.log("Sucesso! Desafio criado:", result.challenge);
         // Limpeza dos Campos Após Sucesso
         setTitulo(""); setCategoriaSelecionadaId(null); setCheckInsNecessarios("");
         setDataFim(""); setPrivacidade('public');
         setAmigos(prev => prev.map(a => ({ ...a, selecionado: false })));
         router.back();
       } else {
         console.error("Erro API createChallenge:", result.error);
         setError(result.error || "Erro API.");
       }
     } catch (apiError) {
       console.error("Erro chamada API:", apiError);
       let errorMessage = "Erro conexão."; if (apiError instanceof Error) { errorMessage = apiError.message; } else if (typeof apiError === 'string') { errorMessage = apiError; }
       setError(errorMessage);
     } finally {
       setSubmitLoading(false);
     }
  }; // Fim de handleCriarDesafio

  // --- Renderização ---
  // (Renderização de Loading e Erro mantida)
  if (loadingAmigos && !error) { // Mostra loading SÓ se estiver carregando amigos e não houver erro
      return <View style={styles.centered}><ActivityIndicator size="large" color="#007AFF" /><Text style={styles.loadingText}>Carregando dados...</Text></View>;
  }

  return (
    <ScrollView
      ref={scrollRef}
      style={styles.container}
      contentContainerStyle={styles.scrollContainer}
    >
      <Text style={styles.titulo}>Criar Novo Desafio</Text>
      {/* Mostra erro de validação/submissão OU de carregamento inicial */}
      {error && !submitLoading ? <Text style={styles.errorText}>{error}</Text> : null}

      <View style={styles.card}>
        <Text style={styles.label}>Título do Desafio *</Text>
        <TextInput style={styles.input} placeholder="Ex: Semana da Meditação Diária" value={titulo} onChangeText={setTitulo} maxLength={100}/>

        <Text style={styles.label}>Categoria do Hábito Alvo *</Text>
        <FlatList
            data={HABIT_CATEGORIES}
            renderItem={({ item }) => ( <TouchableOpacity style={[ styles.habitGridItem, item.id === categoriaSelecionadaId && styles.habitGridItemSelected ]} onPress={() => setCategoriaSelecionadaId(item.id)} disabled={submitLoading} ><Ionicons name={item.iconName} size={24} color={item.id === categoriaSelecionadaId ? '#fff' : '#007AFF'} /><Text style={[ styles.habitGridItemText, item.id === categoriaSelecionadaId && styles.habitGridItemTextSelected ]} numberOfLines={1} ellipsizeMode='tail' >{item.title}</Text></TouchableOpacity> )}
            keyExtractor={(item) => item.id}
            numColumns={4}
            columnWrapperStyle={styles.habitGridRow}
            contentContainerStyle={{ paddingVertical: 10 }}
            scrollEnabled={false}
        />

        <Text style={styles.label}>Nº de Check-ins Necessários *</Text>
        <TextInput style={styles.input} placeholder="Ex: 7" value={checkInsNecessarios} onChangeText={setCheckInsNecessarios} keyboardType="number-pad"/>

        <Text style={styles.label}>Data de Término * (AAAA-MM-DD)</Text>
        <TextInput style={styles.input} placeholder="AAAA-MM-DD" value={dataFim} onChangeText={setDataFim} maxLength={10} keyboardType="numeric" />

        <Text style={styles.label}>Visibilidade do Desafio</Text>
        <View style={styles.privacySelector}>
            <TouchableOpacity style={[styles.privacyButton, privacidade === 'public' && styles.privacyButtonSelected]} onPress={() => setPrivacidade('public')} disabled={submitLoading}><Ionicons name="earth" size={16} color={privacidade === 'public' ? '#fff' : '#666'} /><Text style={[styles.privacyButtonText, privacidade === 'public' && styles.privacyButtonTextSelected]}> Público</Text></TouchableOpacity>
            <TouchableOpacity style={[styles.privacyButton, privacidade === 'participants_only' && styles.privacyButtonSelected]} onPress={() => setPrivacidade('participants_only')} disabled={submitLoading}><Ionicons name="people" size={16} color={privacidade === 'participants_only' ? '#fff' : '#666'} /><Text style={[styles.privacyButtonText, privacidade === 'participants_only' && styles.privacyButtonTextSelected]}> Participantes</Text></TouchableOpacity>
            <TouchableOpacity
              style={[styles.privacyButton, privacidade === 'private' && styles.privacyButtonSelected]}
              onPress={() => {
                setPrivacidade('private');
                if (amigos.some(a => a.selecionado)) {
                  setAmigos(prev => prev.map(a => a.selecionado ? { ...a, selecionado: false } : a));
                }
              }}
              disabled={submitLoading}
            >
               <Ionicons name="lock-closed" size={16} color={privacidade === 'private' ? '#fff' : '#666'} />
               <Text style={[styles.privacyButtonText, privacidade === 'private' && styles.privacyButtonTextSelected]}> Privado</Text>
            </TouchableOpacity>
        </View>
      </View>

      {/* Seção Condicional Convidar Amigos */}
      {privacidade !== 'private' && (
        <>
          <Text style={styles.subtitulo}>Convidar Amigos (Opcional)</Text>
           {/* Seção de amigos só aparece se não estiver carregando E não for privado */}
           {loadingAmigos ? (
               <ActivityIndicator style={{ marginVertical: 20 }}/>
           ) : amigos.length === 0 ? (
               <Text style={styles.infoText}>Você não tem amigos para convidar.</Text>
           ) : (
               <FlatList
                   data={amigos}
                   keyExtractor={(item) => item.id.toString()}
                   renderItem={({ item }) => ( <TouchableOpacity style={styles.amigoCard} onPress={() => !submitLoading && toggleAmigo(item.id)} activeOpacity={0.7}><View style={styles.amigoInfo}><Image source={{ uri: item.imagem }} style={styles.foto} /><Text style={styles.nomeAmigo}>{item.nome}</Text></View><Ionicons name={item.selecionado ? "checkbox" : "square-outline"} size={24} color={item.selecionado ? "#007AFF" : "#ccc"} /></TouchableOpacity> )}
                   style={{ maxHeight: 250, marginBottom: 20 }}
               />
           )}
         </>
      )}

      <View style={{ marginBottom: 40 }}>
          <Button title={submitLoading ? "Criando..." : "Criar Desafio"} onPress={handleCriarDesafio} disabled={submitLoading || loadingAmigos} />
      </View>
    </ScrollView>
  );
}

// --- Estilos ---
const styles = StyleSheet.create({
  // ... (Estilos idênticos) ...
  scrollContainer: { flexGrow: 1, paddingBottom: 20 },
  container: { flex: 1, backgroundColor: "#fff", paddingHorizontal: 20, paddingTop: 20 },
  centered: { flex: 1, justifyContent: "center", alignItems: "center", padding: 20, backgroundColor: '#fff' },
  titulo: { fontSize: 22, fontWeight: "700", marginBottom: 20, textAlign: 'center', color: '#333' },
  card: { backgroundColor: "#fdfdfd", borderRadius: 12, padding: 20, marginBottom: 24, borderWidth: 1, borderColor: "#eaeaea", shadowColor: "#000", shadowOffset: { width: 0, height: 1 }, shadowOpacity: 0.05, shadowRadius: 2, elevation: 2 },
  label: { fontWeight: "600", fontSize: 14, marginTop: 15, marginBottom: 6, color: '#555' },
  input: { backgroundColor: "#fff", borderRadius: 8, borderWidth: 1, borderColor: "#ccc", paddingHorizontal: 12, paddingVertical: 12, fontSize: 16, color: '#333' },
  textArea: { height: 80, textAlignVertical: "top" },
  subtitulo: { fontWeight: "600", fontSize: 18, marginBottom: 15, marginTop: 10, color: '#444' },
  amigoCard: { flexDirection: "row", justifyContent: "space-between", alignItems: "center", backgroundColor: "#fff", borderRadius: 10, paddingVertical: 12, paddingHorizontal: 15, marginBottom: 10, borderWidth: 1, borderColor: "#eee" },
  amigoInfo: { flexDirection: "row", alignItems: "center", flexShrink: 1 },
  foto: { width: 40, height: 40, borderRadius: 20, marginRight: 12, backgroundColor: '#eee' },
  nomeAmigo: { fontSize: 16, fontWeight: "500", color: '#333', marginRight: 10 },
  errorText: { color: 'red', marginTop: 15, textAlign: 'center', fontSize: 14 },
  infoText: { textAlign: 'center', color: '#666', marginVertical: 20, fontSize: 15, paddingHorizontal: 10 },
  infoTextSmall: { textAlign: 'center', color: '#888', marginVertical: 10, fontSize: 13 },
  privacySelector: { flexDirection: 'row', marginTop: 15, marginBottom: 5, },
  privacyButton: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', paddingVertical: 8, paddingHorizontal: 10, borderRadius: 18, borderWidth: 1.5, borderColor: '#ccc', backgroundColor: '#fff', marginHorizontal: 4, flexGrow: 1, flexBasis: 0 },
  privacyButtonSelected: { backgroundColor: '#007AFF', borderColor: '#007AFF' },
  privacyButtonText: { fontSize: 12.5, fontWeight: '600', color: '#555', marginLeft: 4, textAlign: 'center' },
  privacyButtonTextSelected: { color: '#fff' },
  habitGridRow: { justifyContent: 'space-between', marginBottom: 8 },
  habitGridItem: { width: '23%', aspectRatio: 1, backgroundColor: '#f8f8f8', borderWidth: 1, borderColor: '#eee', borderRadius: 8, padding: 4, alignItems: 'center', justifyContent: 'center' },
  habitGridItemSelected: { backgroundColor: '#007AFF', borderColor: '#0056b3', shadowColor: "#000", shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.15, shadowRadius: 3, elevation: 4 },
  habitGridItemText: { marginTop: 4, fontSize: 10, fontWeight: '500', color: '#666', textAlign: 'center' },
  habitGridItemTextSelected: { color: '#fff' },
  loadingText: { marginTop: 10, color: '#666', fontSize: 16 },
});