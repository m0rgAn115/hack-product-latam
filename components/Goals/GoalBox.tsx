import {
  Pressable,
  StyleSheet,
  Text,
  View,
  StyleProp,
  ViewStyle,
} from "react-native";
import React from "react";

import { LinearGradient } from "expo-linear-gradient";
import { parseISO, format, differenceInDays } from "date-fns";
import { Ionicons } from "@expo/vector-icons";

import { Goal } from "@/components/Interfaces/goal";

interface Component_Props {
  goal: Goal;
  onPress: (goal: Goal) => void;
  ContainerStyles?: StyleProp<ViewStyle>;
}

export const GoalBox = ({
  goal,
  onPress,
  ContainerStyles,
}: Component_Props) => {
  const { goal_amount, title, actual_amount, deadline, description } = goal;

  const formattedDeadline = format(parseISO(deadline), "d MMMM yyyy");
  const daysRemaining = differenceInDays(parseISO(deadline), new Date());

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "MXN",
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }).format(amount);
  };

  const gradientColors =
    daysRemaining >= 0 ? ["#F6ECFF", "#08fc31"] : ["#FFA050", "#FFA07A"];

  return (
    <Pressable
      onPress={() => onPress(goal)}
      style={({ pressed }) => [
        ContainerStyles,
        { opacity: pressed ? 0.7 : 1 },
      ]}>
      <View style={[styles.gradient, { borderColor: "#e8e8e8" }]}>
        <View style={styles.gradientSubContainer}>
          <View style={styles.info}>
            <Text style={styles.title}>{title}</Text>
            <Text style={styles.description}>{description}</Text>
            <Text style={styles.daysRemaining}>
              {daysRemaining >= 0
                ? `Reamining ${daysRemaining} days`
                : `Deadline passed by ${Math.abs(daysRemaining)} days`}
            </Text>
            <Text
              style={[
                styles.deadline,
                daysRemaining < 0 && {
                  backgroundColor: "#rgba(255,0,0,0.6)",
                  color: "#fff",
                },
              ]}>
              {daysRemaining >= 0 ? (
                <>Deadline: {formattedDeadline}</>
              ) : (
                <> {formattedDeadline} </>
              )}
            </Text>
          </View>
          <View>
            <Pressable>
              <View
                style={{
                  width: 45,
                  height: 45,
                  alignItems: "center",
                  backgroundColor: "#20B2AA",
                  justifyContent: "center",
                  borderRadius: 100,
                }}>
                <Ionicons
                  name="aperture-outline"
                  size={35}
                  color="white"
                />
              </View>
            </Pressable>
          </View>
        </View>
      </View>

      <View style={styles.containerAmount}>
        <Text style={styles.amountLabel}>Amount:</Text>
        <View style={styles.amount}>
          <Text style={styles.amountText}>{formatCurrency(actual_amount)}</Text>
          <Text style={styles.amountText}>
            {" "}
            / {formatCurrency(goal_amount)}
          </Text>
        </View>
      </View>
    </Pressable>
  );
};

export default GoalBox;

const styles = StyleSheet.create({
  gradient: {
    padding: 15,
    borderRadius: 10,
    borderBottomRightRadius: 0,
    borderBottomLeftRadius: 0,
    borderWidth: 1,
  },
  gradientSubContainer: {
    flexDirection: "row",
  },
  info: {
    flex: 1,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#000",
  },
  description: {
    marginTop: 8,
    fontSize: 12,
    fontWeight: "300",
    color: "#000",
  },
  deadline: {
    marginTop: 8,
    fontSize: 15,
    color: "#454545",
    backgroundColor: "rgba(0, 255, 0,0.2)",
    paddingHorizontal: 10,
    paddingVertical: 5,
    alignSelf: "flex-start",
    borderRadius: 15,
    fontWeight: "600",
    overflow: "hidden",
  },
  daysRemaining: {
    marginTop: 8,
    fontSize: 12,
    color: "#000",
  },
  containerAmount: {
    padding: 15,
    backgroundColor: "#F6F6F6",
    borderBottomRightRadius: 10,
    borderBottomLeftRadius: 10,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  amountLabel: {
    fontSize: 16,
    fontWeight: "500",
    color: "#000",
  },
  amount: {
    flexDirection: "row",
    alignItems: "center",
  },
  amountText: {
    fontSize: 16,
    color: "#000",
    fontWeight: "bold",
  },
});
