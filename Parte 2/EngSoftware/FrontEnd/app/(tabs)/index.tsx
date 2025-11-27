import React from 'react';
import { View } from 'react-native';
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
