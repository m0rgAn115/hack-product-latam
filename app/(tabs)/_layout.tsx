import { Stack, Tabs } from "expo-router";
// import { StatusBar } from "expo-status-bar";
import React from "react";
import {
  SafeAreaView,
  StyleSheet,
  View,
  Platform,
  StatusBar,
} from "react-native";

import { TabBarIcon } from "@/components/navigation/TabBarIcon";
import { Colors } from "@/constants/Colors";
import { useColorScheme } from "@/hooks/useColorScheme";

const CustomSafeArea = ({ children, style }) => {
  return (
    <SafeAreaView style={[styles.safeArea, style]}>{children}</SafeAreaView>
  );
};

export default function TabLayout() {
  const colorScheme = useColorScheme();

  return (
    <CustomSafeArea style={styles.safeArea}>
      {/* <StatusBar style="dark" /> */}
      <Tabs
        screenOptions={{
          tabBarActiveTintColor: Colors["light"].tint,
          tabBarStyle: {
            backgroundColor: "#fff",
            borderTopColor: "#fff",
          },
          headerShown: false,
        }}>
        <Tabs.Screen
          name="index"
          options={{
            title: "Home",
            tabBarIcon: ({ color, focused }) => (
              <TabBarIcon
                name={focused ? "home" : "home-outline"}
                color={color}
              />
            ),
          }}
        />
        <Tabs.Screen
          name="transactions"
          options={{
            title: "Expenses",
            tabBarIcon: ({ color, focused }) => (
              <TabBarIcon
                name={focused ? "calendar" : "calendar-outline"}
                color={color}
              />
            ),
          }}
        />

        <Tabs.Screen
          name="chat"
          options={{
            title: "Chat",
            tabBarIcon: ({ color, focused }) => (
              <TabBarIcon
                name={focused ? "chatbox" : "chatbox-outline"}
                color={color}
              />
            ),
          }}
        />

        <Tabs.Screen
          name="goals"
          options={{
            title: "Goals",
            tabBarIcon: ({ color, focused }) => (
              <TabBarIcon
                name={focused ? "trophy" : "trophy-outline"}
                color={color}
              />
            ),
          }}
        />
      </Tabs>
    </CustomSafeArea>
  );
}

const styles = StyleSheet.create({
  // safeArea: {
  //   flex: 1,
  //   backgroundColor: "#fff",
  // },
  safeArea: {
    flex: 1,
    backgroundColor: "white", // Customize your background color
    // Only add paddingTop on Android to handle status bar
    ...Platform.select({
      android: {
        paddingTop: StatusBar.currentHeight,
      },
    }),
  },
});
