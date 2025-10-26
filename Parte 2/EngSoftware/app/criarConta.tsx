import React, { useState } from "react";
import {
  Alert,
  Button,
  ScrollView // Import ScrollView for longer forms
  ,
  StyleSheet,
  Text,
  TextInput,
  View
} from "react-native";
// Importa a função de registro do seu arquivo de API
// !! Ajuste o caminho se necessário !!
import { register } from '../services/api';
// Importa o hook useRouter do Expo Router para navegação
import { useRouter } from 'expo-router';

export default function CriarContaScreen() {
  const [nome, setNome] = useState("");
  const [email, setEmail] = useState("");
  const [senha, setSenha] = useState("");
  const [confirmarSenha, setConfirmarSenha] = useState("");
  const [bio, setBio] = useState(""); // Para profile.bio
  const [horarioLembrete, setHorarioLembrete] = useState("09:00"); // Para settings.remindersDefault

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const router = useRouter();

  // Função que será chamada pelo botão "Criar Conta"
  const handleRegister = async () => {
    setError("");

    // --- Validação Simples ---
    if (!nome || !email || !senha || !confirmarSenha) {
      setError("Campos Nome, Email e Senhas são obrigatórios.");
      Alert.alert("Erro", "Por favor, preencha nome, email e as senhas.");
      return;
    }
    if (senha !== confirmarSenha) {
      setError("As senhas não coincidem.");
      Alert.alert("Erro", "As senhas digitadas não coincidem.");
      return;
    }
    // TODO: Adicionar validação de formato de email
    // TODO: Adicionar validação de formato de horário (HH:MM) para horarioLembrete

    setLoading(true);

    // --- Monta o objeto de dados para enviar ---
    // Inclui os campos adicionais para serem enviados à API
    const userData = {
        name: nome,
        email: email,
        password: senha,
        // Dados adicionais (serão tratados no backend para aninhar em profile/settings)
        bio: bio,
        remindersDefault: horarioLembrete
        // 'privateByDefault' removido daqui
    };

    // Chama a função 'register' do api.ts (que precisará ser ajustada para enviar userData)
    // Assumindo que a função register foi atualizada para aceitar um objeto
    // const result = await register(userData);
    // Por enquanto, mantendo a chamada original, mas você precisará ajustar api.ts e server.js
    const result = await register(nome, email, senha); // <-- Mantenha isso se ainda não ajustou api.ts/server.js
                                                     // Ou ajuste para: const result = await register(userData);


    setLoading(false);

    if (result.success) {
      console.log("Conta criada com sucesso:", result.user);
      Alert.alert(
        "Sucesso!",
        "Conta criada com sucesso. Faça o login para continuar.",
        [{ text: "OK", onPress: () => router.push('/login') }]
      );
      // Limpa os campos após sucesso
      setNome('');
      setEmail('');
      setSenha('');
      setConfirmarSenha('');
      setBio('');
      setHorarioLembrete('09:00');
      // setPrivadoPadrao(false); // Removido

      router.push('/login'); // Já está no Alert onPress
    } else {
      console.error("Erro ao criar conta:", result.error);
      const errorMessage = result.error || "Erro desconhecido ao tentar criar a conta.";
      setError(errorMessage);
      Alert.alert("Erro ao Criar Conta", errorMessage);
    }
  };

  return (
    // Usa ScrollView para permitir rolagem se o conteúdo for maior que a tela
    <ScrollView contentContainerStyle={styles.scrollContainer}>
      <View style={styles.container}>
        <Text style={styles.titulo}>Criar Nova Conta</Text>
        <View style={styles.card}>
          {/* Campos existentes */}
          <Text style={styles.label}>Nome de Usuário</Text>
          <TextInput style={styles.input} value={nome} onChangeText={setNome} placeholder="Seu nome" placeholderTextColor="#999" autoCapitalize="words"/>
          <Text style={styles.label}>Email</Text>
          <TextInput style={styles.input} value={email} onChangeText={setEmail} keyboardType="email-address" autoCapitalize="none" placeholder="seuemail@exemplo.com" placeholderTextColor="#999"/>
          <Text style={styles.label}>Senha</Text>
          <TextInput style={styles.input} value={senha} onChangeText={setSenha} secureTextEntry placeholder="Crie uma senha" placeholderTextColor="#999"/>
          <Text style={styles.label}>Confirmar Senha</Text>
          <TextInput style={styles.input} value={confirmarSenha} onChangeText={setConfirmarSenha} secureTextEntry placeholder="Digite a senha novamente" placeholderTextColor="#999"/>

          {/* --- Novos Campos --- */}
          <Text style={styles.label}>Bio (Opcional)</Text>
          <TextInput style={[styles.input, styles.textArea]} value={bio} onChangeText={setBio} placeholder="Fale um pouco sobre você..." placeholderTextColor="#999" multiline numberOfLines={3}/>

          <Text style={styles.label}>Horário Padrão Lembretes (HH:MM)</Text>
          <TextInput style={styles.input} value={horarioLembrete} onChangeText={setHorarioLembrete} placeholder="Ex: 09:00" placeholderTextColor="#999" keyboardType="numbers-and-punctuation"/>

          {/* --- Switch Removido --- */}
          {/* <View style={styles.switchContainer}> ... </View> */}

          {error ? <Text style={styles.errorText}>{error}</Text> : null}
        </View>
        <Button title={loading ? "Criando..." : "Criar Conta"} onPress={handleRegister} disabled={loading}/>
        <View style={{ marginTop: 15 }}>
          <Button title="Já tem conta? Faça Login" onPress={() => router.push('/login')} color="#007AFF"/>
        </View>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  scrollContainer: {
    flexGrow: 1,
    justifyContent: 'center',
  },
  container: {
    flex: 1,
    backgroundColor: "#fff",
    padding: 20,
    justifyContent: 'center',
  },
  titulo: {
    fontSize: 24,
    fontWeight: "700",
    marginBottom: 24,
    textAlign: 'center',
  },
  card: {
    backgroundColor: "#fafafa",
    borderRadius: 12,
    padding: 20,
    marginBottom: 24,
    borderWidth: 1,
    borderColor: "#eee",
  },
  label: {
    fontWeight: "600",
    fontSize: 14,
    marginTop: 12,
    marginBottom: 4,
  },
  input: {
    backgroundColor: "#fff",
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "#ddd",
    paddingHorizontal: 12,
    paddingVertical: 10,
    fontSize: 16,
    color: '#333',
  },
  textArea: {
      height: 80,
      textAlignVertical: "top",
  },
  // Estilos switchContainer e labelSwitch removidos
  errorText: {
    color: 'red',
    marginTop: 15,
    textAlign: 'center',
    fontSize: 14,
  },
});