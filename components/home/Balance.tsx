import React from "react";
import { StyleSheet, View, Text } from "react-native";
import { PieChart } from "react-native-gifted-charts";

const Balance = () => {
  const balanceTotal = "1040.00";
  const porcent = "16.8%";

  const pieData = [
    {
      value: 47,
      color: "#4A90E2",
      focused: true,
      text: "47%",
    },
    {
      value: 40,
      color: "#FF6B6B",
      text: "40%",
    },
    {
      value: 16,
      color: "#50E3C2",
      text: "16%",
    },
  ];

  return (
    <View style={styles.balance}>
      <View>
        <Text>Tu balance total</Text>
        <View style={{ flexDirection: "row", alignItems: "center", gap: 10 }}>
          <Text style={{ fontWeight: "bold", fontSize: 22 }}>
            ${balanceTotal}
          </Text>
          <View
            style={{
              borderWidth: 1,
              borderColor: "#34eb4c",
              //   backgroundColor: "#34eb4c",
              paddingHorizontal: 8,
              paddingVertical: 2,
              borderRadius: 14,
            }}>
            <Text style={{ color: "#34eb4c" }}>{porcent}</Text>
          </View>
        </View>
      </View>

      <View>
        <PieChart
          data={pieData}
          donut
          showGradient
          sectionAutoFocus
          // focusOnPress
          semiCircle
          radius={70}
          innerRadius={55}
          innerCircleColor={"#fff"}
          centerLabelComponent={() => {
            return (
              <View
                style={{
                  justifyContent: "center",
                  alignItems: "center",
                }}>
                <Text
                  style={{
                    fontSize: 22,
                    color: "black",
                    fontWeight: "bold",
                  }}>
                  47%
                </Text>
              </View>
            );
          }}
        />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  balance: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    backgroundColor: "#fff",
    paddingHorizontal: 20,
    paddingVertical: 10,
  },
});

export default Balance;
