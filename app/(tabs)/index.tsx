// import { Stack } from "expo-router";
import Header from "@/components/home/Header";
import Cards from "@/components/home/Cards";
import Balance from "@/components/home/Balance";
import Slides from "@/components/home/Slides";
import React from "react";
import { ScrollView } from "react-native";
import { useNavigation, NavigationProp } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";
import CategoryDetailScreen from "@/components/Expenses/CategoryDetailScreen";
import SubscriptionsCard from "@/components/Expenses/SubscriptionsCard";
import Expensess from "@/components/home/expensess";
import Analisis from "@/components/Summary/summary";

export default function HomeScreen() {
  async function getToken() {
    try {
      const sesion_token = await AsyncStorage.getItem("session_token");
      const refresh_token = await AsyncStorage.getItem("refresh_token");
      const token_type = await AsyncStorage.getItem("token_type");
      console.log(sesion_token, refresh_token, token_type);
    } catch (error) {
      console.error("Error al recuperar el token:", error);
    }
  }

  const handleRecuperarToken = () => {
    // getSessionToken().then(t => console.log('token:', t))
  };

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
    onPress: () => void;
  };

  const navigation = useNavigation<NavigationProp<RootStackParamList>>();

  const Stack = createStackNavigator<RootStackParamList>();

  return (
    <>
      <Stack.Navigator>
        <Stack.Screen
          name="Home"
          options={{ headerShown: false }}>
          {() => (
            <>
              <Header />
              <ScrollView>
                <Balance />
                <Cards />
                <Slides />
                <Expensess />
              </ScrollView>
            </>
          )}
        </Stack.Screen>

        <Stack.Screen
          name="CategoryDetail"
          component={CategoryDetailScreen}
          options={{ headerShown: false }}
        />

        <Stack.Screen
          name="subscriptions"
          component={SubscriptionsCard}
          options={{ headerShown: false }}
        />

        <Stack.Screen
          name="Summary"
          component={Analisis}
          options={{ headerShown: false }}
        />
      </Stack.Navigator>
    </>
  );
}
