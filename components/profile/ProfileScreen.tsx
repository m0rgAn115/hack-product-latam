import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  Image,
  TouchableOpacity,
  Platform,
  SafeAreaView,
  Pressable,
} from "react-native";
import * as ImagePicker from "expo-image-picker";
import { useUserStore } from "@/store/useUserStore";
import { useRouter } from "expo-router";
import Header from "../Header";

const ProfileScreen = () => {
  const { nombre, correo } = useUserStore();
  const [profileImage, setProfileImage] = useState(
    `https://ui-avatars.com/api/?name=${nombre}&background=0D8ABC&color=fff`
  );

  const router = useRouter();

  // Función para regresar
  const handleBack = () => {
    router.back();
  };

  const [userData] = useState({
    name: `${nombre}`,
    email: `${correo}`,
    joinDate: "11/11/2024",
  });

  const handleImagePick = async () => {
    // Solicitar permisos (solo para iOS)
    if (Platform.OS !== "web") {
      const { status } =
        await ImagePicker.requestMediaLibraryPermissionsAsync();
      if (status !== "granted") {
        alert("Se necesitan permisos para acceder a la galería");
        return;
      }
    }

    // Abrir selector de imágenes
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [1, 1],
      quality: 1,
    });

    if (!result.canceled) {
      setProfileImage(result.assets[0].uri);
    }
  };

  const handleLogout = () => {
    // Implementar lógica de cierre de sesión aquí
    console.log("Cerrando sesión...");
  };

  return (
    <SafeAreaView style={styles.container}>
      {/* <View style={styles.header}>
        <Pressable
          onPress={handleBack}
          style={styles.backButton}>
          <Ionicons
            name="chevron-back-outline"
            size={30}
            color="black"
          />
        </Pressable>

        <Text style={styles.title}>Profile</Text>
      </View> */}
      <Header title="Profile" />

      <View style={styles.profileSection}>
        <TouchableOpacity
          onPress={handleImagePick}
          style={styles.imageContainer}>
          <Image
            source={{ uri: profileImage }}
            style={styles.profileImage}
          />
          <View style={styles.editIconContainer}>
            <Text style={styles.editIcon}>✏️</Text>
          </View>
        </TouchableOpacity>

        <View style={styles.userInfo}>
          <View style={styles.infoRow}>
            <Text style={styles.label}>Name</Text>
            <Text style={styles.value}>{userData.name}</Text>
          </View>

          <View style={styles.infoRow}>
            <Text style={styles.label}>Email</Text>
            <Text style={styles.value}>{userData.email}</Text>
          </View>

          <View style={styles.infoRow}>
            <Text style={styles.label}>Register Date</Text>
            <Text style={styles.value}>{userData.joinDate}</Text>
          </View>
        </View>

        <TouchableOpacity
          style={styles.logoutButton}
          onPress={handleLogout}>
          <Text style={styles.logoutText}>Cerrar Sesión</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#FFFFFF",
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    position: "relative",
    height: 40,
    marginBottom: 20,
    paddingHorizontal: 40,
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
  profileSection: {
    alignItems: "center",
    padding: 20,
  },
  imageContainer: {
    position: "relative",
    marginBottom: 30,
  },
  profileImage: {
    width: 150,
    height: 150,
    borderRadius: 75,
  },
  editIconContainer: {
    position: "absolute",
    bottom: 0,
    right: 0,
    backgroundColor: "#000000",
    borderRadius: 20,
    width: 40,
    height: 40,
    justifyContent: "center",
    alignItems: "center",
  },
  editIcon: {
    fontSize: 20,
  },
  userInfo: {
    width: "100%",
    marginBottom: 30,
  },
  infoRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingVertical: 15,
    borderBottomWidth: 1,
    borderBottomColor: "#E5E5E5",
  },
  label: {
    fontSize: 16,
    color: "#666666",
  },
  value: {
    fontSize: 16,
    color: "#000000",
  },
  logoutButton: {
    backgroundColor: "#000000",
    paddingVertical: 15,
    paddingHorizontal: 40,
    borderRadius: 25,
    marginTop: 20,
  },
  logoutText: {
    color: "#FFFFFF",
    fontSize: 16,
    fontWeight: "bold",
  },
});

export default ProfileScreen;
