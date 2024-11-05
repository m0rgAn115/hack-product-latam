import { View, Text, Image } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import React from "react";

const Header = () => {
  const user = { name: "Charly" };
  return (
    <View style={{ backgroundColor: "#fff", flex: 1 }}>
      <SafeAreaView />

      <View
        style={{
          flexDirection: "row",
          justifyContent: "space-between",
          alignItems: "center",
          paddingVertical: 30,
          paddingHorizontal: "3.5%",
        }}>
        <View style={{ flexDirection: "row", alignItems: "center" }}>
          <Image
            source={{ uri: "https://i.pravatar.cc/250?u=14" }}
            style={{ height: 50, width: 50, borderRadius: 50 }}
          />
          <View>
            <Text style={{ fontSize: 12, marginLeft: 10 }}>
              Hola, {user.name}
            </Text>
            <Text
              style={{ fontSize: 14, fontWeight: "semibold", marginLeft: 10 }}>
              Tu <Text style={{ fontWeight: 700 }}>Presupuesto</Text>
            </Text>
          </View>
        </View>
        <Text
          style={{
            fontSize: 14,
            fontWeight: "semibold",
            marginLeft: 10,
            borderColor: "#666",
            borderWidth: 1,
            padding: 8,
            borderRadius: 10,
          }}>
          Analisis
        </Text>
      </View>
    </View>
  );
};

export default Header;
