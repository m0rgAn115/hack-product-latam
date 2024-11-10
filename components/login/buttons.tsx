import AntDesign from '@expo/vector-icons/AntDesign';
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
      <AntDesign name="arrowright" size={24} color="white" />
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
    flexDirection: 'row',
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
    marginRight: 10,
  },
});

export default CustomButton;