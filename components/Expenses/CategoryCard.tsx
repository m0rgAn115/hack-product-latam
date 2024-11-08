import React from 'react';
import { View, Text, FlatList, StyleSheet, Image } from 'react-native';
import { TouchableOpacity } from 'react-native-gesture-handler';
import { GestureHandlerRootView } from 'react-native-gesture-handler';

interface ComponentProps {
  category: string;
  transactions: Array<{
    name: string;
    amount: number;
    date: string;
    logo_url?: string;
    merchant_name?: string;
  }>; 
  onPress: () => void;
  color: string; // Color específico para la categoría
}

export const categoryColors = {
  "Food and Drink": "#FF6F61",
  Entertainment: "#6C9BF3",
  Shopping: "#FFB84D",
  Utilities: "#73D8B1",
};


const CategoryCard = ({ category, transactions, onPress, color }: ComponentProps) => {
  const totalCategory = transactions.reduce((sum, t) => sum + Math.abs(t.amount), 0);

  return (
    <GestureHandlerRootView>
      <TouchableOpacity onPress={onPress}>
        <View style={styles.categoryContainer}>
          <View style={styles.header}>
            <View style={[styles.icon, { backgroundColor: color }]} />
            <Text style={styles.categoryTitle}>{category}</Text>
            <Text style={styles.categoryTotal}>${totalCategory.toFixed(2)}</Text>
          </View>
          <FlatList
            data={transactions.slice(0, 3)} // Limitar a las primeras 2 transacciones
            keyExtractor={(transaction, index) => `${transaction.name}-${transaction.date}-${index}`}
            renderItem={({ item }) => {
              const percentage = (Math.abs(item.amount) / totalCategory) * 100;
              return (
                <View style={styles.transactionContainer}>
                  <View style={styles.transactionDetails}>
                    <View style={[styles.iconLogo]}>
                      {
                        item.logo_url ? (
                          <Image source={{uri: item.logo_url}}
                            style={styles.logoImage}
                            resizeMode="contain" // Opcional: ajusta cómo se escala la imagen
                            accessibilityLabel={item.name}
                        />
                        ) : (
                          <View style={[styles.logoNone, {backgroundColor: color}]} />
                        )
                      }
                    </View>
                    <View>
                      <Text style={styles.transactionTitle}>{item.name}</Text>
                      <Text style={styles.transactionDate}>{item.date}</Text>
                    </View>
                  </View>
                  <View style={styles.progressBarContainer}>
                    <Text style={styles.transactionAmount}>{item.amount < 0 && '-'}${Math.abs(item.amount).toFixed(2)}</Text>
                  </View>
                </View>
              );
            }}
          />
        </View>
      </TouchableOpacity>
    </GestureHandlerRootView>
  );
};

const styles = StyleSheet.create({
  categoryContainer: { 
    marginVertical: 10,
    marginHorizontal: 30,
    paddingHorizontal: 15,
    backgroundColor: '#FFFFFF',
    borderRadius: 20, // Bordes redondeados
    padding: 15,
    borderWidth: 1,
    borderColor: '#E0E0E0',
    elevation: 2,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 15,
  },
  icon: {
    width: 12,
    height: 12,
    borderRadius: 12,
    marginRight: 10,
  },
  iconLogo: {
    elevation: 2,
    borderRadius: 100,
    marginRight: 10,
    
  },
  categoryTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#4F4F4F',
    flex: 1,
  },
  categoryTotal: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#4F4F4F',
  },
  transactionContainer: {
    justifyContent: 'space-between',
    flexDirection: 'row',
    marginBottom: 10,
  },
  transactionDetails: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  transactionTitle: {
    fontSize: 15,
    fontWeight: 'bold',
    color: '#333',
  },
  transactionAmount: {
    fontSize: 14.5,
    fontWeight: 'bold',
    color: '#333',
  },
  transactionDate: {
    fontSize: 12,
    color: '#A0A0A0',
  },
  progressBarContainer: {
    flexDirection: 'column',
    alignItems: 'flex-start',
  },
  progressBarBackground: {
    backgroundColor: '#E0E0E0',
    borderRadius: 2,
    flex: 1,
  },
  progressBar: {
    height: 4,
    borderRadius: 2,
  },
  logoImage: {
    width: 26, 
    height: 26,
    borderRadius: 20, 
  },
  logoNone: {
    width: 16,
    marginHorizontal: 5,
    height: 2,
  },
  transactValue: {
    fontSize: 12,
    color: '#A0A0A0',
  }
});

export default CategoryCard;