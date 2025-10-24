import { TouchableOpacity, Text, ViewProps, View, Button} from "react-native" 
import {styles} from "./habitos";
import { Circle } from "react-native-progress";
import {router} from 'expo-router';


type Props = ViewProps & {
    idd:number;
    titulo: string;
    progresso: number;
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

function AbreHabito(idd: number){
    // navegar para a pagina do habito
    // usar o idd para pegar os dados do habito
    router.push(`/habito/${idd}`);
}



export function HabitoProgresso({idd, titulo, progresso, ... rest}: Props) {
    // preciso pegar o titulo e o progresso usando o idd no back
    titulo = idd + " - " + titulo;

    if (progresso == 1){
        return (
            <View style={styles.habitCard}>
                <Button title="Visualizar Habito" onPress={() => {AbreHabito(idd)}}/>
                <Text>{titulo}</Text>
                <Circle progress={progresso} showsText size={70} formatText={progress => `a${Math.round(progresso * 100)}%`} />
                <Button title="Concluir Habito" onPress={() => {}} />
                
            </View>
        );
    }else{
        return (
            <View style={styles.habitCard}>
                <Button title="Visualizar Habito" onPress={() => {AbreHabito(idd)}}/>
                <Text>{titulo}</Text>
                <Circle progress={progresso} showsText size={70} formatText={progress => `a${Math.round(progresso * 100)}%`} />
            
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