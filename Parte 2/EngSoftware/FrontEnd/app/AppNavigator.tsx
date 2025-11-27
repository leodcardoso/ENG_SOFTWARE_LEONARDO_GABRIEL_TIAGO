import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import LoginScreen from '../views/Login/LoginScreen';
import RegisterScreen from '../views/Register/RegisterScreen';
import RankingScreen from '../views/Ranking/RankingScreen';
import CriarDesafioScreen from '../views/CreateChallenge/CreateChallengeScreen';
import { NavigationContainer } from '@react-navigation/native';

export type RootStackParamList = {
  HabitList: undefined;
  HabitDetail: { token: string; habitId: string };
  Ranking: { token: string; challengeId: string };
  Main: undefined;
  Login: undefined;
};

const Stack = createStackNavigator<RootStackParamList>();

export default function AppNavigator() {
  return (
    <NavigationContainer>
        <Stack.Navigator>
        {/* <Stack.Screen name="Main" component={RankingScreen} options={{ title: 'Meus Hábitos' }} />   */}
        <Stack.Screen name="HabitList" component={RegisterScreen} options={{ title: 'Meus Hábitos' }} />
        <Stack.Screen name="HabitDetail" component={RegisterScreen} options={{ title: 'Detalhes do Hábito' }} />
        <Stack.Screen name="Ranking" component={RankingScreen} options={{ title: 'Ranking' }} />
        <Stack.Screen name="Login" component={LoginScreen} options={{ title: 'Ranking' }} />
        
        </Stack.Navigator>
    </NavigationContainer>
  );
}

