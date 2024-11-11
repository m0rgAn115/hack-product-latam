import { View, Text, Image, TouchableOpacity } from "react-native";
import React from "react";
import { useUserStore } from "@/store/useUserStore";
import { useNavigation, NavigationProp } from "@react-navigation/native";
import { RouteProp } from "@react-navigation/native";

const Header = () => {
  const { nombre } = useUserStore();

  type RootStackParamList = {
    Home: undefined;
    Summary: undefined;
    Profile: undefined;
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
      <View
        style={{
          flexDirection: "row",
          justifyContent: "space-between",
          alignItems: "center",
          // paddingVertical: 30,
          paddingHorizontal: "3.5%",
        }}>
        <View style={{ flexDirection: "row", alignItems: "center" }}>
          <TouchableOpacity onPress={() => navigation.navigate("Profile")}>
            <Image
              source={{
                uri: `https://ui-avatars.com/api/?name=${nombre}&background=0D8ABC&color=fff`,
              }}
              style={{ height: 35, width: 35, borderRadius: 50 }}
            />
          </TouchableOpacity>
          <View>
            <Text style={{ fontSize: 12, marginLeft: 10, color: "black" }}>
              Hi, {nombre}
            </Text>
            <Text
              style={{ fontSize: 14, fontWeight: "semibold", marginLeft: 10 }}>
              Your <Text style={{ fontWeight: 700 }}>budget</Text>
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
            Analysis
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default Header;
