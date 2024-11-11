import { Tabs } from "expo-router";
import React from "react";
import {
  SafeAreaView,
  StyleSheet,
  Platform,
  StatusBar,
} from "react-native";

import { TabBarIcon } from "@/components/navigation/TabBarIcon";

const CustomSafeArea = ({ children, style }) => {
  return (
    <SafeAreaView style={[styles.safeArea, style]}>{children}</SafeAreaView>
  );
};

export default function TabLayout() {

  return (
    <CustomSafeArea style={styles.safeArea}>
      {/* <StatusBar style="dark" /> */}
      <Tabs
        screenOptions={{
          tabBarStyle: {
            backgroundColor: "#fff",
            marginBottom: 5,
            borderTopWidth: 0, 
            elevation: 0, 
            shadowOpacity: 0, 
          },
          tabBarLabelStyle: {
            color: "#000",
          },
          headerShown: false,
        }}>
        <Tabs.Screen
          name="index"
          options={{
            title: "Home",
            tabBarIcon: ({ color, focused }) => (
              <TabBarIcon
                name={"home-outline"}
                color={focused  ? "#000" : color }
              />
            ),
          }}
        />
        <Tabs.Screen
          name="transactions"
          options={{
            tabBarIcon: ({ color, focused }) => (
              <TabBarIcon
                name={"wallet-outline"}
                color={focused  ? "#000" : color }
              />
            ),
          }}
        />

        <Tabs.Screen
          name="chat"
          options={{
            title: "Chat",
            tabBarStyle: { display: "none" },
            tabBarIcon: ({ color, focused }) => (
              <TabBarIcon
                name={"chatbubbles-outline"}
                color={focused  ? "#000" : color }
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
                name={"trending-up-outline"}
                color={focused  ? "#000" : color }
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
