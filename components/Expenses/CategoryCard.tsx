import React from 'react';
import { View, Text, FlatList, StyleSheet } from 'react-native';
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
  "Food and Drink": "#FF7A61",
  Entertainment: "#61A7FF",
  Shopping: "#FFA761",
  Utilities: "#61FFA7",
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
            data={transactions.slice(0, 2)} // Limitar a las primeras 2 transacciones
            keyExtractor={(transaction, index) => `${transaction.name}-${transaction.date}-${index}`}
            renderItem={({ item }) => {
              const percentage = (Math.abs(item.amount) / totalCategory) * 100;
              return (
                <View style={styles.transactionContainer}>
                  <View style={styles.transactionDetails}>
                    <Text style={styles.transactionTitle}>{item.name}</Text>
                    <Text style={styles.transactionAmount}>{item.amount < 0 && '-'}${Math.abs(item.amount).toFixed(2)}</Text>
                  </View>
                  <View style={styles.progressBarContainer}>
                    <View style={styles.progressBarBackground}>
                      <View style={[styles.progressBar, { width: `${percentage}%`, backgroundColor: color }]} />
                    </View>
                    <Text style={styles.transactionDate}>{item.date}</Text>
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
    marginBottom: 10,
  },
  icon: {
    width: 24,
    height: 24,
    borderRadius: 12,
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
    flexDirection: 'column',
    marginBottom: 10,
  },
  transactionDetails: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  transactionTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
  },
  transactionAmount: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
  },
  transactionDate: {
    fontSize: 13,
    color: '#A0A0A0',
    marginLeft: 30,
  },
  progressBarContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 10,
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
});

export default CategoryCard;