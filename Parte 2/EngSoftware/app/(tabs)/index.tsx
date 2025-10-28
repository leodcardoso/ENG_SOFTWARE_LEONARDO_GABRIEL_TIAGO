import React from 'react';
import { View } from 'react-native';
import LoginScreen from '../../FrontEnd/views/Login/LoginScreen'; // <-- import direto
import RegisterScreen from '../../FrontEnd/views/Register/RegisterScreen'; // <-- import direto
import RankingScreen from '../../FrontEnd/views/Ranking/RankingScreen'; // <-- import direto
import CriarDesafioScreen from '../../FrontEnd/views/CreateChallenge/CreateChallengeScreen'; // <-- import direto

import { apiRequest, getToken, createChallenge } from '../../services/api'; // Ajustado para ../
// Opcional - se for decodificar o token
import { jwtDecode } from "jwt-decode"; 
// import { useRouter, useFocusEffect } from 'expo-router';
// const router = useRouter();
// import AppNavigator from '../navigation/AppNavigator';



import { Text, Button } from "react-native";
import { useRouter } from "expo-router";

export default function HomeScreen() {
  const router = useRouter();

  return (
    <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
      <Text style={{ fontSize: 20, marginBottom: 20 }}>Bem-vindo!</Text>
      <Button title="Ir para Login" onPress={() => router.push("/login")} />
      <Button title="Ir para Cadastro" onPress={() => router.push("/register")} />
      <Button title="Ir para Criar Desafio" onPress={() => router.push("/createChallenge")} />
      <Button title="Ir para Main" onPress={() => router.push("/main")} />
      <Button title="Ir para Friends" onPress={() => router.push("/friends")} />
      <Button title="Ir para Notificaoção" onPress={() => router.push("/notification")} />

    </View>
  );
}
