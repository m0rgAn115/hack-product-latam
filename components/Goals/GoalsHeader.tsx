import React from 'react';
import { View, Text, Pressable, ScrollView, StyleSheet, ViewStyle } from 'react-native';
import RecomendationButton from '@/components/Goals/RecomendationButton';

// Definición de la interfaz para las props del componente
interface GoalsHeaderProps {
  title: string;
  recommendations: string[];
  onPressNewGoal: () => void;
  handlePress: (title: string) => void;
  style?: ViewStyle;
}

export const GoalsHeader: React.FC<GoalsHeaderProps> = ({ 
  title, 
  recommendations, 
  onPressNewGoal, 
  handlePress, 
  style 
}) => {
  return (
    <View style={[styles.container, style]}>
      <Text style={styles.titleContainer}>{title}</Text>
      <Pressable
        style={({ pressed }) => [
          styles.pressable,
          { backgroundColor: pressed ? '#d9d9d9' : '#efefef' },
        ]}
        onPress={onPressNewGoal}
      >
        <Text style={styles.pressable_text}>New Goal +</Text>
      </Pressable>

      <ScrollView style={{ flexDirection: 'row', marginVertical: 10 }} horizontal>
        {recommendations.map((rec, index) => (
          <RecomendationButton key={index} titulo={rec} onPress={() => handlePress(rec)} />
        ))}
      </ScrollView>
    </View>
  );
};

// Estilos para el componente
const styles = StyleSheet.create({
  container: {
    padding: 10,
  },
  titleContainer: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  pressable: {
    padding: 10,
    borderRadius: 5,
    alignItems: 'center',
  },
  pressable_text: {
    fontSize: 16,
  },
});

export default GoalsHeader;
