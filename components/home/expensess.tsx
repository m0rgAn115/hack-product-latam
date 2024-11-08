import React from "react";
import { StyleSheet, View, Text } from "react-native";
import { createStackNavigator } from "@react-navigation/stack";
import { useNavigation, NavigationProp } from "@react-navigation/native";
import { filteredTransactions } from "../Expenses/filterTransactions";
import { categoryColors } from "../Expenses/CategoryCard";
import { MainCategories } from "../Expenses/categoriesConfig";
import { useState } from "react";
import { mainCategories } from "../Expenses/categoriesConfig";
import MonthSelector from "../Expenses/MonthSelector";
import CategoryCard from "../Expenses/CategoryCard";
import { FlatList } from "react-native-gesture-handler";

const Expensess = () => {
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

  const navigation = useNavigation<NavigationProp<RootStackParamList>>();
  const [mesSeleccionado, setMesSeleccionado] = useState(9);
  const [modalVisible, setModalVisible] = useState(false);
  const [showGraph, setShowGraph] = useState(false); // Estado para controlar la visibilidad de la gráfica

  const Stack = createStackNavigator<RootStackParamList>();

  const filteredTransactionsByMonth = filteredTransactions.filter(
    (transaction) => {
      const transactionMonth = new Date(transaction.date).getMonth();
      return transactionMonth === mesSeleccionado;
    }
  );

  const Months_data: string[] = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
  ];

  const hasTransactions = filteredTransactionsByMonth.length > 0;

  const totalExpenses = hasTransactions
    ? filteredTransactionsByMonth.reduce(
        (sum, transaction) => sum + Math.abs(transaction.amount),
        0
      )
    : 0;

  const transformedTransactionsForGraph = hasTransactions
    ? filteredTransactionsByMonth.map((transaction) => ({
        titulo: transaction.name,
        monto: Math.abs(transaction.amount),
        categoria: transaction.mainCategory || "Otros",
        fecha: transaction.date,
      }))
    : [];

  const groupedTransactions = hasTransactions
    ? filteredTransactionsByMonth.reduce((acc, transaction) => {
        const mainCategory = (
          Object.keys(mainCategories) as (keyof MainCategories)[]
        ).find((mainCat) =>
          transaction.category.some((cat) =>
            mainCategories[mainCat].includes(cat)
          )
        );
        const categoryKey = mainCategory || "Others";
        if (!acc[categoryKey]) acc[categoryKey] = [];
        acc[categoryKey].push(transaction);
        return acc;
      }, {} as { [key in keyof MainCategories | "Others"]: PlaidTransaction[] })
    : {};

  const groupedData = (
    Object.keys(groupedTransactions) as Array<
      keyof typeof mainCategories | "Others"
    >
  ).map((category) => ({
    category,
    transactions:
      groupedTransactions[category as keyof typeof groupedTransactions],
    color: categoryColors[category as keyof typeof categoryColors] || "#CCCCCC",
  }));

  return (
    <View style={{ backgroundColor: "#fff" }}>
      <Text
        style={{
          textAlign: "center",
          fontSize: 20,
          fontWeight: "bold",
          paddingTop: 32,
          paddingBottom: 8,
        }}>
        Gastos
      </Text>
      <MonthSelector
        mesSeleccionado={mesSeleccionado}
        setMesSeleccionado={setMesSeleccionado}
        modalVisible={modalVisible}
        setModalVisible={setModalVisible}
        Months_data={Months_data}
      />
      {/* <AlertCard
                  message={`You spent $752.0 at Starbucks in ${Months_data[mesSeleccionado]}, averaging $153 per transaction.`}
                  iconKey="coffee"
                /> */}

      <FlatList
        data={groupedData}
        keyExtractor={(item, index) => `${item.category}-${index}`}
        renderItem={({ item }) => (
          <CategoryCard
            category={item.category || "Others"}
            transactions={item.transactions}
            onPress={() =>
              navigation.navigate("CategoryDetail", {
                category: item.category,
                transactions: item.transactions,
              })
            }
            color={item.color}
          />
        )}
        scrollEnabled={false}
      />
    </View>
  );
};

const styles = StyleSheet.create({});

export default Expensess;
