import React from "react";
import { View, Text, Pressable, StyleSheet } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";

interface HeaderProps {
  title: string;
  onPress?: () => void;
}

const Header: React.FC<HeaderProps> = ({ title, onPress }) => {
  const router = useRouter();

  // Función para regresar
  const handleBack = () => {
    router.back();
  };

  const handlePress = onPress || handleBack;

  return (
    <View style={styles.header}>
      <Pressable
        onPress={onPress}
        style={styles.backButton}>
        <Ionicons
          name="chevron-back-outline"
          size={30}
          color="black"
        />
      </Pressable>
      <Text style={styles.title}>{title}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    position: "relative",
    height: 40,
    marginBottom: 20,
  },
  backButton: {
    position: "absolute",
    left: 5,
    padding: 10,
    zIndex: 10,
  },
  title: {
    fontSize: 24,
    fontWeight: "500",
    color: "black",
  },
});

export default Header;
