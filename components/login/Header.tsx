import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { TabBarIcon } from '@/components/navigation/TabBarIcon';

interface HeaderProps {
  onBackPress: () => void;
  Title: string;
  focused?: boolean;
}

const Header: React.FC<HeaderProps> = ({ onBackPress, focused = false, Title }) => {
  return (
    <View style={styles.headerContainer}>
      <TouchableOpacity onPress={onBackPress} style={styles.backButton}>
        <TabBarIcon 
          name={focused ? "chevron-back" : "chevron-back-outline"}
          size={30} 
          color="#4A4A4A" 
        />
      </TouchableOpacity>

      <Text style={styles.headerTitle}>{Title}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  headerContainer: {
    marginTop: 16,
    flexDirection: 'row', 
    alignItems: 'center', // Alinea los elementos verticalmente
    paddingHorizontal: 16,
  },
  backButton: {
    justifyContent: 'center', 
    alignItems: 'center', 
    elevation: 5,
  },
  headerTitle: {
    position: 'absolute',
    backgroundColor: '#000',

    left: 0,
    right: 0,
    fontSize: 18,
    textAlign: 'center',
    fontWeight: 'bold',
    color: '#4A4A4A',
  },
});

export default Header;
