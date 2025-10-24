
import { TouchableOpacity, Text, ViewProps, View, Button} from "react-native" 
import {styles} from "./styles";
import { Circle } from "react-native-progress";



type Props = ViewProps & {
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


export function HabitoProgresso({titulo, progresso, ... rest}: Props) {
    if (progresso == 1){
        return (
            <View style={styles.habitCard}>
                <Text>{titulo}</Text>
                <Circle progress={progresso} showsText size={70} formatText={progress => `a${Math.round(progresso * 100)}%`} />
                <Button title="Concluir Habito" onPress={() => {}} />
                
            </View>
        );
    }else{
        return (
            <View style={styles.habitCard}>
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
