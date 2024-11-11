import React from 'react';
import { View, Text, FlatList, StyleSheet, Image, Pressable } from 'react-native';
import { GestureHandlerRootView } from 'react-native-gesture-handler';

interface Transaction {
  name: string;
  amount: number;
  date: string;
  logo_url?: string;
  merchant_name?: string;
}

interface ComponentProps {
  category: string;
  transactions: Transaction[];
  onPress: () => void;
  color: string; // Color específico para la categoría
}

export const categoryColors = {
  "Food and Drink": "#FF6F61",
  Entertainment: "#6C9BF3",
  Shopping: "#FFB84D",
  Utilities: "#73D8B1",
};

const renderCategoryEmoji = (category: string) => {
  switch (category) {
    case 'Food and Drink':
      return "🍏";  // O "🍔" o "🍜"
    case 'Entertainment':
      return "🎬";  // O "🎮"
    case 'Shopping':
      return "🛒";  // O "👗"
    case 'Utilities':
      return "💡";  // O "🔧"
    default:
      return "🌍";  // O "🌍"
  }
};

const CategoryCard = ({ category, transactions, onPress, color }: ComponentProps) => {

  const totalCategory = transactions.reduce((sum, t) => sum + Math.abs(t.amount), 0);
  const formatAmount = (amount: number) => `$${Math.abs(amount).toFixed(2)}`;

  const renderTransactionItem = ({ item }: { item: Transaction }) => {
    return (
      <View style={styles.transactionContainer}>
        <View style={styles.transactionDetails}>
          <View style={[styles.iconLogo]}>
            {item.logo_url ? (
              <Image source={{ uri: item.logo_url }} style={styles.logoImage} resizeMode="contain" />
            ) : (
              <Text style={styles.logoNone}>{renderCategoryEmoji(category)}</Text>
            )}
          </View>
          <View>
            <Text style={styles.transactionTitle}
              numberOfLines={1}
              ellipsizeMode= 'tail' 
            >{item.name}</Text>
            <Text style={styles.transactionDate}>{item.date}</Text>
          </View>
        </View>
        <View style={styles.progressBarContainer}>
          <Text style={styles.transactionAmount}>
            {item.amount < 0 && '-'}{formatAmount(item.amount)}
          </Text>
        </View>
      </View>
    );
  };

  return (
    <GestureHandlerRootView>
      <Pressable onPress={onPress} style={({ pressed }) => [styles.pressableContainer, pressed && styles.pressed]}>
        <View style={styles.categoryContainer}>
          <View style={styles.header}>
            <View style={[styles.iconCont,{ backgroundColor: color }]}>
              <Text style={styles.icon}>{renderCategoryEmoji(category)}</Text>
            </View>
            <Text style={styles.categoryTitle}>{category}</Text>
            <Text style={styles.categoryTotal}>{formatAmount(totalCategory)}</Text>
          </View>
          <FlatList
            data={transactions.slice(0, 3)} // Limitar a las primeras 3 transacciones
            keyExtractor={(transaction, index) => `${transaction.name}-${transaction.date}-${index}`}
            renderItem={renderTransactionItem}
          />
        </View>
      </Pressable>
    </GestureHandlerRootView>
  );
};

const styles = StyleSheet.create({
  pressableContainer: {
    borderRadius: 14,
    overflow: 'hidden',
  },
  pressed: {
    opacity: 0.6,
  },
  categoryContainer: {
    marginVertical: 10,
    backgroundColor: '#FFFFFF',
    borderRadius: 14,
    padding: 15,
    borderWidth: 1,
    borderColor: '#EFEFF1',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
  },
  iconCont: {
    marginRight: 10,
    borderRadius: 5,
  },
  icon: {
    paddingHorizontal: 10,
    paddingVertical: 9,
    fontSize: 16,
  },
  iconLogo: {
    marginRight: 15,
  },
  categoryTitle: {
    fontSize: 18,
    fontWeight: 'light',
    color: '#4F4F4F',
    flex: 1,
  },
  categoryTotal: {
    fontSize: 16,
    fontWeight: 'medium',
    color: '#4F4F4F',
  },
  transactionContainer: {
    justifyContent: 'space-between',
    flexDirection: 'row',
    marginBottom: 14,
  },
  transactionDetails: {
    flexDirection: 'row',
    alignItems: 'center',
    marginRight: 15,
    flex: 1,
  },
  transactionTitle: {
    fontSize: 15,
    fontWeight: '600',
  },
  transactionAmount: {
    fontSize: 14.5,
    fontWeight: '600',
  },
  transactionDate: {
    fontSize: 12,
    color: '#A0A0A0',
  },
  progressBarContainer: {
    flexDirection: 'column',
    alignItems: 'flex-start',
  },
  logoImage: {
    width: 26,
    height: 26,
  },
  logoNone: {
    width: 26,
    height: 26,
    textAlign: 'center',
    textAlignVertical: 'center',
  },
});

export default CategoryCard;
