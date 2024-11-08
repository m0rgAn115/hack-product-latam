import { StyleSheet, View } from 'react-native';
import Expensess from '@/components/home/expensess';



export default function TabTwoScreen() {
  return (
    <View style={{backgroundColor: '#fff', flex: 1}}>
      <Expensess />
    </View>
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
  },
});
