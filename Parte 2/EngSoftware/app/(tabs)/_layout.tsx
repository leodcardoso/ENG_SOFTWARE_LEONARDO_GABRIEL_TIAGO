import React, { useState } from "react";
import { 
  View, 
  Text, 
  TextInput, 
  StyleSheet, 
  Button,
  Alert,
  TouchableOpacity // Mantido caso queira usar para o botão de registro
} from "react-native";
// Importa a função de login do seu arquivo de API
// !! Ajuste o caminho se sua pasta 'services' está na raiz do projeto !!
import { login } from '../../services/api'; // Ex: Se login.tsx está em app/(tabs)/login.tsx
// Importa o hook useRouter do Expo Router
import { useRouter } from 'expo-router';

// Este componente NÃO recebe 'navigation' como prop no Expo Router
export default function LoginScreen() { 
  const [email, setEmail] = useState("");
  const [senha, setSenha] = useState("");
  const [loading, setLoading] = useState(false); 
  const [error, setError] = useState(""); 
  // Usa o hook useRouter para navegação programática
  const router = useRouter(); 

  // Função que será chamada pelo botão "Fazer Login"
  const handleLogin = async () => {
    setError(""); 
    setLoading(true); 
    const result = await login(email, senha); 
    setLoading(false); 

    if (result.success) {
      console.log("Login bem-sucedido!");
      Alert.alert("Sucesso!", "Login realizado com sucesso.");
      // Navegar para a tela de ranking dentro do grupo (tabs)
      // O Expo Router usa caminhos de arquivo como rotas.
      // Se ranking.tsx está em app/(tabs)/ranking.tsx, o caminho é '/ranking' (dentro do layout de tabs)
      // Usamos replace para não poder voltar para a tela de login.
      router.replace('/ranking'); 
    } else {
      console.error("Erro no login:", result.error);
      setError(result.error || "Erro desconhecido ao tentar fazer login."); 
      Alert.alert("Erro de Login", result.error || "Não foi possível fazer login. Verifique as suas credenciais.");
    }
  };

  // Função para navegar para a tela de criar conta
  const goToCriarConta = () => {
    // Navega para a rota correspondente ao arquivo criarConta.tsx
    // Se estiver em app/(tabs)/criarConta.tsx, o caminho é '/criarConta'
    router.push('/criarConta'); 
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

       <View style={{ marginTop: 15 }}> 
         <Button 
            title="Não tem conta? Crie uma" 
            onPress={goToCriarConta} 
            color="#007AFF" // Cor azul (opcional)
         />
       </View>

      {/* Opção B: Usando TouchableOpacity (mantida como exemplo) */}
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
  registerButton: { 
    marginTop: 20,
    alignItems: 'center',
  },
  registerButtonText: { 
    color: '#007AFF',
    fontSize: 15,
  }
});