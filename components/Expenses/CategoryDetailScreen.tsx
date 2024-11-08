import React from "react";
import { View, Text, FlatList, StyleSheet, Dimensions } from "react-native";
import { LineChart } from "react-native-chart-kit";
import { RouteProp } from "@react-navigation/native";
import { TouchableOpacity } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useNavigation, NavigationProp } from "@react-navigation/native";
import { categoryColors } from "./CategoryCard";
import { Image } from "react-native";

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
  subscriptions: undefined;
};
type CategoryDetailScreenRouteProp = RouteProp<
  RootStackParamList,
  "CategoryDetail"
>;

interface CategoryDetailScreenProps {
  route: CategoryDetailScreenRouteProp;
}

const screenWidth = Dimensions.get("window").width;

const CategoryDetailScreen: React.FC<CategoryDetailScreenProps> = ({
  route,
}) => {
  const navigation = useNavigation<NavigationProp<RootStackParamList>>();
  const { category, transactions } = route.params;

  // Obtener el color de la categoría
  const chartColor =
    categoryColors[category as keyof typeof categoryColors] || "#6200EE";

  // Ajustar las etiquetas del eje X y el formato de datos
  const labels = transactions.map((t, index) =>
    index % 2 === 0 ? t.name : ""
  ); // Mostrar solo cada segundo nombre para evitar amontonamiento
  const dataValues = transactions.map((t) => Math.abs(t.amount)); // Usar solo valores absolutos

  return (
    <View style={styles.container}>
      <View style={styles.headerContainer}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => navigation.navigate("Home")}>
          <Ionicons
            name="chevron-back"
            size={24}
            color="#4A4A4A"
          />
        </TouchableOpacity>
        <Text style={styles.title}>Expenses in {category}</Text>
      </View>
      {/* Gráfico de gastos */}
      <LineChart
        data={{
          labels: labels,
          datasets: [{ data: dataValues }],
        }}
        width={screenWidth - 40} // Ajusta el ancho de la pantalla
        height={220}
        yAxisLabel="$"
        yAxisSuffix=""
        yAxisInterval={1}
        chartConfig={{
          backgroundColor: "#ffffff",
          backgroundGradientFrom: "#ffffff",
          backgroundGradientTo: "#ffffff",
          color: (opacity = 1) => chartColor,
          labelColor: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`,
          style: {
            borderRadius: 16,
          },
          propsForBackgroundLines: {
            offsetX: 20,
          },
          propsForDots: {
            r: "4",
            strokeWidth: "2",
            stroke: chartColor,
          },
        }}
        bezier
        style={{
          marginBottom: 25,
          borderRadius: 16,
        }}
      />
      {/* Lista de transacciones */}
      <View style={styles.card}>
        <FlatList
          data={transactions}
          keyExtractor={(item) => item.name + item.date}
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
              <Text style={styles.transactionTitle}>{item.name}</Text>
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
    </View>
  );
};

const styles = StyleSheet.create({
  headerContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    marginTop: 40,
    marginBottom: 40,
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
    borderBottomWidth: 0, // Remueve la línea inferior en el último elemento
  },
  card: {
    backgroundColor: "#FFFFFF",
    borderRadius: 15,
    paddingVertical: 10,
    paddingHorizontal: 10,
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowRadius: 10,
    elevation: 5,
  },
  backButton: {
    position: "absolute",
    left: 0,
  },
  container: {
    flex: 1,
    paddingVertical: 8,
    paddingHorizontal: 16,
    backgroundColor: "#FFFFFF",
  },
  title: { fontSize: 18, fontWeight: "bold", color: "#4A4A4A" },
  transactionHeader: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    padding: 15,
    borderBottomWidth: 1,
    borderBottomColor: "#E0E0E0",
  },
  transactionTitle: {
    fontSize: 16,
    fontWeight: "600",
    color: "#333",
    flex: 1,
  },
  transactionDetails: {
    flexDirection: "column",
    alignItems: "flex-end",
  },
  transactionAmount: { fontSize: 16, fontWeight: "bold", color: "#333" },
  transactionDate: { fontSize: 14, color: "#888" },
});

export default CategoryDetailScreen;
