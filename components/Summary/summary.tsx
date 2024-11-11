import React from "react";
import { View, StyleSheet, Text, Dimensions } from "react-native";

import ParameterList from "@/components/Summary/ParameterList";
import ArcComponent from "@/components/Summary/ArcComponent";
import Caption from "@/components/Summary/Caption";

import { getNewMetricsData } from "@/components/Summary/utils";

import {
  useFonts,
  DMSans_400Regular,
  DMSans_400Regular_Italic,
  DMSans_500Medium,
  DMSans_500Medium_Italic,
  DMSans_700Bold,
  DMSans_700Bold_Italic,
} from "@expo-google-fonts/dm-sans";
import Header from "../Header";

export default function Analysis() {
  const { width } = Dimensions.get("window");
  const radius = width * 0.38;

  // Constant colors
  const COLOR_PRIMARY = "#856FE5";
  const COLOR_EMPTY = "#E3E3E5";

  //---------------------Fonts---------------------
  const [fontsLoaded] = useFonts({
    DMSans_400Regular,
    DMSans_400Regular_Italic,
    DMSans_500Medium,
    DMSans_500Medium_Italic,
    DMSans_700Bold,
    DMSans_700Bold_Italic,
  });

  if (!fontsLoaded) {
    return <Text style={styles.loadingText}>Loading...</Text>;
  }

  //---------------------Data---------------------
  const data = getNewMetricsData();

  //-----------------Calculate the final score
  function calculateFinalScoreScaledTo1000(
    incomeExpenseScore: any,
    savingsScore: any,
    consistencyScore: any
  ) {
    const incomeExpenseWeight = 0.4;
    const savingsWeight = 0.3;
    const consistencyWeight = 0.2;

    // Calculate the final score
    const finalScore =
      incomeExpenseScore * incomeExpenseWeight +
      savingsScore * savingsWeight +
      consistencyScore * consistencyWeight;

    const finalScoreScaledTo1000 = finalScore * 10;

    return finalScoreScaledTo1000;
  }

  const finalScore = calculateFinalScoreScaledTo1000(
    data.first,
    data.second,
    data.third
  );
  const points = Math.round(finalScore);

  const lastMonthPoints = 250;
  const scales = [
    {
      min: 0,
      max: 200,
      label: "Very Low",
      color: "#FF0000",
    },
    {
      min: 200,
      max: 400,
      label: "Intermediate",
      color: "#FFA500",
    },
    {
      min: 400,
      max: 600,
      label: "Healthy",
      color: "#FFFF00",
    },
    {
      min: 600,
      max: 800,
      label: "Outstanding",
      color: "#ADFF2F",
    },
    {
      min: 800,
      max: 1000,
      label: "Impeccable",
      color: "#32CD32",
    },
  ];

  const newPoints = points - lastMonthPoints;
  const range = scales.find(
    (scale) => points >= scale.min && points < scale.max
  );
  const fillValue = ((points - range.min) / (range.max - range.min)) * 100;

  const segments = [
    {
      arcDegreeScale: 0.4,
      filledColor: COLOR_PRIMARY,
      emptyColor: COLOR_EMPTY,
      data: { label: range.label },
    },
    {
      filledColor: COLOR_PRIMARY,
      emptyColor: COLOR_EMPTY,
      data: { label: range.label },
    },
    {
      filledColor: COLOR_PRIMARY,
      emptyColor: COLOR_EMPTY,
      data: { label: range.label },
    },
    {
      filledColor: COLOR_PRIMARY,
      emptyColor: COLOR_EMPTY,
      data: { label: range.label },
    },
  ];

  const formattedDate = new Date().toLocaleDateString("en-EN", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });

  const parameters = [
    {
      title: "Financial Efficiency",
      percentage: Number(data.first).toFixed(2),
      statusColor: "#3D924B",
      showMore: true,
    },
    {
      title: "Savings Index",
      percentage: Number(data.third).toFixed(2),
      statusColor: "#DF8E13",
      showMore: true,
    },
    {
      title: "Expense Stability",
      percentage: Number(data.second).toFixed(2),
      statusColor: "#3D924B",
      showMore: true,
    },
  ];

  return (
    <View style={styles.safeArea}>
      <Header title="Analysis" />
      <View style={styles.arcContainer}>
        <ArcComponent
          segments={segments}
          fillValue={fillValue}
          points={points}
          newPoints={newPoints}
          radius={radius}
        />
        <Caption parameters={[{ range, formattedDate }]} />
      </View>
      <View style={styles.parametersContainer}>
        <ParameterList parameters={parameters} />
      </View>
    </View>
  );
}

// Centralized styles
const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    paddingVertical: 10,
    backgroundColor: "#FEFEFE",
  },
  loadingText: {
    flex: 1,
    textAlign: "center",
    marginTop: "50%",
    fontSize: 18,
    color: "#67677A",
  },
  arcContainer: {
    paddingVertical: 30,
    paddingHorizontal: "3.5%",
  },
  parametersContainer: {
    flex: 1,
    paddingHorizontal: "3.5%",
  },
});
