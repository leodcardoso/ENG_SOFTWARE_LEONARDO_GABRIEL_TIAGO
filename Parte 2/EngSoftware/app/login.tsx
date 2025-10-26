import React, { useState } from "react";

import {
  Alert,
  Button,
  StyleSheet,
  Text,
  TextInput,
  View
} from "react-native";
// Importa a função de login do seu arquivo de API
// Ajuste o caminho se o seu arquivo api.ts estiver noutro lugar (ex: ../../services/api)
import * as api from '../services/api'; // Ajuste este caminho!
// Importa o tipo apropriado da sua biblioteca de navegação
import { useRouter } from 'expo-router';

export default function LoginScreen() { // <--- Definição simplificada
  const [email, setEmail] = useState("");
  const [senha, setSenha] = useState("");
  const [loading, setLoading] = useState(false); 
  const [error, setError] = useState(""); 
  // Usa o hook useRouter para navegação programática
  const router = useRouter();

  // Função que será chamada pelo botão "Fazer Login"
  const handleLogin = async () => {
    console.log(">>> Botão Fazer Login CLICADO!");
    setError(""); 
    setLoading(true); 
    const result = await api.login(email, senha); 
    setLoading(false); 

    if (result.success) {
      console.log("Login bem-sucedido!");
      Alert.alert("Sucesso!", "Login realizado com sucesso.");
      // Usa replace para que o utilizador não possa voltar para a tela de Login
      router.replace('/'); // AQUI MUDAR PARA O CERTO
    } else {
      console.error("Erro no login:", result.error);
      setError(result.error || "Erro desconhecido ao tentar fazer login."); 
      Alert.alert("Erro de Login", result.error || "Não foi possível fazer login. Verifique as suas credenciais.");
    }
  };

  // Função para navegar para a tela de criar conta
  const goToCriarConta = () => {
    router.push('/criarConta'); // Usa o nome exato da sua tela: criarConta
  };
  
  return (
    <View style={styles.container}>
      <Text style={styles.titulo}>Login</Text>
      <View style={styles.card}>
        <Text style={styles.label}>Email</Text>
        <TextInput
          style={styles.input}
          value={email}
          onChangeText={setEmail}
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
          secureTextEntry 
          placeholder="Sua senha" 
          placeholderTextColor="#999" 
        />
        {error ? <Text style={styles.errorText}>{error}</Text> : null}
      </View>
      <Button 
        title={loading ? "Entrando..." : "Fazer Login"} 
        onPress={handleLogin} 
        disabled={loading} 
      />

      {/* --- PASSO 3: Adicionar Botão para Criar Conta --- */}
      {/* Opção A: Usando Botão padrão */}
       <View style={{ marginTop: 15 }}> 
         <Button 
            title="Não tem conta? Crie uma" 
            onPress={goToCriarConta} 
            color="#007AFF" // Cor azul (opcional)
         />
       </View>

      {/* Opção B: Usando TouchableOpacity para mais estilo (descomente se preferir) */}
      {/* <TouchableOpacity onPress={goToCriarConta} style={styles.registerButton}>
        <Text style={styles.registerButtonText}>Não tem conta? Crie uma</Text>
      </TouchableOpacity> */}
    </View>
  );
}

// Seus estilos (mantidos da versão anterior)
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
    marginTop: 10,
    textAlign: 'center',
    fontSize: 14,
  },
  registerButton: { // Exemplo de estilo para botão de registro com TouchableOpacity
    marginTop: 20,
    alignItems: 'center',
  },
  registerButtonText: { // Exemplo de estilo para texto do botão de registro com TouchableOpacity
    color: '#007AFF',
    fontSize: 15,
  }
});