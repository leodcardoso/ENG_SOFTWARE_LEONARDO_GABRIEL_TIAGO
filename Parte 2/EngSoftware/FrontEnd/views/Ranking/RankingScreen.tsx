import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, ActivityIndicator, StyleSheet } from 'react-native';
import RankingViewModel from '../../viewmodels/RankingViewModel';
import { RouteProp, useRoute } from '@react-navigation/native';

type RootStackParamList = {
  Ranking: {
    token: string;
    challengeId: string;
  };
};

type RankingRouteProp = RouteProp<RootStackParamList, 'Ranking'>;



export default function RankingScreen() {
  const route = useRoute<RankingRouteProp>();
  const { token, challengeId } = route.params;
  const [viewModel] = useState(() => new RankingViewModel());
  const [refresh, setRefresh] = useState(false);

  useEffect(() => {
    (async () => {
      await viewModel.fetchRanking(token, challengeId);
      setRefresh((prev) => !prev); // força re-render
    })();
  }, [token, challengeId]);

  if (viewModel.loading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" color="#007AFF" />
        <Text>Carregando ranking...</Text>
      </View>
    );
  }

  if (viewModel.error) {
    return (
      <View style={styles.center}>
        <Text style={styles.error}>{viewModel.error}</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>🏆 Ranking do Desafio</Text>

      <FlatList
        data={viewModel.users}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <View style={styles.item}>
            <Text style={styles.position}>{item.position}º</Text>
            <View style={styles.info}>
              <Text style={styles.name}>{item.name}</Text>
              <Text style={styles.score}>{item.score} pts</Text>
            </View>
          </View>
        )}
        ListEmptyComponent={<Text style={styles.empty}>Nenhum participante ainda.</Text>}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    padding: 16,
  },
  center: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    textAlign: 'center',
    marginVertical: 16,
  },
  item: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F3F3F3',
    padding: 12,
    marginBottom: 8,
    borderRadius: 10,
  },
  position: {
    fontSize: 18,
    fontWeight: 'bold',
    marginRight: 12,
  },
  info: {
    flex: 1,
  },
  name: {
    fontSize: 16,
    fontWeight: '600',
  },
  score: {
    fontSize: 14,
    color: '#555',
  },
  error: {
    color: 'red',
    fontSize: 16,
    textAlign: 'center',
  },
  empty: {
    textAlign: 'center',
    color: '#777',
    marginTop: 20,
  },
});
