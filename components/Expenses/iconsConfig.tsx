import { Ionicons } from "@expo/vector-icons";
import { View, StyleSheet } from "react-native";

const iconStyles = StyleSheet.create({
  iconContainer: {
    padding: 8,
    borderRadius: 8,
    marginRight: 16,
  },
  cofee: {
    marginRight: 8,
    alignSelf: 'center',
  }
});


const backgroundOpacity = "20";

export const iconColors = {
  coffee: "#FF7A61", 
  transport: "#A761FF",
  food: "#FF616A",
  housing: "#FF61A6",
  health: "#61FFA7",
  education: "#FFD261",
  entertainment: "#61A7FF",
  shopping: "#FFA761",
  debts: "#FF616A",
  other: "#61C1FF"        
};

export const Icons = {
    coffee: {
      iconName: <Ionicons name={'cafe'} size={20} style={iconStyles.cofee} />,
    },
    transport: {
      iconName: (
        <View style={[iconStyles.iconContainer, { backgroundColor: iconColors.transport + backgroundOpacity }]}>
          <Ionicons name="bus" size={24} color={iconColors.transport} />
        </View>
      ),
    },
    food: {
      iconName: (
        <View style={[iconStyles.iconContainer, { backgroundColor: iconColors.food + backgroundOpacity }]}>
          <Ionicons name="fast-food" size={24} color={iconColors.food} />
        </View>
      ),
    },
    housing: {
      iconName: (
        <View style={[iconStyles.iconContainer, { backgroundColor: iconColors.housing + backgroundOpacity }]}>
          <Ionicons name="home" size={24} color={iconColors.housing} />
        </View>
      ),
    },
    health: {
      iconName: (
        <View style={[iconStyles.iconContainer, { backgroundColor: iconColors.health + backgroundOpacity }]}>
          <Ionicons name="heart" size={24} color={iconColors.health} />
        </View>
      ),
    },
    education: {
      iconName: (
        <View style={[iconStyles.iconContainer, { backgroundColor: iconColors.education + backgroundOpacity }]}>
          <Ionicons name="school" size={24} color={iconColors.education} />
        </View>
      ),
    },
    entertainment: {
      iconName: (
        <View style={[iconStyles.iconContainer, { backgroundColor: iconColors.entertainment + backgroundOpacity }]}>
          <Ionicons name="tv" size={24} color={iconColors.entertainment} />
        </View>
      ),
    },
    shopping: {
      iconName: (
        <View style={[iconStyles.iconContainer, { backgroundColor: iconColors.shopping + backgroundOpacity }]}>
          <Ionicons name="cart" size={24} color={iconColors.shopping} />
        </View>
      ),
    },
    debts: {
      iconName: (
        <View style={[iconStyles.iconContainer, { backgroundColor: iconColors.debts + backgroundOpacity }]}>
          <Ionicons name="cash" size={24} color={iconColors.debts} />
        </View>
      ),
    },
    other: {
      iconName: (
        <View style={[iconStyles.iconContainer, { backgroundColor: iconColors.other + backgroundOpacity }]}>
          <Ionicons name="apps" size={24} color={iconColors.other} />
        </View>
      ),
    },
};