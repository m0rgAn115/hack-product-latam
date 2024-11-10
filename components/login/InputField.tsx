import React from 'react';
import { Text, TextInput, StyleSheet, View, TextInputProps, KeyboardTypeOptions } from 'react-native';

interface InputFieldProps extends TextInputProps {
  label: string;
  value: string;
  onChangeText: (text: string) => void;
  keyboardType?: KeyboardTypeOptions;
}

const InputField: React.FC<InputFieldProps> = ({ label, value, onChangeText, keyboardType, secureTextEntry, ...props }) => (
  <View>
    <Text style={styles.caption}>{label}</Text>
    <TextInput
      value={value}
      onChangeText={onChangeText}
      style={styles.input}
      keyboardType={keyboardType}
      secureTextEntry={secureTextEntry}
      {...props}
    />
  </View>
);

const styles = StyleSheet.create({
  caption: {
    marginBottom: 5,
    fontSize: 15,
  },
  input: {
    backgroundColor: '#F0F0F0',
    marginBottom: 14,
    borderRadius: 8,
    padding: 10,
    paddingHorizontal: 15,
  },
});

export default InputField;