// import {View, Text, StyleSheet, Button} from 'react-native';
// import {Link, router} from 'expo-router';

// export default function HomePage() {
//   function goToProduct(prodId: number): void {
//     router.push(`./habito/${prodId}`);
//   }

//   return (
//     <View style={styles.container}>
//       <Text>Welcome to the Home Page!</Text>
//       <Link href="/user">Go to User Page</Link>
//       <Link href="/habito/45">Go to Product 123</Link>
//       <Button title="Go to User Page" onPress={() => {goToProduct(9)}} />
//     </View>
//   );
// }

// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//     justifyContent: 'center',
//     alignItems: 'center',
//     backgroundColor: 'lightblue',
//   },
// });


// import { Image } from 'expo-image';
// import {View, Text, Alert} from 'react-native';

// import { HelloWave } from '@/components/hello-wave';
// import ParallaxScrollView from '@/components/parallax-scroll-view';
// import { ThemedText } from '@/components/themed-text';
// import { ThemedView } from '@/components/themed-view';
// import { Link } from 'expo-router';
// import {Button} from '@/components/button';

// function handleMessage() {
//   console.log("Button pressed");
//   Alert.alert("Button pressed");
// }


// export default function Index() {
//   return (
//     <View > 
//       <Text>Teste</Text>
//       <Button title = "entrar" onPress={handleMessage}/>
      
//     </View>
//   );
// }



import { HabitoProgresso, HabitoConcluido } from '@/components/habito';
import React from 'react';
import { View, Text, Image, ScrollView, TouchableOpacity, StyleSheet, SafeAreaView, Button } from 'react-native';


export default function Perfil() {
  return (
    <SafeAreaView style={styles.container}>
      <ScrollView showsVerticalScrollIndicator={false}>
        {/* Perfil */}
        <View style={styles.profileSection}>
          <Image source={{ uri: 'https://aboutreact.com/wp-content/uploads/2018/07/react_native_imageview.png' }} style={styles.avatar} />
          <Text style={styles.name}>Maria Silva</Text>
          <View style={styles.statsRow}>
            <Text>🏆 #12</Text>
            <Text>🔥 7</Text>
            <Text>💧 1,240 pts</Text>
          </View>
        </View>

        {/* Hábitos em Progresso */}
        <Text style={styles.sectionTitle}>Hábitos em Progresso</Text>
        <HabitoProgresso idd={1} titulo="Beber 23333L de água" progresso={0.5} />
        <HabitoProgresso idd={2} titulo="Beber 4342432 de água" progresso={0.9} />
        <HabitoProgresso idd={3} titulo="Beber 4342432 de água" progresso={1} />

        {/* Hábitos Concluídos */}
        <HabitoConcluido titulo="teste1" tempoConcluido={34}/>
        <HabitoConcluido titulo="test2342341" tempoConcluido={2}/>

        {/* Botões */}
        <TouchableOpacity style={styles.button}>
          <Text>Criar Novo Desafio</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.button}>
          <Text>Adicionar Amigos</Text>
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
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

