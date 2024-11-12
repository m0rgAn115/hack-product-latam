import { Text, FlatList, StyleSheet } from "react-native";
import React, { useState, useEffect } from "react";
import MonthSelector from "@/components/Expenses/MonthSelector";
import CategoryCard from "@/components/Expenses/CategoryCard";
import { useNavigation, NavigationProp } from "@react-navigation/native";
import Header from "@/components/Header";
import { filterTransactions } from "@/components/Expenses/filterTransactions";
import { categoryColors } from "@/components/Expenses/CategoryCard";
import { MainCategories } from "@/components/Expenses/categoriesConfig";
import { mainCategories } from "@/components/Expenses/categoriesConfig";
import { useUserStore } from "@/store/useUserStore";
import useFetch from "@/hooks/useFetch";
import { SafeAreaView } from "react-native-safe-area-context";
import { useTransactionsStore } from "@/store/useTransactionsStore";
import ExpensesSkeleton from "../Expenses/ExpensesSkeleton";

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

export interface PlaidTransaction {
  date: string;
  amount: number;
  logo_url?: string;
  merchant_name?: string;
  name: string;
  category: string[];
  mainCategory?: keyof MainCategories | "Others";
}

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

const Expensess = () => {
  const { correo } = useUserStore();
  const { transacciones } = useTransactionsStore();

  const [transactionsData, setTransactions] = useState<PlaidTransaction[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  const navigation = useNavigation<NavigationProp<RootStackParamList>>();
  const [mesSeleccionado, setMesSeleccionado] = useState(new Date().getMonth());
  const [modalVisible, setModalVisible] = useState(false);

  useEffect(() => {
    if (transacciones) {
      setTransactions(transacciones);
      setIsLoading(false);
    }
  }, [transacciones]);

  // if (!isLoading) {
  //   return <ExpensesSkeleton />;
  // }

  if (error) {
    return (
      <Text style={{ backgroundColor: "#fff" }}>Error: {error.message}</Text>
    );
  }

  const filteredTransactionsByMonth = transactionsData.filter((transaction) => {
    const transactionMonth = new Date(transaction.date).getMonth();
    return transactionMonth === mesSeleccionado;
  });

  const hasTransactions = filteredTransactionsByMonth.length > 0;

  const totalExpenses = hasTransactions
    ? filteredTransactionsByMonth.reduce(
        (sum, transaction) => sum + Math.abs(transaction.amount),
        0
      )
    : 0;

  const formattedTotalExpenses = totalExpenses.toLocaleString("en-US", {
    style: "currency",
    currency: "USD",
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });

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
    color: categoryColors[category as keyof typeof categoryColors] || "#F2E1C1",
  }));

  return (
    <SafeAreaView style={styles.container}>
      <Text
        style={{
          fontSize: 24,
          fontWeight: "700",
          textAlign: "center",
          marginBottom: 20,
        }}>
        Expenses
      </Text>
      {!(transacciones.length == 0) ? (
        <FlatList
          data={groupedData}
          style={{ flex: 1 }}
          ListHeaderComponent={
            <>
              <MonthSelector
                mesSeleccionado={mesSeleccionado}
                setMesSeleccionado={setMesSeleccionado}
                modalVisible={modalVisible}
                setModalVisible={setModalVisible}
                Months_data={Months_data}
              />
              <Text style={styles.total}>{formattedTotalExpenses}</Text>
            </>
          }
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
          scrollEnabled={true}
          showsVerticalScrollIndicator={false}
        />
      ) : (
        <ExpensesSkeleton />
      )}
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "white",
    paddingHorizontal: 20,
  },
  total: {
    fontSize: 38,
    fontWeight: "700",
    textAlign: "center",
    fontFamily: "Roboto",
    letterSpacing: 1,
    flex: 1,
  },
});

export default Expensess;
