import { Pressable, StyleSheet, Text, View } from 'react-native';
import React, { useState } from 'react';
import { opacity } from 'react-native-reanimated/lib/typescript/reanimated2/Colors';
import { Goal } from '@/app/(tabs)/goals';

interface Component_Props {
  goal:Goal
  onPress: (goal:Goal) => void;
  ContainerStyles?: {},
}

export const GoalBox = ({ goal,onPress,ContainerStyles }: Component_Props) => {

  const { actual_amount, actual_months, title, total_amount, total_months } = goal
  const [completedState, setcompletedState] = useState(actual_amount / total_amount === 1);
  
  // Calcular el porcentaje completado
  const progressPercentage = (actual_amount / total_amount) * 100;

  return (
    <Pressable 

      onPress={() => onPress(goal)}

    style={({ pressed }) => [
      styles.container, ContainerStyles,
      { opacity: pressed ? 0.7 : 1},
    ]}
      >
      <View style={{ flex: 5, padding: 5, justifyContent: 'space-around' }}>
        <Text style={styles.title}>{title}</Text>
        <Text style={styles.text}>{'$' + actual_amount + ' / ' + '$' + total_amount}</Text>
        <Text style={styles.text}>
          {completedState ? 'Completed!' : actual_months + (actual_amount > 1 ? ' months remaining' : ' month remaining')}
        </Text>
        <Text style={[styles.text, { fontWeight: '700' }]}>
          {progressPercentage.toFixed(2) + '%'}
        </Text>

        {/* Barra de progreso */}
        <View style={styles.progressBarContainer}>
          <View
            style={[
              styles.progressBar,
              { width: `${progressPercentage}%` },
            ]}
          />
        </View>
      </View>
      <View style={{ flex: 2, backgroundColor: '#ffffff', borderRadius: 10 }}>
        {/* Contenido del lado derecho */}
      </View>
    </Pressable>
  );
};

export default GoalBox;

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#e4e4e4',
    borderRadius: 10,
    height: 130,
    flexDirection: 'row',
    borderWidth: 2,
    borderColor: '#a2a2a2',
  },
  title: {
    fontSize: 22,
    color: 'black',
    textAlign: 'center',
    fontWeight: '500',
  },
  text: {
    fontSize: 20,
    color: 'black',
    textAlign: 'center',
  },
  progressBarContainer: {
    height: 10, // Ajusta la altura de la barra de progreso
    borderRadius: 5,
    backgroundColor: '#e4e4e4', // Color del fondo de la barra
    overflow: 'hidden', // Para que el progreso se vea redondeado
    marginTop: 10, // Espaciado superior
    marginHorizontal: 20,
     borderWidth: 1,
    borderColor: 'black'
  },
  progressBar: {
    height: '100%', // Ocupa toda la altura del contenedor
    backgroundColor: '#30027f', // Color de la barra de progreso
   
  },
});
