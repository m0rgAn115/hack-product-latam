import { View, ScrollView, StyleSheet, Text, FlatList, Button } from 'react-native';
import React, { useState } from 'react';
import Header from '../../components/Expenses/Header';
import AlertCard from '../../components/Expenses/AlertCard';
import MonthSelector from '../../components/Expenses/MonthSelector';
import CategoryCard from '@/components/Expenses/CategoryCard';
import GraphPerMonth from '@/components/Expenses/GraphPerMonth';
import { useNavigation, NavigationProp } from '@react-navigation/native';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { createStackNavigator } from '@react-navigation/stack';
import CategoryDetailScreen from '@/components/Expenses/CategoryDetailScreen';
import SubscriptionsCard from '@/components/Expenses/SubscriptionsCard';
import { filteredTransactions } from '@/components/Expenses/filterTransactions';
import { categoryColors } from '@/components/Expenses/CategoryCard';
import { MainCategories } from '@/components/Expenses/categoriesConfig';
import { mainCategories } from '@/components/Expenses/categoriesConfig';

type RootStackParamList = {
  Gastos: undefined;
  CategoryDetail: { 
    category: string;
    transactions: Array<{
      name: string;
      amount: number;
      date: string;
      logo_url?: string;
      merchant_name?: string;
    }>;
  };
  subscriptions: undefined;
  onPress: () => void;
};

interface PlaidTransaction {
  date: string;
  amount: number;
  logo_url?: string;
  merchant_name?: string;
  name: string;
  category: string[];
  mainCategory?: keyof MainCategories | "Others";
}

const Stack = createStackNavigator<RootStackParamList>();

const Months_data: string[] = [
  "January", "February", "March", "April", "May", "June",
  "July", "August", "September", "October", "November", "December"
];

const GastosComponent = () => {
  const navigation = useNavigation<NavigationProp<RootStackParamList>>();
  const [mesSeleccionado, setMesSeleccionado] = useState(9);
  const [modalVisible, setModalVisible] = useState(false);
  const [showGraph, setShowGraph] = useState(false); // Estado para controlar la visibilidad de la gráfica

  const filteredTransactionsByMonth = filteredTransactions.filter(transaction => {
    const transactionMonth = new Date(transaction.date).getMonth();
    return transactionMonth === mesSeleccionado;
  });

  const hasTransactions = filteredTransactionsByMonth.length > 0;
  
  const totalExpenses = hasTransactions
    ? filteredTransactionsByMonth.reduce((sum, transaction) => sum + Math.abs(transaction.amount), 0)
    : 0;

  const transformedTransactionsForGraph = hasTransactions
    ? filteredTransactionsByMonth.map(transaction => ({
        titulo: transaction.name,
        monto: Math.abs(transaction.amount),
        categoria: transaction.mainCategory || "Otros",
        fecha: transaction.date,
      }))
    : [];


    const groupedTransactions = hasTransactions
    ? filteredTransactionsByMonth.reduce((acc, transaction) => {
        const mainCategory = (Object.keys(mainCategories) as (keyof MainCategories)[]).find(mainCat =>
          transaction.category.some(cat => mainCategories[mainCat].includes(cat))
        );
        const categoryKey = mainCategory || "Others";
        if (!acc[categoryKey]) acc[categoryKey] = [];
        acc[categoryKey].push(transaction);
        return acc;
      }, {} as { [key in keyof MainCategories | "Others"]: PlaidTransaction[] })
    : {};


const groupedData = (Object.keys(groupedTransactions) as Array<keyof typeof mainCategories | "Others">).map(category => ({
  category,
  transactions: groupedTransactions[category as keyof typeof groupedTransactions],
  color: categoryColors[category as keyof typeof categoryColors] || '#CCCCCC',
}));

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <View style={styles.container}>
        <Header
          onBackPress={() => console.log('Botón de retroceso presionado')}
          onIconPress={() => navigation.navigate('subscriptions')}
          focused={true}
        />

        <MonthSelector 
          mesSeleccionado={mesSeleccionado}
          setMesSeleccionado={setMesSeleccionado}
          modalVisible={modalVisible}
          setModalVisible={setModalVisible}
          Months_data={Months_data}
        />

        <Text style={styles.amountText}>${totalExpenses.toFixed(2)}</Text>

        <Button
          title={showGraph ? "Hide Graph" : "Show Graph"}
          onPress={() => setShowGraph(prev => !prev)} // Alterna el estado de visibilidad de la gráfica
        />

        <ScrollView contentContainerStyle={styles.scrollContent}>
          {hasTransactions ? (
            <>
              {/* Renderizar la gráfica solo si `showGraph` es `true` */}
              {showGraph && (
                <GraphPerMonth transactions={transformedTransactionsForGraph} category='' />
              )}

              <AlertCard
                message={`You spent $752.0 at Starbucks in ${Months_data[mesSeleccionado]}, averaging $153 per transaction.`}
                iconKey='coffee'
              />

              <FlatList
                data={groupedData}
                keyExtractor={(item, index) => `${item.category}-${index}`}
                renderItem={({ item }) => (
                  <CategoryCard
                    category={item.category || "Others"}
                    transactions={item.transactions}
                    onPress={() => navigation.navigate('CategoryDetail', {
                      category: item.category,
                      transactions: item.transactions,
                    })}
                    color={item.color}
                  />
                )}
                scrollEnabled={false}
              />
            </>
          ) : (
            <Text style={styles.noTransactionsText}>There are no transactions for the selected month.</Text>
          )}
        </ScrollView>
      </View>
    </GestureHandlerRootView>
  );
};

const Gastos = () => (
  <GestureHandlerRootView style={{ flex: 1 }}>
    <Stack.Navigator>
      <Stack.Screen name="Gastos" component={GastosComponent} options={{ headerShown: false }} />
      <Stack.Screen name="CategoryDetail" component={CategoryDetailScreen} options={{ headerShown: false }} />
      <Stack.Screen name="subscriptions" component={SubscriptionsCard} options={{ headerShown: false }} />
    </Stack.Navigator>
  </GestureHandlerRootView>
);

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  amountText: {
    fontSize: 36,
    fontWeight: 'bold',
    textAlign: 'center',
    marginVertical: 15,
  },
  scrollContent: {
    paddingBottom: 20,
  },
  noTransactionsText: {
    fontSize: 18,
    color: '#888',
    textAlign: 'center',
    marginVertical: 20,
  },
});

export default Gastos;