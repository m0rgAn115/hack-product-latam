import React, { useState } from 'react';
import { View, Text, TouchableOpacity, Animated, StyleSheet } from 'react-native';

interface ComponentProps {
  isMoneyOptimized: boolean;
  setIsMoneyOptimized: (val:boolean) => void;
}

const ToggleSwitch = ({isMoneyOptimized, setIsMoneyOptimized}:ComponentProps) => {
  const switchAnim = new Animated.Value(isMoneyOptimized ? 0 : 1);

  // Manejar la alternancia entre "Optimizar Dinero" y "Optimizar Tiempo"
  const toggleSwitch = () => {
    setIsMoneyOptimized(!isMoneyOptimized);
    Animated.timing(switchAnim, {
      toValue: isMoneyOptimized ? 1 : 0,
      duration: 300,
      useNativeDriver: false,
    }).start();
  };

  const bgColor = switchAnim.interpolate({
    inputRange: [0, 1],
    outputRange: ['#4caf50', '#2196f3'], // Colores de fondo para "Dinero" y "Tiempo"
  });

  const positionAnim = switchAnim.interpolate({
    inputRange: [0, 1],
    outputRange: ['0%', '50%'], // Ajustado para moverse correctamente
  });

  return (
    <View style={styles.container}>
      <Animated.View style={[styles.switchBackground, { backgroundColor: bgColor }]} />
      <Animated.View style={[
        styles.optionHighlight, 
        { 
          left: positionAnim,
          width: '50%' // Ajustado para ocupar la mitad del contenedor
        }
      ]} />
      <TouchableOpacity 
        style={styles.optionContainer} 
        onPress={toggleSwitch}
      >
        <Text style={[
          styles.optionText, 
          isMoneyOptimized && styles.activeOption
        ]}>
          Optimizar Dinero
        </Text>
        <Text style={[
          styles.optionText, 
          !isMoneyOptimized && styles.activeOption
        ]}>
          Optimizar Tiempo
        </Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    width: '90%',
    height: 30,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderRadius: 15,
    backgroundColor: '#e0e0e0',
    overflow: 'hidden',
    marginVertical: 10,
    alignSelf: 'center',
  },
  switchBackground: {
    ...StyleSheet.absoluteFillObject,
    borderRadius: 25,
  },
  optionContainer: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    zIndex: 10,
  },
  optionText: {
    fontSize: 14,
    fontWeight: '500',
    color: '#666',
    zIndex: 11,
  },
  activeOption: {
    color: '#ffffff',
    fontWeight: '700',
  },
  optionHighlight: {
    position: 'absolute',
    height: '100%',
    backgroundColor: '#ffffff30',
    borderRadius: 25,
  },
});

export default ToggleSwitch;