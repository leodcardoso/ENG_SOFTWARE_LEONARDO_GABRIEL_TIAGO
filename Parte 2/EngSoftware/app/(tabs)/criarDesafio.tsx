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
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from 'expo-router';
// Importa o Picker de Hábitos
import { Picker } from '@react-native-picker/picker';
// DateTimePickerModal removido
// Ajuste o caminho conforme sua estrutura
// Adicionado createChallenge à importação
import { apiRequest, getToken, createChallenge } from '../../services/api';
// import { jwtDecode } from "jwt-decode";

// --- Interfaces ---
interface Amigo { id: number; nome: string; imagem: string; selecionado: boolean; }
interface HabitoUsuario { id: number; title: string; }
interface JwtPayload { userId: number; email: string; role: string; }
type ChallengePrivacy = 'public' | 'participants_only' | 'private';

// --- Componente Principal ---
export default function CriarDesafioScreen() {
  const router = useRouter();

  // --- Estados do Formulário ---
  const [titulo, setTitulo] = useState("");
  const [habitoSelecionadoId, setHabitoSelecionadoId] = useState<number | null>(null);
  const [checkInsNecessarios, setCheckInsNecessarios] = useState("");
  // Estado dataFim agora é string para o TextInput (AAAA-MM-DD)
  const [dataFim, setDataFim] = useState<string>("");
  // Estados e funções do DateTimePickerModal removidos
  // const [isDatePickerVisible, setDatePickerVisibility] = useState(false);
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
    // ... (Lógica idêntica à anterior para buscar dados) ...
     const fetchData = async () => { setLoadingAmigos(true); setLoadingHabitos(true); setError(""); let currentUserId: number | null = null; try { const token = await getToken(); if (token) { console.warn("Usando userId=1 fixo!"); currentUserId = 1; setUserIdLogado(currentUserId); } else { setError("Não autenticado."); setLoadingAmigos(false); setLoadingHabitos(false); router.replace('/login'); return; } } catch (e) { setError("Erro sessão."); console.error("Erro token:", e); setLoadingAmigos(false); setLoadingHabitos(false); router.replace('/login'); return; } if (!currentUserId) { setLoadingAmigos(false); setLoadingHabitos(false); return; } try { const user = await apiRequest(`/users/${currentUserId}`); if (user?.friends?.length > 0) { const friendsData: any[] = await Promise.all(user.friends.map((id: number) => apiRequest(`/users/${id}`))); setAmigos(friendsData.filter(f=>f).map(f => ({ id: f.id, nome: f.name || `?`, imagem: f.profile?.avatar || "https://placehold.co/40x40/ccc/fff?text=??", selecionado: false }))); } else { setAmigos([]); } } catch (err) { console.error("Erro amigos:", err); setError("Falha carregar amigos."); setAmigos([]); } finally { setLoadingAmigos(false); } try { const todosHabitos = await apiRequest('/habits'); if (Array.isArray(todosHabitos)) { const meusHabitos = todosHabitos.filter((h: any) => h && h.userId === currentUserId); setHabitosUsuario(meusHabitos.map((h: any) => ({ id: h.id, title: h.title }))); } else { setHabitosUsuario([]); } } catch (err) { console.error("Erro hábitos:", err); setError("Falha carregar hábitos."); setHabitosUsuario([]); } finally { setLoadingHabitos(false); } }; fetchData();
  }, []);

  // --- Funções de Manipulação ---
  const toggleAmigo = (idSel: number) => setAmigos(prev => prev.map(a => a.id === idSel ? { ...a, selecionado: !a.selecionado } : a ));

  // Funções showDatePicker, hideDatePicker, handleConfirmDate removidas

  // Função para validar formato AAAA-MM-DD (mantida)
  const isValidDateString = (dateString: string): boolean => {
      const regex = /^\d{4}-\d{2}-\d{2}$/;
      if (!regex.test(dateString)) return false;
      const date = new Date(dateString + "T00:00:00");
      const timestamp = date.getTime();
      if (typeof timestamp !== 'number' || Number.isNaN(timestamp)) return false;
      return date.toISOString().startsWith(dateString);
  };

  // --- Função de Submissão ---
  const handleCriarDesafio = async () => {
     setError(""); setSubmitLoading(true);

     // --- Validações ATUALIZADAS para data como string ---
     if (!titulo || !habitoSelecionadoId || !checkInsNecessarios || !dataFim) {
        setError("Preencha Título, Hábito, Nº Check-ins e Data Fim (AAAA-MM-DD).");
        console.error("Validação:", "Campos obrigatórios faltando");
        setSubmitLoading(false); return;
     }
     if (!isValidDateString(dataFim)) {
         setError("Formato da Data de Término inválido. Use AAAA-MM-DD.");
         console.error("Validação:", "Formato data inválido");
         setSubmitLoading(false); return;
     }
     const numCheckIns = parseInt(checkInsNecessarios, 10);
     if (isNaN(numCheckIns) || numCheckIns <= 0) {
         setError("Nº de check-ins inválido.");
         console.error("Validação:", "Nº check-ins inválido");
         setSubmitLoading(false); return;
     }
     const dataFimObj = new Date(dataFim + "T00:00:00");
     const tomorrow = new Date(); tomorrow.setDate(tomorrow.getDate() + 1); tomorrow.setHours(0, 0, 0, 0);
     if (dataFimObj < tomorrow) {
         setError("Data de término deve ser a partir de amanhã.");
         console.error("Validação:", "Data passada");
         setSubmitLoading(false); return;
     }

     // --- Preparar Dados ---
     const participantesIds = amigos.filter(a => a.selecionado).map(a => a.id);
     if (!userIdLogado) { setError("ID do criador não encontrado."); console.error("Erro:", "ID Criador nulo"); setSubmitLoading(false); return; }
     participantesIds.push(userIdLogado);

     // Usa dataFim (string) diretamente no payload
     const challengeData = {
       creatorId: userIdLogado, title: titulo,
       startDate: new Date().toISOString().slice(0, 10),
       endDate: dataFim, // Envia a string AAAA-MM-DD
       goal: { habitId: habitoSelecionadoId, checksRequired: numCheckIns },
       participantIds: [...new Set(participantesIds)],
       privacy: privacidade
     };

     console.log("Enviando:", challengeData);

     // --- Chamar API ---
     try {
       console.log("Chamando createChallenge...");
       const result = await createChallenge(challengeData); // Usa a função importada
       

       if (result.success) {
         console.log("Sucesso! Desafio criado:", result.challenge);
         router.back(); // Volta para a tela anterior
       } else {
         console.error("Erro retornado pela API createChallenge:", result.error);
         setError(result.error || "Não foi possível criar o desafio (erro da API).");
       }
     } catch (apiError) { // Captura erros lançados por apiRequest (ex: rede)
       console.error("Erro na chamada API ao criar desafio:", apiError);
       let errorMessage = "Não foi possível criar o desafio. Verifique sua conexão ou tente mais tarde.";
       if (apiError instanceof Error) { errorMessage = apiError.message; }
       else if (typeof apiError === 'string') { errorMessage = apiError; }
       setError(errorMessage);
     } finally {
       setSubmitLoading(false); // Desativa loading no final
     }
  }; // Fim de handleCriarDesafio

  // --- Renderização ---
  if (loadingAmigos || loadingHabitos) { /* ... Loading ... */ }
  if (error && !loadingAmigos && !loadingHabitos && !submitLoading) { /* ... Error ... */ }

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.scrollContainer}>
      <Text style={styles.titulo}>Criar Novo Desafio</Text>
      {error && !submitLoading ? <Text style={styles.errorText}>{error}</Text> : null}

      <View style={styles.card}>
        <Text style={styles.label}>Título do Desafio *</Text>
        <TextInput style={styles.input} placeholder="Ex: Semana da Meditação Diária" value={titulo} onChangeText={setTitulo} maxLength={100}/>

        <Text style={styles.label}>Hábito Alvo *</Text>
        <View style={styles.pickerContainer}>
          <Picker selectedValue={habitoSelecionadoId} onValueChange={(itemValue) => setHabitoSelecionadoId(itemValue ? Number(itemValue) : null)} style={styles.picker} prompt="Selecione um hábito">
            <Picker.Item label="-- Selecione um hábito --" value={null} style={styles.pickerItemPlaceholder} />
            {habitosUsuario.map((habito) => (<Picker.Item key={habito.id} label={habito.title} value={habito.id} style={styles.pickerItem} />))}
          </Picker>
        </View>

        <Text style={styles.label}>Nº de Check-ins Necessários *</Text>
        <TextInput style={styles.input} placeholder="Ex: 7" value={checkInsNecessarios} onChangeText={setCheckInsNecessarios} keyboardType="number-pad"/>

        {/* --- Input de Texto para Data --- */}
        <Text style={styles.label}>Data de Término * (AAAA-MM-DD)</Text>
        <TextInput
            style={styles.input}
            placeholder="AAAA-MM-DD"
            value={dataFim}
            onChangeText={setDataFim} // Atualiza a string
            maxLength={10}
            keyboardType="numeric" // Facilita digitar números e traços
         />
        {/* --- Fim Input de Texto para Data --- */}
        {/* DateTimePickerModal removido */}

        {/* --- Seletor de Privacidade --- */}
        <Text style={styles.label}>Visibilidade do Desafio</Text>
        <View style={styles.privacySelector}>
            {/* Botões ajustados */}
            <TouchableOpacity style={[styles.privacyButton, privacidade === 'public' && styles.privacyButtonSelected]} onPress={() => setPrivacidade('public')} disabled={submitLoading}>
                <Ionicons name="earth" size={16} color={privacidade === 'public' ? '#fff' : '#666'} />
                <Text style={[styles.privacyButtonText, privacidade === 'public' && styles.privacyButtonTextSelected]}> Público</Text>
            </TouchableOpacity>
            <TouchableOpacity style={[styles.privacyButton, privacidade === 'participants_only' && styles.privacyButtonSelected]} onPress={() => setPrivacidade('participants_only')} disabled={submitLoading}>
                <Ionicons name="people" size={16} color={privacidade === 'participants_only' ? '#fff' : '#666'} />
                <Text style={[styles.privacyButtonText, privacidade === 'participants_only' && styles.privacyButtonTextSelected]}> Participantes</Text>
            </TouchableOpacity>
            <TouchableOpacity style={[styles.privacyButton, privacidade === 'private' && styles.privacyButtonSelected]} onPress={() => setPrivacidade('private')} disabled={submitLoading}>
                <Ionicons name="lock-closed" size={16} color={privacidade === 'private' ? '#fff' : '#666'} />
                <Text style={[styles.privacyButtonText, privacidade === 'private' && styles.privacyButtonTextSelected]}> Privado</Text>
            </TouchableOpacity>
        </View>
        {/* --- Fim Seletor Privacidade --- */}
      </View>

      <Text style={styles.subtitulo}>Convidar Amigos (Opcional)</Text>
      {/* ... (FlatList de Amigos) ... */}
       {loadingAmigos ? (<ActivityIndicator style={{ marginVertical: 20 }}/>) : amigos.length === 0 ? (<Text style={styles.infoText}>Você não tem amigos para convidar.</Text>) : (<FlatList data={amigos} keyExtractor={(item) => item.id.toString()} renderItem={({ item }) => (<TouchableOpacity style={styles.amigoCard} onPress={() => !submitLoading && toggleAmigo(item.id)} activeOpacity={0.7}><View style={styles.amigoInfo}><Image source={{ uri: item.imagem }} style={styles.foto} /><Text style={styles.nomeAmigo}>{item.nome}</Text></View><Ionicons name={item.selecionado ? "checkbox" : "square-outline"} size={24} color={item.selecionado ? "#007AFF" : "#ccc"} /></TouchableOpacity>)} style={{ maxHeight: 250, marginBottom: 20 }} />)}

      <View style={{ marginBottom: 40 }}>
          <Button title={submitLoading ? "Criando..." : "Criar Desafio"} onPress={handleCriarDesafio} disabled={submitLoading || loadingAmigos || loadingHabitos}/>
      </View>
    </ScrollView>
  );
}

// --- Estilos --- (Styles do DateTimePicker removidos)
const styles = StyleSheet.create({
  scrollContainer: { flexGrow: 1, paddingBottom: 20 },
  container: { flex: 1, backgroundColor: "#fff", paddingHorizontal: 20, paddingTop: 20 },
  centered: { flex: 1, justifyContent: "center", alignItems: "center", padding: 20, backgroundColor: '#fff' },
  titulo: { fontSize: 22, fontWeight: "700", marginBottom: 20, textAlign: 'center', color: '#333' },
  card: { backgroundColor: "#fdfdfd", borderRadius: 12, padding: 20, marginBottom: 24, borderWidth: 1, borderColor: "#eaeaea", shadowColor: "#000", shadowOffset: { width: 0, height: 1 }, shadowOpacity: 0.05, shadowRadius: 2, elevation: 2 },
  label: { fontWeight: "600", fontSize: 14, marginTop: 15, marginBottom: 6, color: '#555' },
  input: { backgroundColor: "#fff", borderRadius: 8, borderWidth: 1, borderColor: "#ccc", paddingHorizontal: 12, paddingVertical: 12, fontSize: 16, color: '#333' },
  textArea: { height: 80, textAlignVertical: "top" },
  // Estilos dateInputButton, dateText, dateTextPlaceholder removidos
  pickerContainer: { backgroundColor: "#fff", borderRadius: 8, borderWidth: 1, borderColor: "#ccc", marginTop: 4, justifyContent: 'center', height: 50, overflow: 'hidden' },
  picker: { width: '100%', height: '100%', color: '#333', backgroundColor: 'transparent' },
  pickerItem: { color: '#333', fontSize: 16 },
  pickerItemPlaceholder: { color: '#999', fontSize: 16 },
  subtitulo: { fontWeight: "600", fontSize: 18, marginBottom: 15, marginTop: 10, color: '#444' },
  amigoCard: { flexDirection: "row", justifyContent: "space-between", alignItems: "center", backgroundColor: "#fff", borderRadius: 10, paddingVertical: 12, paddingHorizontal: 15, marginBottom: 10, borderWidth: 1, borderColor: "#eee" },
  amigoInfo: { flexDirection: "row", alignItems: "center", flexShrink: 1 },
  foto: { width: 40, height: 40, borderRadius: 20, marginRight: 12, backgroundColor: '#eee' },
  nomeAmigo: { fontSize: 16, fontWeight: "500", color: '#333', marginRight: 10 },
  errorText: { color: 'red', marginTop: 15, textAlign: 'center', fontSize: 14 },
  infoText: { textAlign: 'center', color: '#666', marginVertical: 20, fontSize: 15, paddingHorizontal: 10 },
  privacySelector: { flexDirection: 'row', marginTop: 15, marginBottom: 5 },
  privacyButton: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', paddingVertical: 8, paddingHorizontal: 10, borderRadius: 18, borderWidth: 1.5, borderColor: '#ccc', backgroundColor: '#fff', marginHorizontal: 4, flexGrow: 1, flexBasis: 0 },
  privacyButtonSelected: { backgroundColor: '#007AFF', borderColor: '#007AFF' },
  privacyButtonText: { fontSize: 13, fontWeight: '600', color: '#555', marginLeft: 4, textAlign: 'center' },
  privacyButtonTextSelected: { color: '#fff' },
});