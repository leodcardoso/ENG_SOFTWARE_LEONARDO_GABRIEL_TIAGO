// src/views/Login/LoginScreen.tsx
import { useRouter } from 'expo-router';
import React, { useState } from 'react';
import { ActivityIndicator, Button, Text, TextInput, View } from 'react-native';
import { useAuthViewModel } from '../../viewmodels/AuthViewModel';
import { styles } from './styles';

export default function LoginScreen({ navigation }: any) {
  const router = useRouter();
  const { login, loading, error } = useAuthViewModel();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [localError, setLocalError] = useState<string | null>(null);

  const handleLogin = async () => {
    try {
      setLocalError(null);
      const result = await login(email, password);
      console.log("Resultado do login:", result);
      
      if (result.success && result.user) {
        console.log("Login bem-sucedido, navegando para /main");
        // Adiciona um pequeno delay para garantir que o estado foi atualizado
        setTimeout(() => {
          router.replace('/main');
        }, 100);
      } else {
        setLocalError(result.error || 'Erro ao fazer login');
      }
    } catch (err) {
      console.error("Erro no handleLogin:", err);
      setLocalError('Erro inesperado ao fazer login');
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Entrar</Text>

      <TextInput
        style={styles.input}
        placeholder="E-mail"
        value={email}
        onChangeText={setEmail}
      />

      <TextInput
        style={styles.input}
        placeholder="Senha"
        value={password}
        onChangeText={setPassword}
        secureTextEntry
      />

      {(error || localError) && <Text style={styles.error}>{error || localError}</Text>}

      {loading ? (
        <ActivityIndicator />
      ) : (
        <Button title="Login" onPress={handleLogin} />
      )}

      <Text
        style={styles.link}
        onPress={() => router.push('/register')}
      >
        Criar conta
      </Text>
    </View>
  );
}
