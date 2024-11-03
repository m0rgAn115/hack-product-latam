import Ionicons from '@expo/vector-icons/Ionicons';
import { StyleSheet, Image, Platform, View, Text, ScrollView, Pressable, Button } from 'react-native';

import { Collapsible } from '@/components/Collapsible';
import { ExternalLink } from '@/components/ExternalLink';
import ParallaxScrollView from '@/components/ParallaxScrollView';
import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import { SafeAreaView } from 'react-native-safe-area-context';
import GoalBox from '@/components/Goals/GoalBox';
import { useRouter } from 'expo-router'; 
import RecomendationButton from '@/components/Goals/RecomendationButton';

export interface Goal {
  title: string;
  total_amount: number;
  actual_amount: number;
  total_months: number;
  actual_months: number
}

const data:Goal[] = [
  {
    title: 'Vacaciones a Italia 🇮🇹',
    actual_amount: 21800,
    actual_months: 2,
    total_months: 3,
    total_amount: 30000
  },
  {
    title: '2024 AVEO SEDAN 🚙' ,
    actual_amount: 180000,
    actual_months: 5.2,
    total_months: 6,
    total_amount: 200000
  },
  {
    title: 'IPhone 15 📱' ,
    actual_amount: 21800,
    actual_months: 2,
    total_months: 3,
    total_amount: 30000
  }
]

export default function TabTwoScreen() {

  const handleSelectGoal = (goal:Goal) => {
    router.push(`/goal-details?text=${goal.title}&amount=${goal.total_amount}`); 
  }

  const router = useRouter();

  const handlePress = (texto:string|undefined) => {

    // Navegar a la pantalla de objetivo
    router.push(`/goal-details?text=${texto}`); // Asegúrate de que la ruta coincida con el nombre del archivo
  };

  

  return (
    <SafeAreaView>
      <ScrollView style={{ paddingHorizontal: 20 }} >

      <Text style={styles.titleContainer} >Finantial Goals</Text>

      <Pressable 
        style={({ pressed }) => [
          styles.pressable,
          { backgroundColor: pressed ? '#d9d9d9' : '#efefef'},
        ]}
        onPress={ () => handlePress('')}
        >
        <Text style={styles.pressable_text} >
          New Goal +
        </Text>
      </Pressable>

      <ScrollView style={{ flexDirection: 'row', marginVertical: 10 }} 
        horizontal={true}
      >
        <RecomendationButton titulo='Quiero irme de vacaciones 🛥️'  onPress={handlePress}/>
        <RecomendationButton titulo='Quiero comprar un carro 🚙'  onPress={handlePress}/>

      </ScrollView>

      <Text style={[styles.titleContainer, {marginTop: 20}]} >My Goals</Text>
      
        
        {
          data.map((goal,index) => (
            <GoalBox key={index} onPress={handleSelectGoal} ContainerStyles={{marginVertical: 10}} goal={goal}/>
          ))
        }




      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  headerImage: {
    color: '#808080',
    bottom: -90,
    left: -35,
    position: 'absolute',
  },
  titleContainer: {
    flexDirection: 'row',
    gap: 8,
    color: 'black',
    fontSize: 22,
    fontWeight: '600',
    textAlign: 'center'
  },
  pressable: { 
    borderRadius: 10,
    backgroundColor: '#efefef',
    height: 40,
    width: 150,
    justifyContent: 'center',
    marginVertical: 15,
    borderWidth: 1,
    borderColor: '#c5c5c5'
  },
  pressable_text: {
    color: 'black',
    fontWeight: '600',
    textAlign: 'center',
    fontSize: 20,
  }
});
