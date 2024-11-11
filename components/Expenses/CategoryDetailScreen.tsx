import React, { useEffect } from "react";
import { View, Text, FlatList, StyleSheet, Dimensions, BackHandler } from "react-native";
import { RouteProp } from "@react-navigation/native";
import Header from "@/components/Header";
import { Ionicons } from "@expo/vector-icons";
import { categoryColors } from "./CategoryCard";
import { Image } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useRouter } from "expo-router";
import { List } from "lucide-react";

type RootStackParamList = {
  Home: undefined;
  Summary: undefined;
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
};
type CategoryDetailScreenRouteProp = RouteProp<
  RootStackParamList,
  "CategoryDetail"
>;

interface CategoryDetailScreenProps {
  route: CategoryDetailScreenRouteProp;
}


const CategoryDetailScreen: React.FC<CategoryDetailScreenProps> = ({
  route,
}) => {
  const router = useRouter();

  const handleBack = () => {
    console.log("hola");
    
    router.replace(`/(tabs)/transactions`);
  }

  const { category, transactions } = route.params;

  const chartColor =
    categoryColors[category as keyof typeof categoryColors] || "#6200EE";

  const labels = transactions.map((t, index) =>
    index % 2 === 0 ? t.name : ""
  );
  const dataValues = transactions.map((t) => Math.abs(t.amount));


  return (
    <SafeAreaView style={styles.container}>
      <Header title={category} onPress={handleBack}/>
      <View style={styles.card}>
        <FlatList
          style={styles.list}
          data={transactions}
          showsVerticalScrollIndicator={false}
          keyExtractor={(item, index) => `${item.name}-${index}`}
          renderItem={({ item, index }) => (
            <View
              style={[
                styles.transactionHeader,
                index === transactions.length - 1 && styles.lastItem,
              ]}>
              <View style={[styles.icon, { backgroundColor: "" }]}>
                {item.logo_url ? (
                  <Image
                    source={{ uri: item.logo_url }}
                    style={styles.iconImage}
                  />
                ) : (
                  <Ionicons
                    name="image-outline"
                    size={24}
                    color="#888"
                  />
                )}
              </View>
              <Text style={styles.transactionTitle}
                numberOfLines={1}
                ellipsizeMode= 'tail'
              >{item.name}</Text>
              <View style={styles.transactionDetails}>
                <Text style={styles.transactionAmount}>
                  {" "}
                  {item.amount < 0 && "-"} ${Math.abs(item.amount)}
                </Text>
                <Text style={styles.transactionDate}>{item.date}</Text>
              </View>
            </View>
          )}
        />
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingVertical: 20,
    paddingHorizontal: 20,
    backgroundColor: "#FFFFFF",
  },
  icon: {
    width: 24,
    height: 24,
    borderRadius: 12,
    marginRight: 10,
  },
  iconImage: {
    width: 24,
    height: 24,
    borderRadius: 12,
  },
  lastItem: {
    borderBottomWidth: 0,
  },
  card: {
    flex: 1,
  },
  title: { fontSize: 18, fontWeight: "bold", color: "#4A4A4A" },
  transactionHeader: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    padding: 15,
  },
  transactionTitle: {
    fontSize: 16,
    fontWeight: "600",
    flex: 1,
    marginRight: 10,
  },
  transactionDetails: {
    flexDirection: "column",
    alignItems: "flex-end",
  },
  transactionAmount: { fontSize: 16, fontWeight: "600" },
  transactionDate: { fontSize: 12, color: "#888" },
  list:{
    borderRadius: 15,
    paddingVertical: 15,
    paddingHorizontal: 10,
    borderWidth: 1,
    borderColor: "#EFEFF1",
  }
});

export default CategoryDetailScreen;
