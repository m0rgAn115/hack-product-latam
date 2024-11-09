import React from 'react';
import { TouchableOpacity, Text, StyleSheet, ViewStyle, TextStyle } from 'react-native';

interface CustomButtonProps {
  text: string;
  backgroundColor: string;
  onPress: () => void;
  textStyle?: TextStyle;
  buttonStyle?: ViewStyle;
}

const CustomButton: React.FC<CustomButtonProps> = ({ text, backgroundColor, onPress, textStyle, buttonStyle }) => {
  return (
    <TouchableOpacity
      style={[styles.button, { backgroundColor }, buttonStyle]}
      onPress={onPress}
    >
      <Text style={[styles.buttonText, textStyle]}>{text}</Text>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  button: {
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default CustomButton;