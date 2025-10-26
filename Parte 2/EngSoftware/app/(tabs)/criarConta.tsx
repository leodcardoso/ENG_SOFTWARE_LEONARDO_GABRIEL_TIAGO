import React, { useState } from "react";
import { 
  View, 
  Text, 
  TextInput, 
  StyleSheet, 
  Button,
  Alert
  // Removidos imports não utilizados: TouchableOpacity, FlatList, Image, Ionicons
} from "react-native";
// Importa a função de registro do seu arquivo de API
// !! Ajuste o caminho se necessário !!
import { register } from '../../services/api'; 
// Importa o hook useRouter do Expo Router para navegação
import { useRouter } from 'expo-router';

// Renomeado para CriarContaScreen
export default function CriarContaScreen() { 
  const [nome, setNome] = useState("");
  // Renomeado para 'email' para corresponder ao backend
  const [email, setEmail] = useState(""); 
  const [senha, setSenha] = useState("");
  // Estado para confirmação de senha
  const [confirmarSenha, setConfirmarSenha] = useState(""); 
  
  const [loading, setLoading] = useState(false); 
  const [error, setError] = useState(""); 
  const router = useRouter(); 

  // Função que será chamada pelo botão "Criar Conta"
  const handleRegister = async () => {
    setError(""); // Limpa erros anteriores

    // --- Validação Simples ---
    if (!nome || !email || !senha || !confirmarSenha) {
      setError("Todos os campos são obrigatórios.");
      Alert.alert("Erro", "Por favor, preencha todos os campos.");
      return;
    }
    if (senha !== confirmarSenha) {
      setError("As senhas não coincidem.");
      Alert.alert("Erro", "As senhas digitadas não coincidem.");
      return;
    }
    // TODO: Adicionar validação de formato de email

    setLoading(true); // Ativa o indicador de carregamento

    // Chama a função 'register' do api.ts
    const result = await register(nome, email, senha); 

    setLoading(false); // Desativa o indicador de carregamento

    if (result.success) {
      console.log("Conta criada com sucesso:", result.user);
      Alert.alert(
        "Sucesso!", 
        "Conta criada com sucesso. Faça o login para continuar.",
        [{ text: "OK", onPress: () => router.push('/login') }] // Botão OK redireciona para login
      );
      // Limpa os campos após sucesso (opcional)
      setNome('');
      setEmail('');
      setSenha('');
      setConfirmarSenha('');
      
      router.push('/login'); // Navega para a tela de login
    } else {
      // Registro falhou
      console.error("Erro ao criar conta:", result.error);
      const errorMessage = result.error || "Erro desconhecido ao tentar criar a conta.";
      setError(errorMessage); 
      Alert.alert("Erro ao Criar Conta", errorMessage);
    }
  };
  
  return (
    <View style={styles.container}>
      {/* Título corrigido */}
      <Text style={styles.titulo}>Criar Nova Conta</Text> 
      <View style={styles.card}>
        <Text style={styles.label}>Nome de Usuário</Text>
        <TextInput
          style={styles.input}
          value={nome}
          onChangeText={setNome}
          placeholder="Seu nome completo ou apelido"
          placeholderTextColor="#999"
          autoCapitalize="words" // Capitaliza nomes
        />
        {/* Campo ajustado para Email */}
        <Text style={styles.label}>Email</Text> 
        <TextInput
          style={styles.input}
          value={email} // Usa o estado 'email'
          onChangeText={setEmail} // Atualiza o estado 'email'
          keyboardType="email-address" 
          autoCapitalize="none" 
          placeholder="seuemail@exemplo.com" 
          placeholderTextColor="#999"
        />
        <Text style={styles.label}>Senha</Text>
        <TextInput
          style={styles.input}
          value={senha}
          onChangeText={setSenha}
          secureTextEntry // Esconde a senha
          placeholder="Crie uma senha segura" 
          placeholderTextColor="#999"
        />
        {/* Campo de Confirmação de Senha */}
        <Text style={styles.label}>Confirmar Senha</Text> 
        <TextInput
          style={styles.input}
          value={confirmarSenha} // Usa o estado 'confirmarSenha'
          onChangeText={setConfirmarSenha} // Atualiza o estado 'confirmarSenha'
          secureTextEntry // Esconde a senha
          placeholder="Digite a senha novamente" 
          placeholderTextColor="#999"
        />
        
        {/* Mostra a mensagem de erro, se houver */}
        {error ? <Text style={styles.errorText}>{error}</Text> : null}
      </View>
      {/* Botão chama handleRegister */}
      <Button 
        title={loading ? "Criando..." : "Criar Conta"} 
        onPress={handleRegister} 
        disabled={loading} 
      />
       {/* Botão para voltar ao Login */}
       <View style={{ marginTop: 15 }}> 
         <Button 
            title="Já tem conta? Faça Login" 
            onPress={() => router.push('/login')} 
            color="#007AFF" // Cor azul (opcional)
         />
       </View>
    </View>
  );
}

// Estilos adaptados da sua tela de login
const styles = StyleSheet.create({
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
  errorText: { 
    color: 'red',
    marginTop: 15, // Aumenta espaço
    textAlign: 'center',
    fontSize: 14,
  },
});