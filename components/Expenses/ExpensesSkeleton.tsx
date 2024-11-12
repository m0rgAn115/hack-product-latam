import React, { useEffect } from "react";
import { View, Animated, StyleSheet, Dimensions } from "react-native";

const ExpensesSkeleton = () => {
  const animatedValue = new Animated.Value(0);

  useEffect(() => {
    const startAnimation = () => {
      Animated.sequence([
        Animated.timing(animatedValue, {
          toValue: 1,
          duration: 1000,
          useNativeDriver: true,
        }),
        Animated.timing(animatedValue, {
          toValue: 0,
          duration: 1000,
          useNativeDriver: true,
        }),
      ]).start(() => {
        startAnimation();
      });
    };

    startAnimation();

    return () => {
      animatedValue.setValue(0);
    };
  }, []);

  const opacity = animatedValue.interpolate({
    inputRange: [0, 1],
    outputRange: [0.3, 0.7],
  });

  return (
    <View style={styles.container}>
      {/* Título */}
      <Animated.View style={[styles.title, { opacity }]} />

      {/* Month Selector */}
      <Animated.View style={[styles.monthSelector, { opacity }]} />

      {/* Total Amount */}
      <Animated.View style={[styles.totalAmount, { opacity }]} />

      {/* Category Cards */}
      {[1, 2, 3].map((_, index) => (
        <Animated.View
          key={index}
          style={[styles.categoryCard, { opacity }]}>
          <View style={styles.categoryHeader}>
            <View style={styles.categoryIcon} />
            <View style={styles.categoryTexts}>
              <View style={styles.categoryTitle} />
              <View style={styles.categorySubtitle} />
            </View>
          </View>
          <View style={styles.categoryAmount} />
        </Animated.View>
      ))}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "white",
    paddingHorizontal: 20,
  },
  title: {
    height: 30,
    backgroundColor: "#E1E9EE",
    borderRadius: 4,
    marginVertical: 20,
    width: "40%",
    alignSelf: "center",
  },
  monthSelector: {
    height: 40,
    backgroundColor: "#E1E9EE",
    borderRadius: 8,
    marginBottom: 20,
  },
  totalAmount: {
    height: 45,
    backgroundColor: "#E1E9EE",
    borderRadius: 4,
    marginBottom: 30,
    width: "60%",
    alignSelf: "center",
  },
  categoryCard: {
    backgroundColor: "#F5F5F5",
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    height: 100,
  },
  categoryHeader: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 12,
  },
  categoryIcon: {
    width: 40,
    height: 40,
    backgroundColor: "#E1E9EE",
    borderRadius: 20,
    marginRight: 12,
  },
  categoryTexts: {
    flex: 1,
  },
  categoryTitle: {
    height: 16,
    backgroundColor: "#E1E9EE",
    borderRadius: 4,
    width: "40%",
    marginBottom: 8,
  },
  categorySubtitle: {
    height: 12,
    backgroundColor: "#E1E9EE",
    borderRadius: 4,
    width: "30%",
  },
  categoryAmount: {
    height: 20,
    backgroundColor: "#E1E9EE",
    borderRadius: 4,
    width: "25%",
    alignSelf: "flex-end",
  },
});

export default ExpensesSkeleton;
