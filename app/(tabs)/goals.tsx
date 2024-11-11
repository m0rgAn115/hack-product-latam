import { StyleSheet, Text, ScrollView, Pressable, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router'; 

import GoalsHeader from '@/components/Goals/GoalsHeader';
import GoalBox from '@/components/Goals/GoalBox';
import { Goal } from '@/components/Interfaces/goal';
import { useEffect, useState } from 'react';
import useFetch from '@/hooks/useFetch';
import { useUserStore } from '@/store/useUserStore';
import { useIsFocused } from '@react-navigation/native';



export default function TabTwoScreen() {
  const isFocused = useIsFocused();
  
  const router = useRouter();
  const { correo } = useUserStore()
  const [goals, setgoals] = useState<Goal[]>([])

  const handleSelectGoal = (goal: Goal): void => {
    router.push(`/goal-details?q_goal_title=${goal.title}&q_goal_amount=${goal.goal_amount}&q_initial_amount=${goal.actual_amount}`);
  };

  const handlePress = (texto: string | undefined): void => {
    router.push(`/goal-details?q_goal_title=${texto}`);
  };

  useEffect(() => {
    const fetchGoalsData = async() => {
      try {
        const data = await useFetch("https://zttizctjsl.execute-api.us-east-1.amazonaws.com/backend/goals/email",
          {
            "correo": correo
          },
          "POST"
         )

         console.log(data.metas);

         if(data.metas === undefined) return Error
         

         setgoals(data.metas)
      } catch (error) {
        console.error("Error al obtener las metas: ",error)
      }
    }
    fetchGoalsData()
  }, [isFocused])

  
  

  return (
    <SafeAreaView style={styles.container}>
      <GoalsHeader
        onPressNewGoal={() => handlePress('New Goal')}
        handlePress={handlePress}
      />

      <ScrollView showsVerticalScrollIndicator={false}>
        {goals.map((goal) => (
          <GoalBox
            key={goal.title} // Usar un identificador único en lugar de index
            onPress={handleSelectGoal}
            goal={goal}
            ContainerStyles={{ marginBottom: 20 }}
          />
        ))}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'white',
    paddingVertical: 20,
    paddingHorizontal: 20,
  },
});
