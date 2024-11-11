import React, { useEffect, useRef } from "react";
import { View, Animated, StyleSheet, Dimensions } from "react-native";

const { width } = Dimensions.get("window");
const CARD_WIDTH = width * 0.4;
const CARD_HEIGHT = CARD_WIDTH * 1.1;

const CardSkeleton = () => {
  const shimmerAnimation = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    const startShimmerAnimation = () => {
      Animated.loop(
        Animated.sequence([
          Animated.timing(shimmerAnimation, {
            toValue: 1,
            duration: 1000,
            useNativeDriver: true,
          }),
          Animated.timing(shimmerAnimation, {
            toValue: 0,
            duration: 1000,
            useNativeDriver: true,
          }),
        ])
      ).start();
    };

    startShimmerAnimation();
  }, []);

  const translateX = shimmerAnimation.interpolate({
    inputRange: [0, 1],
    outputRange: [-CARD_WIDTH, CARD_WIDTH],
  });

  return (
    <View style={[styles.card, { width: CARD_WIDTH, height: CARD_HEIGHT }]}>
      <View style={styles.shimmerContainer}>
        <Animated.View
          style={[
            styles.shimmer,
            {
              transform: [{ translateX }],
            },
          ]}
        />
      </View>
      <View style={styles.cardContent}>
        <View style={styles.cardHeader}>
          <View style={styles.chipPlaceholder} />
          <View style={styles.typePlaceholder} />
        </View>
        <View style={styles.numberPlaceholder} />
        <View style={styles.smallNumberPlaceholder} />
      </View>
    </View>
  );
};

const SkeletonLoader = () => {
  return (
    <View style={styles.container}>
      {[1, 2].map((key) => (
        <View
          key={key}
          style={styles.cardContainer}>
          <CardSkeleton />
        </View>
      ))}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    paddingHorizontal: 20,
  },
  cardContainer: {
    marginRight: 20,
  },
  card: {
    backgroundColor: "#ffffff",
    borderRadius: 12,
    position: "relative",
    overflow: "hidden",
    borderWidth: 1,
    borderColor: "#E0E0E0",
  },
  shimmerContainer: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    overflow: "hidden",
  },
  shimmer: {
    width: "100%",
    height: "100%",
    backgroundColor: "#ebebeb",
    opacity: 0.8,
  },
  cardContent: {
    flex: 1,
    padding: 24,
    justifyContent: "space-between",
  },
  cardHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  chipPlaceholder: {
    width: 40,
    height: 30,
    backgroundColor: "#f0f0f0",
    borderRadius: 4,
  },
  typePlaceholder: {
    width: 60,
    height: 12,
    backgroundColor: "#f0f0f0",
    borderRadius: 4,
  },
  numberPlaceholder: {
    width: "80%",
    height: 14,
    backgroundColor: "#f0f0f0",
    borderRadius: 4,
    marginTop: 20,
  },
  smallNumberPlaceholder: {
    width: "40%",
    height: 14,
    backgroundColor: "#f0f0f0",
    borderRadius: 4,
    marginTop: 10,
  },
});

export default SkeletonLoader;
