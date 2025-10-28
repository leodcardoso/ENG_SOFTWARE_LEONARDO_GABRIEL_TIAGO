import React, { useState } from 'react';
import { View, Text, TextInput, Button, StyleSheet, ActivityIndicator } from 'react-native';
import {useAuthViewModel} from '../../viewmodels/AuthViewModel';
import { styles } from './styles';
import { useRouter } from 'expo-router';





export default function RegisterScreen({ navigation }: any) {
  
    const router = useRouter();
   const { register, loading, error, user } = useAuthViewModel();
   const [email, setEmail] = useState('');
   const [name, setName] = useState('');
   const [password, setPassword] = useState('');
 
   const handeRegistger = async () => {
     await register(name, email, password);
     if (user) {
      console.log("push login")
       router.push('/main'); // navega para tela principal
     }
   };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Registro</Text>

      <TextInput
        style={styles.input}
        placeholder="Nome"
        value={name}
        onChangeText={setName}
      />

      <TextInput
        style={styles.input}
        placeholder="E-mail"
        keyboardType="email-address"
        autoCapitalize="none"
        value={email}
        onChangeText={setEmail}
      />

      <TextInput
        style={styles.input}
        placeholder="Senha"
        secureTextEntry
        value={password}
        onChangeText={setPassword}
      />

      {loading ? (
        <ActivityIndicator size="large" color="#007AFF" />
      ) : (
        <Button title="Registrar" onPress={handeRegistger} />
      )}

      {error && <Text style={styles.error}>{error}</Text>}
    </View>
  );
}

