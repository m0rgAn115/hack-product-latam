import React, { useEffect, useRef } from "react";
import { View, Animated, StyleSheet, Dimensions } from "react-native";

const ShimmerEffect = ({ translateX }) => (
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
);

const BalanceSkeleton = () => {
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
    outputRange: [-200, 200],
  });

  return (
    <View style={styles.balance}>
      <View>
        {/* Title skeleton */}
        <View style={[styles.titleSkeleton, styles.shimmerOverlay]}>
          <ShimmerEffect translateX={translateX} />
        </View>

        <View style={{ flexDirection: "row", alignItems: "center", gap: 10 }}>
          {/* Balance amount skeleton */}
          <View style={[styles.balanceAmountSkeleton, styles.shimmerOverlay]}>
            <ShimmerEffect translateX={translateX} />
          </View>

          {/* Percentage skeleton */}
          <View style={[styles.percentageSkeleton, styles.shimmerOverlay]}>
            <ShimmerEffect translateX={translateX} />
          </View>
        </View>
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
  shimmerOverlay: {
    overflow: "hidden",
    backgroundColor: "#f0f0f0",
  },
  titleSkeleton: {
    width: 120,
    height: 16,
    borderRadius: 4,
    marginBottom: 8,
  },
  balanceAmountSkeleton: {
    width: 100,
    height: 24,
    borderRadius: 4,
  },
  percentageSkeleton: {
    width: 60,
    height: 24,
    borderRadius: 14,
  },
  chartContainer: {
    position: "relative",
    width: 140,
    height: 70,
    justifyContent: "center",
    alignItems: "center",
  },
  chartSkeleton: {
    width: 140,
    height: 70,
    borderTopLeftRadius: 70,
    borderTopRightRadius: 70,
  },
  centerLabelSkeleton: {
    position: "absolute",
    width: 40,
    height: 24,
    borderRadius: 4,
    top: "50%",
    left: "50%",
    transform: [{ translateX: -20 }, { translateY: -12 }],
  },
});

export default BalanceSkeleton;
