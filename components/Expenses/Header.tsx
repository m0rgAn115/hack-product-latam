import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { TabBarIcon } from '@/components/navigation/TabBarIcon';

interface HeaderProps {
  onBackPress: () => void;
  onIconPress: () => void;
  focused?: boolean;
}
// ({ onBackPress, onIconPress, focused = false }
const Header: React.FC<HeaderProps> = ({ onBackPress, onIconPress, focused = false }) => {
  return (
    <View style={styles.headerContainer}>
      {/* Botón de retroceso */}
      <TouchableOpacity onPress={onBackPress} style={styles.backButton}>
        <TabBarIcon 
          name={focused ? "chevron-back" : "chevron-back-outline"} // Cambia según 'focused' si es relevante
          size={24} 
          color="#4A4A4A" 
        />
      </TouchableOpacity>

      {/* Título */}
      <Text style={styles.headerTitle}>Gastos</Text>

      {/* Botón de ícono derecho */}
      <TouchableOpacity onPress={onIconPress} style={styles.rightButton}>
        <TabBarIcon 
          name={focused ? "bar-chart" : "bar-chart-outline"} // Cambia según 'focused' si es relevante
          size={24} 
          color="#4A4A4A" 
        />
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  headerContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 8,
    marginTop: 40, // Ajusta según la posición de la barra de estado
  },
  backButton: {
    flex: 1,
  },
  headerTitle: {
    flex: 3,
    textAlign: 'center',
    fontSize: 18,
    fontWeight: 'bold',
    color: '#4A4A4A',
  },
  rightButton: {
    flex: 1,
    alignItems: 'flex-end',
  },
});

export default Header;