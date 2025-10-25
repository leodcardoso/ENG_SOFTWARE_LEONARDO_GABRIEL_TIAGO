import { HabitoConcluido, HabitoProgresso } from '@/components/habito';
import { router } from 'expo-router';
import React, { useEffect, useState } from 'react';
import { View, Text, Image, ScrollView, TouchableOpacity, StyleSheet, SafeAreaView, Button, ActivityIndicator, FlatList } from 'react-native';
import { router } from 'expo-router';



function criaDesafio(): void {
  router.push('/criaDesafio');
}


interface User {
  id: number;
  name: string;
  email: string;
  profile: {
    bio: string;
  };
  stats: {
    points: number;
    level: number;
  };
}

  

interface Habit {
  id: number;
  userId: number;
  title: string;
  description: string;
  progress: number;
  frequency: string;
  streak: number;
  bestStreak: number;
  pointsPerCheckIn: number;
  active: boolean;
  privacy: string;
  createdAt: string;
}

interface HabitsByStatus {
  completos: HabitResumo[];
  incompletos: HabitResumo[];
}

interface HabitResumo {
  id: number;
  title: string;
  progress: number;
  streak: number;
  bestStreak: number;
  pointsPerCheckIn: number;
}

async function fetchHabitosPorUsuario(idLocal: number): Promise<HabitsByStatus> {
  try {
    // Busca todos os hábitos
    const response = await fetch(`http://localhost:3000/habits`);
    if (!response.ok) throw new Error("Erro ao buscar hábitos");

    const allHabits: Habit[] = await response.json();

    // Filtra só os do usuário
    const habitosUsuario = allHabits.filter(h => h.userId === idLocal);

    // Cria apenas o resumo
    const habitosResumo: HabitResumo[] = habitosUsuario.map(h => ({
      id: h.id,
      title: h.title,
      progress: Math.random(), // Simula progresso, colocar no bd*
      streak: h.streak,
      bestStreak: h.bestStreak,
      pointsPerCheckIn: h.pointsPerCheckIn,
    }));

    // Separa completos e incompletos
    const completos = habitosResumo.filter(h => h.progress === 1);
    const incompletos = habitosResumo.filter(h => h.progress < 1);

    return { completos, incompletos };
  } catch (error) {
    console.error("Erro ao buscar hábitos:", error);
    return { completos: [], incompletos: [] };
  }
}














export default function Perfil() {


  let idLocal = 2; // <-- substitua pelo ID do usuário logado
   const [usuario, setUsuario] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  async function fetchUsuario(id: number) {
    try {
      const response = await fetch(`http://localhost:3000/users/${idLocal}`);
      if (!response.ok) throw new Error('Erro ao buscar usuário');
      const data = await response.json();
      setUsuario(data); // 🔹 Salva os dados no estado
    } catch (err) {
      console.error('Erro ao buscar usuário:', err);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    fetchUsuario(idLocal); // 🔹 Exemplo: usuário com ID 1
  }, []);


  const [habitos, setHabitos] = useState({ completos: [], incompletos: [] });

  useEffect(() => {
    fetchHabitosPorUsuario(idLocal).then(setHabitos);
  }, []);

  return (
    <View style={{ padding: 20 }}>
      <Text style={{ fontWeight: "bold", fontSize: 18 }}>Hábitos em andamento:</Text>
      <FlatList
        data={habitos.incompletos}
        keyExtractor={(item) => item.id.toString()}
        renderItem={({ item }) => (
          <HabitoProgresso
            idd={item.id}
            titulo={item.title}
            progresso={item.progress}
          />
        )}
      />

      <Text style={{ fontWeight: "bold", fontSize: 18, marginTop: 20 }}>Hábitos completos:</Text>
      <FlatList
        data={habitos.completos}
        keyExtractor={(item) => item.id.toString()}
        renderItem={({ item }) =><HabitoConcluido titulo={item.title} tempoConcluido={item.bestStreak}  />}
      />
    </View>
  );

  // return (
  //   <SafeAreaView style={styles.container}>
  //     <ScrollView showsVerticalScrollIndicator={false}>
  //       {/* Perfil */}
  //       <View style={styles.profileSection}>
  //         <Image source={{ uri: 'https://aboutreact.com/wp-content/uploads/2018/07/react_native_imageview.png' }} style={styles.avatar} />
  //         <Text style={styles.name}>{usuario?.name}</Text>
  //         <View style={styles.statsRow}>
  //           <Text>🏆 #12</Text>
  //           <Text>🔥 7</Text>
  //           <Text>💧 {usuario?.stats.points} pts</Text>
  //         </View>
  //       </View>

  //       {/* Hábitos em Progresso */}
  //       <Text style={styles.sectionTitle}>Hábitos em Progresso</Text>
  //       <HabitoProgresso idd={1} titulo="Beber 23333L de água" progresso={0.5} />
  //       <HabitoProgresso idd={2} titulo="Beber 4342432 de água" progresso={0.9} />
  //       <HabitoProgresso idd={3} titulo="Beber 4342432 de água" progresso={1} />

  //       {/* Hábitos Concluídos */}
  //       <HabitoConcluido titulo="teste1" tempoConcluido={34}/>
  //       <HabitoConcluido titulo="test2342341" tempoConcluido={2}/>

  //       {/* Botões */}
  //       <Button title="Criar Desafio" onPress={criaDesafio} />
  //       <TouchableOpacity style={styles.button}>
  //         <Text>Adicionar Amigos</Text>
  //       </TouchableOpacity>
  //     </ScrollView>
  //   </SafeAreaView>
  // );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f9f9f9' },
  profileSection: { alignItems: 'center', marginVertical: 20 },
  avatar: { width: 80, height: 80, borderRadius: 40 },
  name: { fontSize: 18, fontWeight: 'bold', marginTop: 10 },
  statsRow: { flexDirection: 'row', gap: 10, marginTop: 5 },
  sectionTitle: { fontSize: 16, fontWeight: 'bold', margin: 10 },
  
  habitDone: { backgroundColor: '#fff', padding: 15, borderRadius: 15, margin: 10 },
  button: { backgroundColor: '#e6e6e6', padding: 15, margin: 10, borderRadius: 10, alignItems: 'center' },
});

