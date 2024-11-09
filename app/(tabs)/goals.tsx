import { StyleSheet, Text, ScrollView, Pressable, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router'; 

import GoalsHeader from '@/components/Goals/GoalsHeader';
import GoalBox from '@/components/Goals/GoalBox';
import { Goal } from '@/components/Interfaces/goal';


const data: Goal[] = [
  {
    title: 'Italy Vacations',
    actual_amount: 21800,
    total_amount: 30000,
    deadline: '2024-12-01',
    description: 'Trip to Italy with my family'
  },
  {
    title: 'Aveo Sedan 2024',
    actual_amount: 180000,
    total_amount: 200000,
    deadline: '2024-12-31',
    description: 'Car for work'
  },
  {
    title: 'IPhone 15',
    actual_amount: 21800,
    total_amount: 30000,
    deadline: '2025-06-22',
    description: 'New phone'
  },
  {
    title: 'Macbook Pro 2024',
    actual_amount: 180000,
    total_amount: 200000,
    deadline: '2024-10-23',
    description: 'New laptop for work'
  }
];

export default function TabTwoScreen() {
  const router = useRouter();

  const handleSelectGoal = (goal: Goal): void => {
    router.push(`/goal-details?q_goal_title=${goal.title}&q_goal_amount=${goal.total_amount}`);
  };

  const handlePress = (texto: string | undefined): void => {
    router.push(`/goal-details?q_goal_title=${texto}`);
  };

  return (
    <SafeAreaView style={styles.container}>
      <GoalsHeader
        onPressNewGoal={() => handlePress('New Goal')}
        handlePress={handlePress}
      />

      <ScrollView showsVerticalScrollIndicator={false}>
        {data.map((goal) => (
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
