import { Ionicons } from "@expo/vector-icons";

export interface HabitoCategoria {
  id: string;
  title: string;
  iconName: keyof typeof Ionicons.glyphMap;
}

export const HABIT_CATEGORIES: HabitoCategoria[] = [
  { id: 'cat-leitura', title: 'Leitura', iconName: 'book-outline' },
  { id: 'cat-exercicio', title: 'Exercício', iconName: 'barbell-outline' },
  { id: 'cat-alimentacao', title: 'Alimentação', iconName: 'restaurant-outline' },
  { id: 'cat-hidratacao', title: 'Hidratação', iconName: 'water-outline' },
  { id: 'cat-meditacao', title: 'Meditação', iconName: 'prism-outline' },
  { id: 'cat-sono', title: 'Sono', iconName: 'moon-outline' },
  { id: 'cat-saude', title: 'Saúde', iconName: 'heart-outline' },
  { id: 'cat-musica', title: 'Música', iconName: 'musical-notes-outline' },
  { id: 'cat-criatividade', title: 'Criatividade', iconName: 'camera-outline' },
  { id: 'cat-entretenimento', title: 'Entretenimento', iconName: 'game-controller-outline' },
  { id: 'cat-trabalho', title: 'Trabalho', iconName: 'briefcase-outline' },
  { id: 'cat-outro', title: 'Outro', iconName: 'flag-outline' },
];
