
import { TouchableOpacity, Text, ViewProps, View} from "react-native" 
import {styles} from "./styles";
import { Circle } from "react-native-progress";



type Props = ViewProps & {
    titulo: string;
    progresso: number;
}


export function HabitoProgresso({titulo, progresso, ... rest}: Props) {
  return (
    <View style={styles.habitCard}>
        <Text>{titulo}</Text>
        <Circle progress={progresso} showsText size={70} formatText={progress => `a${Math.round(progresso * 100)}%`} />
    </View>
  );

};
