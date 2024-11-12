import { StyleSheet, Text, ScrollView, Pressable, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useRouter } from "expo-router";

import GoalsHeader from "@/components/Goals/GoalsHeader";
import GoalBox from "@/components/Goals/GoalBox";
import { Goal } from "@/components/Interfaces/goal";
import { useEffect, useState } from "react";
import useFetch from "@/hooks/useFetch";
import { useUserStore } from "@/store/useUserStore";
import { useIsFocused } from "@react-navigation/native";
import GoalSkeleton from "@/components/Goals/GoalSkeleton";

export default function TabTwoScreen() {
  const isFocused = useIsFocused();

  const router = useRouter();
  const { correo } = useUserStore();
  const [goals, setgoals] = useState<Goal[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const handleSelectGoal = (goal: Goal): void => {
    router.push(
      `/goal-details?q_goal_title=${goal.title}&q_goal_amount=${goal.goal_amount}&q_initial_amount=${goal.actual_amount}`
    );
  };

  const handlePress = (texto: string | undefined): void => {
    router.push(`/goal-details?q_goal_title=${texto}`);
  };

  useEffect(() => {
    const fetchGoalsData = async () => {
      setIsLoading(true);
      try {
        const data = await useFetch(
          "https://zttizctjsl.execute-api.us-east-1.amazonaws.com/backend/goals/email",
          {
            correo: correo,
          },
          "POST"
        );

        if (data.metas === undefined) return Error;
        setgoals(data.metas);
      } catch (error) {
        console.error("Error al obtener las metas: ", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchGoalsData();
  }, [isFocused]);

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView showsVerticalScrollIndicator={false}>
        <GoalsHeader
          onPressNewGoal={() => handlePress("New Goal")}
          handlePress={handlePress}
        />
        {isLoading ? (
          <GoalSkeleton />
        ) : (
          goals.map((goal) => (
            <GoalBox
              key={goal.title}
              goal={goal}
              onPress={handleSelectGoal}
              ContainerStyles={{ marginBottom: 20 }}
            />
          ))
        )}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "white",
    paddingHorizontal: 20,
  },
});
