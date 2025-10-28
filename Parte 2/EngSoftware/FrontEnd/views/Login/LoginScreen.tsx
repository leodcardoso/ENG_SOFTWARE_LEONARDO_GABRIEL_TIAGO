// src/views/Login/LoginScreen.tsx
import React, { useState } from 'react';
import { View, TextInput, Button, Text, ActivityIndicator } from 'react-native';
import { useAuthViewModel } from '../../viewmodels/AuthViewModel';
import { styles } from './styles';
import { useRouter } from 'expo-router';

export default function LoginScreen({ navigation }: any) {
  const router = useRouter();
  const { login, loading, error, user } = useAuthViewModel();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleLogin = async () => {
    await login(email, password);
    if (user) {
      router.push('/main'); // navega para tela principal
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

      {error && <Text style={styles.error}>{error}</Text>}

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
