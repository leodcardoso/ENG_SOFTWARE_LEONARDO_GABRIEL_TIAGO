import { TouchableOpacity, Text, ViewProps, View, Button} from "react-native" 
import {styles} from "./habitos";
import { Circle } from "react-native-progress";
import {router} from 'expo-router';
import { Ionicons } from '@expo/vector-icons';


type Props = ViewProps & {
    idd:string;
    titulo: string;
    progresso: number;
    iconName?: string;
}

type Props2 = ViewProps & {
    titulo: string;
    tempoConcluido: number // espera a quantidade de horas que o hábito foi concluído
}

function horasTexto(tempoConcluido: number){
    let dias: number = Math.round(tempoConcluido / 24);
    let horas = tempoConcluido % 24;

    if (dias > 0){
        return `Concluido a ${dias} dias e ${horas} horas   `
    }else{
        return `Concluido a ${horas} horas `
    }
}

function AbreHabito(idd: string){
    // navegar para a pagina do habito
    // usar o idd para pegar os dados do habito
    // router.push(`/habito/${idd}`);
    console.log(idd);
}



export function HabitoProgresso({idd, titulo, progresso, iconName, ... rest}: Props) {
    // preciso pegar o titulo e o progresso usando o idd no back
    titulo = idd + " - " + titulo;

    if (progresso == 1){
        return (
            <View style={styles.habitCard}>
                <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}>
                  <Ionicons name={iconName || (rest as any).iconName || 'book-outline'} size={24} color="#333" />
                  <Text>{titulo}</Text>
                </View>
                <Circle progress={progresso} showsText size={70} formatText={progress => `${Math.round(progresso)}%`} />
                <Button title="Concluir Habito" onPress={() => {}} />
                
            </View>
        );
    }else{
        return (
            <View style={styles.habitCard}>
                <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}>
                  <Ionicons name={iconName || (rest as any).iconName || 'book-outline'} size={24} color="#333" />
                  <Text>{titulo}</Text>
                </View>
                <Circle progress={progresso} showsText size={70} formatText={progress => `${Math.round(progresso)}%`} />
            
            </View>
        );
    }
  

};


export function HabitoConcluido({titulo, tempoConcluido, ... rest}: Props2) {
  return (
    <View style={styles.habitCard}>
        <Text>{titulo}</Text>
        <Text>{horasTexto(tempoConcluido)}</Text>
        <Text>✔️</Text>
    </View>
  );
}