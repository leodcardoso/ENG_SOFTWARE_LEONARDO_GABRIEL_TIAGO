import React, { useState, useEffect } from "react";
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
  Platform
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import DateTimePicker, { DateTimePickerEvent } from '@react-native-community/datetimepicker';
import { useRouter } from 'expo-router';
// Ajuste o caminho conforme sua estrutura
import { apiRequest, getToken } from '../../services/api';
// import { jwtDecode } from "jwt-decode";
import { /* ..., */ Alert /*, ... */ } from "react-native";

// --- Interfaces ---
interface Amigo { id: number; nome: string; imagem: string; selecionado: boolean; }
interface HabitoUsuario { id: number; title: string; }
interface JwtPayload { userId: number; email: string; role: string; }

// --- Tipos de Privacidade --- (Adicionado 'private')
type ChallengePrivacy = 'public' | 'participants_only' | 'private';

// --- Componente Principal ---
export default function CriarDesafioScreen() {
  const router = useRouter();

  // --- Estados do Formulário ---
  const [titulo, setTitulo] = useState("");
  const [habitoSelecionadoId, setHabitoSelecionadoId] = useState<number | null>(null);
  const [checkInsNecessarios, setCheckInsNecessarios] = useState("");
  const [dataFim, setDataFim] = useState<Date | null>(null);
  const [showPicker, setShowPicker] = useState(false);
  // Estado de privacidade atualizado, padrão 'public'
  const [privacidade, setPrivacidade] = useState<ChallengePrivacy>('public');

  // --- Estados de Dados ---
  const [amigos, setAmigos] = useState<Amigo[]>([]);
  const [habitosUsuario, setHabitosUsuario] = useState<HabitoUsuario[]>([]);
  const [userIdLogado, setUserIdLogado] = useState<number | null>(null);

  // --- Estados de Controle ---
  const [loadingAmigos, setLoadingAmigos] = useState(true);
  const [loadingHabitos, setLoadingHabitos] = useState(true);
  const [submitLoading, setSubmitLoading] = useState(false);
  const [error, setError] = useState("");

  // --- Efeito para buscar dados iniciais ---
  useEffect(() => {
    const fetchData = async () => {
       setLoadingAmigos(true); setLoadingHabitos(true); setError("");
       let currentUserId: number | null = null;
       try { // Obter User ID
         const token = await getToken();
         if (token) {
           // **** USANDO ID FIXO PARA TESTE - SUBSTITUA PELA LÓGICA REAL! ****
           console.warn("Usando userId=1 fixo para teste em criaDesafio.tsx!");
           currentUserId = 1; setUserIdLogado(currentUserId);
           // **** FIM DO BLOCO DE TESTE ****
         } else { setError("Usuário não autenticado."); setLoadingAmigos(false); setLoadingHabitos(false); router.replace('/login'); return; }
       } catch (e) { setError("Erro ao verificar sessão."); console.error("Erro ao ler token:", e); setLoadingAmigos(false); setLoadingHabitos(false); router.replace('/login'); return; }
       if (!currentUserId) { setLoadingAmigos(false); setLoadingHabitos(false); return; }

       // Buscar Amigos (Esta parte JÁ usa o DB)
       try {
         const user = await apiRequest(`/users/${currentUserId}`); // Busca usuário logado
         if (user?.friends?.length > 0) { // Verifica se tem amigos
           const friendsData: any[] = await Promise.all(user.friends.map((id: number) => apiRequest(`/users/${id}`))); // Busca dados dos amigos
           const amigosFormatados = friendsData.filter(f=>f).map(f => ({ id: f.id, nome: f.name || `?`, imagem: f.profile?.avatar || "https://placehold.co/40x40/ccc/fff?text=??", selecionado: false }));
           setAmigos(amigosFormatados);
         } else { setAmigos([]); }
       } catch (err) { console.error("Erro buscar amigos:", err); setError("Falha ao carregar amigos."); setAmigos([]); }
       finally { setLoadingAmigos(false); }

       // Buscar Hábitos (Esta parte JÁ usa o DB)
       try {
         const todosHabitos = await apiRequest('/habits');
         if (Array.isArray(todosHabitos)) {
           const meusHabitos = todosHabitos.filter((h: any) => h && h.userId === currentUserId); // Filtra hábitos do usuário
           setHabitosUsuario(meusHabitos.map((h: any) => ({ id: h.id, title: h.title })));
         } else { setHabitosUsuario([]); }
       } catch (err) { console.error("Erro buscar hábitos:", err); setError("Falha ao carregar hábitos."); setHabitosUsuario([]); }
       finally { setLoadingHabitos(false); }
    };
    fetchData();
  }, []);

  // --- Funções de Manipulação ---
  const toggleAmigo = (idSelecionado: number) => { /* ... (sem alterações) ... */
      setAmigos(prevAmigos => prevAmigos.map(amigo => amigo.id === idSelecionado ? { ...amigo, selecionado: !amigo.selecionado } : amigo ));
  };

  const onChangeDate = (event: DateTimePickerEvent, selectedDate?: Date) => { /* ... (sem alterações) ... */
    const currentDate = selectedDate;
    setShowPicker(Platform.OS === 'ios');
    if (event.type === 'set' && currentDate) {
        const tomorrow = new Date(); tomorrow.setDate(tomorrow.getDate() + 1); tomorrow.setHours(0, 0, 0, 0);
        if (currentDate < tomorrow) { /* Alert("Data Inválida", "A data de término deve ser a partir de amanhã."); */ console.log("Data inválida selecionada"); }
        else { setDataFim(currentDate); console.log("Data Fim:", currentDate.toISOString().slice(0, 10)); }
    } else { console.log("Seleção de data cancelada."); }
  };

  // --- Função de Submissão ---
  const handleCriarDesafio = async () => {
     setError(""); setSubmitLoading(true);

     // Validações (sem alterações)
     const tomorrow = new Date(); tomorrow.setDate(tomorrow.getDate() + 1); tomorrow.setHours(0, 0, 0, 0);
     if (!titulo || !habitoSelecionadoId || !checkInsNecessarios || !dataFim) { setError("Preencha Título, Hábito, Nº Check-ins e Data Fim."); console.error("Erro Validação:", "Campos obrigatórios faltando"); setSubmitLoading(false); return; }
     const numCheckIns = parseInt(checkInsNecessarios, 10);
     if (isNaN(numCheckIns) || numCheckIns <= 0) { setError("Nº de check-ins inválido."); console.error("Erro Validação:", "Nº check-ins inválido"); setSubmitLoading(false); return; }
     if (!dataFim || dataFim < tomorrow) { setError("Data de término deve ser a partir de amanhã."); console.error("Erro Validação:", "Data término inválida"); setSubmitLoading(false); return; }

     // Preparar Dados (inclui privacidade)
     const participantesIds = amigos.filter(a => a.selecionado).map(a => a.id);
     // Se for privado, apenas o criador participa inicialmente? (Regra a definir)
     // if (privacidade === 'private') {
     //    participantesIds = []; // Limpa convidados se for privado?
     // }
     if (userIdLogado) { participantesIds.push(userIdLogado); }
     else { setError("ID do criador não encontrado."); console.error("Erro:", "ID Criador nulo"); setSubmitLoading(false); return; }

     const challengeData = {
       creatorId: userIdLogado, title: titulo,
       startDate: new Date().toISOString().slice(0, 10), endDate: dataFim.toISOString().slice(0, 10),
       goal: { habitId: habitoSelecionadoId, checksRequired: numCheckIns },
       participantIds: [...new Set(participantesIds)], // Garante IDs únicos
       privacy: privacidade // <-- Passa a privacidade selecionada
     };

     console.log("Enviando dados do desafio:", challengeData);

     // Chamar API (Mock)
     try {
       console.log("MOCK: Chamando API com:", challengeData);
       await new Promise(resolve => setTimeout(resolve, 1500));
       const mockResult = { id: Date.now() % 1000, ...challengeData };
       console.log("MOCK: Resposta da API:", mockResult);
       console.log("Sucesso! Desafio criado (mock).");
       router.back();
     } catch (apiError) {
       console.error("Erro ao criar desafio:", apiError);
       const errorMsg = "Não foi possível criar o desafio. Verifique o console.";
       setError(errorMsg);
     } finally {
       setSubmitLoading(false);
     }
  };

  // --- Renderização ---
  if (loadingAmigos || loadingHabitos) { /* ... Loading ... */ }
  if (error && !loadingAmigos && !loadingHabitos && !submitLoading) { /* ... Error ... */ }

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.scrollContainer}>
      <Text style={styles.titulo}>Criar Novo Desafio</Text>
      {error && !submitLoading ? <Text style={styles.errorText}>{error}</Text> : null}

      <View style={styles.card}>
        {/* ... (Título, Hábito, Check-ins, Data Fim - sem alterações) ... */}
        <Text style={styles.label}>Título do Desafio *</Text>
        <TextInput style={styles.input} placeholder="Ex: Semana da Meditação" value={titulo} onChangeText={setTitulo} maxLength={100}/>

        <Text style={styles.label}>Hábito Alvo *</Text>
        <TouchableOpacity style={styles.pickerPlaceholder} onPress={() => Alert.alert("Seleção de Hábito", habitosUsuario.length > 0 ? "Implementar Picker listando:\n" + habitosUsuario.map(h => `- ${h.title} (ID: ${h.id})`).join('\n') : "Nenhum hábito encontrado.")}>
             <Text style={styles.pickerText}>{habitoSelecionadoId ? habitosUsuario.find(h => h.id === habitoSelecionadoId)?.title || 'Selecione...' : 'Selecione um hábito...'}</Text>
             <Ionicons name="chevron-down" size={20} color="#888" />
        </TouchableOpacity>

        <Text style={styles.label}>Nº de Check-ins Necessários *</Text>
        <TextInput style={styles.input} placeholder="Ex: 7" value={checkInsNecessarios} onChangeText={setCheckInsNecessarios} keyboardType="number-pad"/>

        <Text style={styles.label}>Data de Término *</Text>
        <TouchableOpacity style={styles.dateInput} onPress={() => setShowPicker(true)}>
          <Text style={dataFim ? styles.dateText : styles.dateTextPlaceholder}>
            {dataFim ? dataFim.toLocaleDateString('pt-BR') : "Selecione a data"}
          </Text>
          <Ionicons name="calendar-outline" size={20} color="#888" />
        </TouchableOpacity>
        {showPicker && (<DateTimePicker testID="dateTimePicker" value={dataFim || new Date(Date.now() + 86400000)} mode="date" display="calendar" minimumDate={new Date(Date.now() + 86400000)} onChange={onChangeDate}/>)}

        {/* --- Seletor de Privacidade ATUALIZADO --- */}
        <Text style={styles.label}>Visibilidade do Desafio</Text>
        <View style={styles.privacySelector}>
          {/* Botão Público */}
          <TouchableOpacity
            style={[styles.privacyButton, privacidade === 'public' && styles.privacyButtonSelected]}
            onPress={() => setPrivacidade('public')}
            disabled={submitLoading}
          >
            <Ionicons name="earth" size={18} color={privacidade === 'public' ? '#fff' : '#666'} />
            <Text style={[styles.privacyButtonText, privacidade === 'public' && styles.privacyButtonTextSelected]}> Público</Text>
          </TouchableOpacity>

          {/* Botão Participantes */}
          <TouchableOpacity
            style={[styles.privacyButton, privacidade === 'participants_only' && styles.privacyButtonSelected]}
            onPress={() => setPrivacidade('participants_only')}
            disabled={submitLoading}
          >
             <Ionicons name="people" size={18} color={privacidade === 'participants_only' ? '#fff' : '#666'} /> {/* Ícone diferente */}
            <Text style={[styles.privacyButtonText, privacidade === 'participants_only' && styles.privacyButtonTextSelected]}> Participantes</Text>
          </TouchableOpacity>

          {/* Botão Privado */}
          <TouchableOpacity
            style={[styles.privacyButton, privacidade === 'private' && styles.privacyButtonSelected]}
            onPress={() => setPrivacidade('private')}
            disabled={submitLoading}
          >
             <Ionicons name="lock-closed" size={18} color={privacidade === 'private' ? '#fff' : '#666'} />
            <Text style={[styles.privacyButtonText, privacidade === 'private' && styles.privacyButtonTextSelected]}> Privado</Text>
          </TouchableOpacity>
        </View>
        {/* --- Fim Seletor Privacidade --- */}

      </View>

      <Text style={styles.subtitulo}>Convidar Amigos (Opcional)</Text>
      {/* ... (FlatList de Amigos - sem alterações) ... */}
       {loadingAmigos ? (<ActivityIndicator style={{ marginVertical: 20 }}/>) : amigos.length === 0 ? (<Text style={styles.infoText}>Você não tem amigos para convidar.</Text>) : (<FlatList data={amigos} keyExtractor={(item) => item.id.toString()} renderItem={({ item }) => (<TouchableOpacity style={styles.amigoCard} onPress={() => !submitLoading && toggleAmigo(item.id)} activeOpacity={0.7}><View style={styles.amigoInfo}><Image source={{ uri: item.imagem }} style={styles.foto} /><Text style={styles.nomeAmigo}>{item.nome}</Text></View><Ionicons name={item.selecionado ? "checkbox" : "square-outline"} size={24} color={item.selecionado ? "#007AFF" : "#ccc"} /></TouchableOpacity>)} style={{ maxHeight: 250, marginBottom: 20 }} />)}

      <View style={{ marginBottom: 40 }}>
          <Button title={submitLoading ? "Criando..." : "Criar Desafio"} onPress={handleCriarDesafio} disabled={submitLoading || loadingAmigos || loadingHabitos}/>
      </View>
    </ScrollView>
  );
}

// --- Estilos --- (Adicionado estilo para acomodar 3 botões)
const styles = StyleSheet.create({
  // ... (Estilos anteriores) ...
  scrollContainer: { flexGrow: 1, paddingBottom: 20, },
  container: { flex: 1, backgroundColor: "#fff", paddingHorizontal: 20, paddingTop: 20, },
  centered: { flex: 1, justifyContent: "center", alignItems: "center", padding: 20, backgroundColor: '#fff', },
  titulo: { fontSize: 22, fontWeight: "700", marginBottom: 20, textAlign: 'center', color: '#333', },
  card: { backgroundColor: "#fdfdfd", borderRadius: 12, padding: 20, marginBottom: 24, borderWidth: 1, borderColor: "#eaeaea", shadowColor: "#000", shadowOffset: { width: 0, height: 1 }, shadowOpacity: 0.05, shadowRadius: 2, elevation: 2, },
  label: { fontWeight: "600", fontSize: 14, marginTop: 15, marginBottom: 6, color: '#555', },
  input: { backgroundColor: "#fff", borderRadius: 8, borderWidth: 1, borderColor: "#ccc", paddingHorizontal: 12, paddingVertical: 12, fontSize: 16, color: '#333', },
  textArea: { height: 80, textAlignVertical: "top", },
  dateInput: { flexDirection: "row", justifyContent: "space-between", alignItems: "center", borderWidth: 1, borderColor: "#ccc", backgroundColor: "#fff", borderRadius: 8, paddingHorizontal: 12, paddingVertical: 14, },
  dateText: { color: "#333", fontSize: 16, },
  dateTextPlaceholder: { color: "#999", fontSize: 16, },
  pickerPlaceholder: { flexDirection: "row", justifyContent: "space-between", alignItems: "center", borderWidth: 1, borderColor: "#ccc", backgroundColor: "#fff", borderRadius: 8, paddingHorizontal: 12, paddingVertical: 14, },
  pickerText: { color: "#333", fontSize: 16, },
  subtitulo: { fontWeight: "600", fontSize: 18, marginBottom: 15, marginTop: 10, color: '#444', },
  amigoCard: { flexDirection: "row", justifyContent: "space-between", alignItems: "center", backgroundColor: "#fff", borderRadius: 10, paddingVertical: 12, paddingHorizontal: 15, marginBottom: 10, borderWidth: 1, borderColor: "#eee", },
  amigoInfo: { flexDirection: "row", alignItems: "center", flexShrink: 1, },
  foto: { width: 40, height: 40, borderRadius: 20, marginRight: 12, backgroundColor: '#eee', },
  nomeAmigo: { fontSize: 16, fontWeight: "500", color: '#333', marginRight: 10, },
  errorText: { color: 'red', marginTop: 15, textAlign: 'center', fontSize: 14, },
  infoText: { textAlign: 'center', color: '#666', marginVertical: 20, fontSize: 15, paddingHorizontal: 10, },
  // Estilo atualizado para 3 botões
  privacySelector: {
    flexDirection: 'row',
    marginTop: 15,
    marginBottom: 5,
    justifyContent: 'space-between', // Espaço entre os 3
  },
  privacyButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 8, // Ligeiramente menor na vertical
    paddingHorizontal: 12, // Ligeiramente menor na horizontal
    borderRadius: 18, // Um pouco menos redondo
    borderWidth: 1.5,
    borderColor: '#ccc',
    backgroundColor: '#fff',
  },
  privacyButtonSelected: {
    backgroundColor: '#007AFF',
    borderColor: '#007AFF',
  },
  privacyButtonText: {
    fontSize: 13, // Ligeiramente menor
    fontWeight: '600',
    color: '#555',
    marginLeft: 4, // Menos espaço do ícone
  },
  privacyButtonTextSelected: {
    color: '#fff',
  },
});