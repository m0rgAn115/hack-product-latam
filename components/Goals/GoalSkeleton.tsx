import React, { useEffect, useRef } from "react";
import { View, StyleSheet, Animated, Dimensions } from "react-native";

const GoalSkeleton = () => {
  const animatedValue = useRef(new Animated.Value(0)).current;

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
  }, []);

  const opacity = animatedValue.interpolate({
    inputRange: [0, 1],
    outputRange: [0.3, 0.7],
  });

  const SkeletonItem = () => (
    <View style={styles.skeletonContainer}>
      <View style={styles.upperContent}>
        <View style={styles.textContent}>
          <Animated.View style={[styles.titleSkeleton, { opacity }]} />
          <Animated.View style={[styles.descriptionSkeleton, { opacity }]} />
          <Animated.View style={[styles.daysRemainingSkeleton, { opacity }]} />
          <Animated.View style={[styles.deadlineSkeleton, { opacity }]} />
        </View>
        <Animated.View style={[styles.iconSkeleton, { opacity }]} />
      </View>
      <View style={styles.lowerContent}>
        <Animated.View style={[styles.amountLabelSkeleton, { opacity }]} />
        <Animated.View style={[styles.amountSkeleton, { opacity }]} />
      </View>
    </View>
  );

  return (
    <>
      <SkeletonItem />
      <SkeletonItem />
      <SkeletonItem />
    </>
  );
};

const styles = StyleSheet.create({
  skeletonContainer: {
    marginBottom: 20,
  },
  upperContent: {
    padding: 15,
    borderWidth: 1,
    borderColor: "#e8e8e8",
    borderRadius: 10,
    borderBottomLeftRadius: 0,
    borderBottomRightRadius: 0,
    flexDirection: "row",
    backgroundColor: "#fff",
  },
  textContent: {
    flex: 1,
  },
  titleSkeleton: {
    height: 28,
    backgroundColor: "#E1E9EE",
    borderRadius: 4,
    width: "70%",
  },
  descriptionSkeleton: {
    height: 12,
    backgroundColor: "#E1E9EE",
    borderRadius: 4,
    marginTop: 8,
    width: "90%",
  },
  daysRemainingSkeleton: {
    height: 12,
    backgroundColor: "#E1E9EE",
    borderRadius: 4,
    marginTop: 8,
    width: "40%",
  },
  deadlineSkeleton: {
    height: 25,
    backgroundColor: "#E1E9EE",
    borderRadius: 15,
    marginTop: 8,
    width: "50%",
  },
  iconSkeleton: {
    width: 45,
    height: 45,
    backgroundColor: "#E1E9EE",
    borderRadius: 100,
  },
  lowerContent: {
    padding: 15,
    backgroundColor: "#F6F6F6",
    borderBottomRightRadius: 10,
    borderBottomLeftRadius: 10,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  amountLabelSkeleton: {
    height: 16,
    backgroundColor: "#E1E9EE",
    borderRadius: 4,
    width: "20%",
  },
  amountSkeleton: {
    height: 16,
    backgroundColor: "#E1E9EE",
    borderRadius: 4,
    width: "40%",
  },
});

export default GoalSkeleton;
