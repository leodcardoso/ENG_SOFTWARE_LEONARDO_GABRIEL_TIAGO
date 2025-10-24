import {View, Text, StyleSheet, Button} from 'react-native';
import {useRouter, useLocalSearchParams} from 'expo-router';

function CompletaHabito() {
    // precisoo alterar o botao indicando que ja foi completado
    // Lógica para completar o hábito
    // tem que alterar o banco de dados

}


export default function HomePage() {

    const {habitoId} = useLocalSearchParams<{habitoId: string}>();
    let tituloHabito:string = "";
    let descricaoHabito:string = "";
    let porcentagemHabito:number = 0;
    let habitoSequencia:number = 0;
    let habitoCompletos:number = 0; // completos nos ultimos 14 dias
    let taxaCompleto:number = 0;
    let cartasCoringas:number = 0;
    
    
  return (
    <View>
        <Text>{habitoId}</Text>
        <Text>{tituloHabito}</Text>
        <Text>{descricaoHabito}</Text>
        <Text>{porcentagemHabito}%</Text>
        <View style={styles.statsRow}>
            <Text>{habitoSequencia} Sequencia</Text>
            <Text>{habitoCompletos} ultimos 14 dias</Text>
            <Text>{taxaCompleto} taxaCompleto</Text>
        </View>
        <Text>{cartasCoringas} cartasCoringas</Text>
        <Button title="Completar Habito" onPress={() => {CompletaHabito}} />

    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'pink',
  },
  statsRow: { flexDirection: 'row', gap: 10, marginTop: 5 },

});
