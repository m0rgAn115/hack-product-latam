import Ionicons from '@expo/vector-icons/Ionicons';
import { StyleSheet, Image, Platform, View, Text, ScrollView, Pressable } from 'react-native';

import { Collapsible } from '@/components/Collapsible';
import { ExternalLink } from '@/components/ExternalLink';
import ParallaxScrollView from '@/components/ParallaxScrollView';
import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import { SafeAreaView } from 'react-native-safe-area-context';
import GoalBox from '@/components/Goals/GoalBox';

export default function TabTwoScreen() {



  return (
    <SafeAreaView>
      <ScrollView style={{ paddingHorizontal: 10 }} >

      <Text style={styles.titleContainer} >Finantial Goals</Text>

      <Pressable style={styles.pressable} >
        <Text style={styles.pressable_text} >
          New Goal +
        </Text>
      </Pressable>

      <ScrollView style={{ flexDirection: 'row', marginVertical: 10 }} 
        horizontal={true}
      >
        <Pressable style={{ backgroundColor: '#e3e3e3', paddingVertical: 5, paddingHorizontal: 10, borderRadius: 5, alignSelf: 'flex-start', marginRight: 20 }} >
          <Text style={{ fontSize: 18, textAlign: 'center' }} >Quiero irme de vacaciones 🛥️</Text>
        </Pressable>
        <Pressable style={{ backgroundColor: '#e3e3e3', paddingVertical: 5, paddingHorizontal: 10, borderRadius: 5, alignSelf: 'flex-start', marginRight: 20 }} >
        <Text style={{ fontSize: 18, textAlign: 'center' }} >Quiero irme de vacaciones 🛥️</Text>
        </Pressable>
        <Pressable style={{ backgroundColor: '#e3e3e3', paddingVertical: 5, paddingHorizontal: 10, borderRadius: 5, alignSelf: 'flex-start', marginRight: 20 }} >
          <Text style={{ fontSize: 18, textAlign: 'center' }} >Quiero irme de vacaciones 🛥️</Text>
        </Pressable>
      </ScrollView>

     

      <GoalBox title='Vacaciones a Italia 🇮🇹' actual_amount={21800} total_amount={30000} months={2} ContainerStyles={{marginVertical: 10}} />
      <GoalBox title='2024 AVEO SEDAN 🚙' actual_amount={280000} total_amount={296000} months={1} ContainerStyles={{marginVertical: 10}} />
      <GoalBox title='IPhone 15 📱' actual_amount={22000} total_amount={22000} months={2} ContainerStyles={{marginVertical: 10}} />

      


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
    color: 'white',
    fontSize: 35,
    fontWeight: '600',
    textAlign: 'center'
  },
  pressable: { 
    borderRadius: 10,
    backgroundColor: '#e2c626',
    height: 40,
    width: 150,
    justifyContent: 'center',
    marginVertical: 15
  },
  pressable_text: {
    color: 'black',
    fontWeight: '600',
    textAlign: 'center',
    fontSize: 20,
  }
});
