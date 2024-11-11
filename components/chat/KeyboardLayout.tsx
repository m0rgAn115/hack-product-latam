import React from 'react';
import { View, Platform, KeyboardAvoidingView } from 'react-native';

interface LayoutProps {
  children: React.ReactNode; // Acepta cualquier cosa como hijo (texto, componentes, vistas, etc.)
}

const KeyboardLayout: React.FC<LayoutProps> = ({ children }) => {
  return Platform.OS === "ios" ? (
    <KeyboardAvoidingView 
      behavior="padding"
      style={{ flex: 1 }}
      keyboardVerticalOffset={90}
    >
      {children}
    </KeyboardAvoidingView>
  ) : (
    <View
      style={{
        paddingHorizontal: "5%",
        paddingTop: "5%",
        backgroundColor: "white",
        flex: 1,
      }}
    >
      {children}
    </View>
  );
};

export default KeyboardLayout;