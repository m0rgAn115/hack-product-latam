// import { Stack } from "expo-router";
import React from "react";
import Header from "@/components/home/Header";
import Cards from "@/components/home/Cards";
import Balance from "@/components/home/Balance";
import Slides from "@/components/home/Slides";
import { ScrollView, View } from "react-native";
import { createStackNavigator } from "@react-navigation/stack";
import CategoryDetailScreen from "@/components/Expenses/CategoryDetailScreen";
import SubscriptionsCard from "@/components/Expenses/SubscriptionsCard";
import Analisis from "@/components/Summary/summary";
import ProfileScreen from "@/components/profile/ProfileScreen";
import { router } from "expo-router";

export default function HomeScreen() {

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
    onPress: () => void;
  };

  const Stack = createStackNavigator<RootStackParamList>();

  return (
    <>
      <Stack.Navigator>
        <Stack.Screen
          name="Home"
          options={{ headerShown: false }}>
          {() => (
            <>
              <View style={{ backgroundColor: "#fff", 
                              flex: 1, 
                              paddingVertical: "5%"
                }}>
                <Header />
                {/* <ScrollView> */}
                <Balance />
                <Cards />
                <Slides />
                {/* </ScrollView> */}
              </View>
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

        <Stack.Screen
          name="Profile"
          component={ProfileScreen}
          options={{ headerShown: false }}
        />
      </Stack.Navigator>
    </>
  );
}
