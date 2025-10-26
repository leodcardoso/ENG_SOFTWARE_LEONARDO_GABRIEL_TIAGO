// 1. IMPORTAR 'useRef' e 'useCallback' (além de 'useState' e 'useEffect')
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
// 2. IMPORTAR 'useFocusEffect' (além de 'useRouter')
import { useRouter, useFocusEffect } from 'expo-router';
// Importa o Picker de Hábitos
import { Picker } from '@react-native-picker/picker';
// DateTimePickerModal REMOVIDO
// Ajuste o caminho conforme sua estrutura
// Adicionado createChallenge à importação
import { apiRequest, getToken, createChallenge } from '../../services/api';
// import { jwtDecode } from "jwt-decode";

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

  // 3. CRIAR A REFERÊNCIA (ref)
  const scrollRef = useRef<ScrollView>(null); // Damos um "nome" ao ScrollView

  // --- Estados do Formulário ---
  const [titulo, setTitulo] = useState("");
  const [categoriaSelecionadaId, setCategoriaSelecionadaId] = useState<string | null>(null);
  const [checkInsNecessarios, setCheckInsNecessarios] = useState("");
  const [dataFim, setDataFim] = useState<string>(""); // Data como AAAA-MM-DD
  const [privacidade, setPrivacidade] = useState<ChallengePrivacy>('public');

  // --- Estados de Dados ---
  const [amigos, setAmigos] = useState<Amigo[]>([]);
  const [userIdLogado, setUserIdLogado] = useState<number | null>(null);

  // --- Estados de Controle ---
  const [loadingAmigos, setLoadingAmigos] = useState(true);
  const [submitLoading, setSubmitLoading] = useState(false);
  const [error, setError] = useState("");

  // --- Efeito para buscar dados iniciais (UserId e Amigos) ---
  useEffect(() => {
     const fetchData = async () => { setLoadingAmigos(true); setError(""); let currentUserId: number | null = null; try { const token = await getToken(); if (token) { console.warn("Usando userId=1 fixo!"); currentUserId = 1; setUserIdLogado(currentUserId); } else { setError("Não autenticado."); setLoadingAmigos(false); router.replace('/login'); return; } } catch (e) { setError("Erro sessão."); console.error("Erro token:", e); setLoadingAmigos(false); router.replace('/login'); return; } if (!currentUserId) { setLoadingAmigos(false); return; } try { const user = await apiRequest(`/users/${currentUserId}`); if (user?.friends?.length > 0) { const friendsData: any[] = await Promise.all(user.friends.map((id: number) => apiRequest(`/users/${id}`))); setAmigos(friendsData.filter(f=>f).map(f => ({ id: f.id, nome: f.name || `?`, imagem: f.profile?.avatar || "https://placehold.co/40x40/ccc/fff?text=??", selecionado: false }))); } else { setAmigos([]); } } catch (err) { console.error("Erro amigos:", err); setError("Falha carregar amigos."); setAmigos([]); } finally { setLoadingAmigos(false); } }; fetchData();
  }, [router]); // Adicionado router

  // --- 4. USAR O 'useFocusEffect' ---
  // Este hook é executado sempre que o usuário foca nesta tela
  useFocusEffect(
    useCallback(() => {
      console.log('Tela Criar Desafio em foco: Limpando erros e rolando para o topo.');
      setError(""); // Limpa a mensagem de erro ao entrar na tela

      // Rola o ScrollView para o topo (posição y: 0)
      // O '?' (optional chaining) garante que não quebre se scrollRef.current for nulo
      scrollRef.current?.scrollTo({ y: 0, animated: false }); // animated: false para ser instantâneo

    }, []) // Dependência vazia, executa apenas ao focar
  );

  // --- Funções de Manipulação ---
  const toggleAmigo = (idSel: number) => setAmigos(prev => prev.map(a => a.id === idSel ? { ...a, selecionado: !a.selecionado } : a ));
  const isValidDateString = (dateString: string): boolean => { /* ... (função de validação) ... */ const regex = /^\d{4}-\d{2}-\d{2}$/; if (!regex.test(dateString)) return false; const date = new Date(dateString + "T00:00:00"); const timestamp = date.getTime(); if (typeof timestamp !== 'number' || Number.isNaN(timestamp)) return false; return date.toISOString().startsWith(dateString); };

  // --- Função de Submissão ---
  const handleCriarDesafio = async () => { /* ... (Lógica idêntica à anterior) ... */ setError(""); setSubmitLoading(true); const tomorrow = new Date(); tomorrow.setDate(tomorrow.getDate() + 1); tomorrow.setHours(0, 0, 0, 0); if (!titulo || !categoriaSelecionadaId || !checkInsNecessarios || !dataFim) { setError("Preencha Título, Categoria, Nº Check-ins e Data Fim (AAAA-MM-DD)."); console.error("Validação:", "Campos obrigatórios"); setSubmitLoading(false); return; } if (!isValidDateString(dataFim)) { setError("Formato da Data Fim inválido (AAAA-MM-DD)."); console.error("Validação:", "Formato data"); setSubmitLoading(false); return; } const numCheckIns = parseInt(checkInsNecessarios, 10); if (isNaN(numCheckIns) || numCheckIns <= 0) { setError("Nº de check-ins inválido."); console.error("Validação:", "Nº check-ins"); setSubmitLoading(false); return; } const dataFimObj = new Date(dataFim + "T00:00:00"); if (dataFimObj < tomorrow) { setError("Data de término deve ser a partir de amanhã."); console.error("Validação:", "Data passada"); setSubmitLoading(false); return; } const selectedCategory = HABIT_CATEGORIES.find(cat => cat.id === categoriaSelecionadaId); const participantesIds = amigos.filter(a => a.selecionado).map(a => a.id); if (!userIdLogado) { setError("ID do criador não encontrado."); console.error("Erro:", "ID Criador nulo"); setSubmitLoading(false); return; } participantesIds.push(userIdLogado); const challengeData = { creatorId: userIdLogado, title: titulo, startDate: new Date().toISOString().slice(0, 10), endDate: dataFim, goal: { categoryTitle: selectedCategory?.title || 'Outro', checksRequired: numCheckIns }, participantIds: [...new Set(participantesIds)], privacy: privacidade }; console.log("Enviando:", challengeData); try { console.log("Chamando createChallenge..."); const result = await createChallenge(challengeData); if (result.success) { console.log("Sucesso! Desafio criado:", result.challenge); setTitulo(""); setCategoriaSelecionadaId(null); setCheckInsNecessarios(""); setDataFim(""); setPrivacidade('public'); setAmigos(prev => prev.map(a => ({ ...a, selecionado: false }))); router.back(); } else { console.error("Erro API createChallenge:", result.error); setError(result.error || "Erro API."); } } catch (apiError) { console.error("Erro chamada API:", apiError); let errorMessage = "Erro conexão."; if (apiError instanceof Error) { errorMessage = apiError.message; } else if (typeof apiError === 'string') { errorMessage = apiError; } setError(errorMessage); } finally { setSubmitLoading(false); } };

  // --- Renderização ---
  if (loadingAmigos) { return <View style={styles.centered}><ActivityIndicator size="large" color="#007AFF" /><Text style={styles.loadingText}>Carregando amigos...</Text></View>; }
  // (Renderização de Erro Fatal removida daqui, pois o useFocusEffect lida com o erro 'preso')

  return (
    // 5. ATRIBUIR A 'ref' AO SCROLLVIEW
    <ScrollView
      ref={scrollRef} // <-- AQUI ESTÁ A LIGAÇÃO
      style={styles.container}
      contentContainerStyle={styles.scrollContainer}
    >
      <Text style={styles.titulo}>Criar Novo Desafio</Text>
      {error && !submitLoading ? <Text style={styles.errorText}>{error}</Text> : null}

      <View style={styles.card}>
        <Text style={styles.label}>Título do Desafio *</Text>
        <TextInput style={styles.input} placeholder="Ex: Semana da Meditação Diária" value={titulo} onChangeText={setTitulo} maxLength={100}/>

        <Text style={styles.label}>Categoria do Hábito Alvo *</Text>
        <FlatList
            data={HABIT_CATEGORIES}
            renderItem={({ item }) => (
                <TouchableOpacity
                    style={[ styles.habitGridItem, item.id === categoriaSelecionadaId && styles.habitGridItemSelected ]}
                    onPress={() => setCategoriaSelecionadaId(item.id)}
                    disabled={submitLoading} >
                    <Ionicons
                       name={item.iconName}
                       size={24}
                       color={item.id === categoriaSelecionadaId ? '#fff' : '#007AFF'} />
                    <Text
                       style={[ styles.habitGridItemText, item.id === categoriaSelecionadaId && styles.habitGridItemTextSelected ]}
                       numberOfLines={1} ellipsizeMode='tail' >
                       {item.title}
                    </Text>
                </TouchableOpacity>
            )}
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
            <TouchableOpacity style={[styles.privacyButton, privacidade === 'private' && styles.privacyButtonSelected]} onPress={() => setPrivacidade('private')} disabled={submitLoading}><Ionicons name="lock-closed" size={16} color={privacidade === 'private' ? '#fff' : '#666'} /><Text style={[styles.privacyButtonText, privacidade === 'private' && styles.privacyButtonTextSelected]}> Privado</Text></TouchableOpacity>
        </View>
      </View>

      <Text style={styles.subtitulo}>Convidar Amigos (Opcional)</Text>
       {loadingAmigos ? (<ActivityIndicator style={{ marginVertical: 20 }}/>) : amigos.length === 0 ? (<Text style={styles.infoText}>Você não tem amigos para convidar.</Text>) : (<FlatList data={amigos} keyExtractor={(item) => item.id.toString()} renderItem={({ item }) => (<TouchableOpacity style={styles.amigoCard} onPress={() => !submitLoading && toggleAmigo(item.id)} activeOpacity={0.7}><View style={styles.amigoInfo}><Image source={{ uri: item.imagem }} style={styles.foto} /><Text style={styles.nomeAmigo}>{item.nome}</Text></View><Ionicons name={item.selecionado ? "checkbox" : "square-outline"} size={24} color={item.selecionado ? "#007AFF" : "#ccc"} /></TouchableOpacity>)} style={{ maxHeight: 250, marginBottom: 20 }} />)}

      <View style={{ marginBottom: 40 }}>
          <Button title={submitLoading ? "Criando..." : "Criar Desafio"} onPress={handleCriarDesafio} disabled={submitLoading || loadingAmigos} />
      </View>
    </ScrollView>
  );
}

// --- Estilos ---
const styles = StyleSheet.create({
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