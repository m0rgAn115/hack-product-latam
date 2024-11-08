import { View, Text, Image, TouchableOpacity } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import React from "react";
import { useNavigation, NavigationProp } from "@react-navigation/native";
import { RouteProp } from "@react-navigation/native";

const Header = () => {
  const user = { name: "Charly" };

  type RootStackParamList = {
    Home: undefined;
    Summary: undefined;
    CategoryDetail: {
      category: string;
      transactions: Array<{
        name: string;
        amount: number;
        date: string;
        logo_url?: string;
        merchant_name?: string;
      }>;
    };
    subscriptions: undefined;
  };
  type CategoryDetailScreenRouteProp = RouteProp<RootStackParamList, "Summary">;

  const navigation = useNavigation<NavigationProp<RootStackParamList>>();

  return (
    <View style={{ backgroundColor: "#fff" }}>
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
        <TouchableOpacity onPress={() => navigation.navigate("Summary")}>
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
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default Header;
