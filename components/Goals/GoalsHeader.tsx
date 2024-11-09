import React from 'react';
import { View, Text, Pressable, ScrollView, StyleSheet, ViewStyle } from 'react-native';
import RecomendationButton from '@/components/Goals/RecomendationButton';

interface GoalsHeaderProps {
  onPressNewGoal: () => void;
  handlePress: (title: string) => void;
}

export const GoalsHeader: React.FC<GoalsHeaderProps> = ({ 
  onPressNewGoal, 
  handlePress, 
}) => {
  return (
    <View style={styles.container}>
      <View style={styles.containerTitle}>
        <Text style={styles.titleContainer}>Your</Text>
        <Text style={styles.titleContainerBold}>Goals</Text>
      </View>
      
      <View>
        <Pressable
          style={({ pressed }) => [
            styles.pressable,
            { backgroundColor: pressed ? '#d9d9d9' : '#000' },
          ]}
          onPress={onPressNewGoal}
        >
          <Text style={styles.pressable_text}>New Goal +</Text>
        </Pressable>
      </View>

    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  containerTitle:{
    flex: 1,
  },
  titleContainer: {
    fontSize: 18,
  },
  titleContainerBold: {
    fontSize: 32,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  pressable: {
    padding: 10,
    paddingHorizontal: 20,
    borderRadius: 15,
    alignItems: 'center',
  },
  pressable_text: {
    fontSize: 16,
    color: 'white',
  },
});

export default GoalsHeader;
