import { View, ScrollView,  StyleSheet, Text, FlatList } from 'react-native';
import React, { useState } from 'react';
import Header from '../../components/Expenses/Header';
import AlertCard from '../../components/Expenses/AlertCard';
import MonthSelector from '../../components/Expenses/MonthSelector';
import ExpensesPerMonth from '../../components/Expenses/ExpensesPerMonth'; // Importa los datos
import CategoryCard from '@/components/Expenses/CategoryCard';
import GraphPerMonth from '@/components/Expenses/GraphPerMonth';

const Months_data: string[] = [
    "Enero", "Febrero", "Marzo", "Abril", "Mayo", "Junio",
    "Julio", "Agosto", "Septiembre", "Octubre", "Noviembre", "Diciembre"
];

const Gastos = () => {
  const [mesSeleccionado, setMesSeleccionado] = useState(9);
  const [modalVisible, setModalVisible] = useState(false);

  const monthlyExpenses = ExpensesPerMonth[mesSeleccionado] || [];

  // Calcula el total de gastos del mes
  const totalExpenses = monthlyExpenses.reduce((sumCategory, category) => {
    const totalCategory = category.transacciones.reduce((sumTransaction, transaction) => {
      return sumTransaction + transaction.monto;
    }, 0);
    return sumCategory + totalCategory;
  }, 0);
  const transactions = monthlyExpenses.flatMap(category => category.transacciones);


  return (
    <View style={styles.container}>
        <Header
            onBackPress={() => console.log('Botón de retroceso presionado')}
            onIconPress={() => console.log('Ícono derecho presionado')}
            focused={true}
        />

        <MonthSelector 
            mesSeleccionado={mesSeleccionado}
            setMesSeleccionado={setMesSeleccionado}
            modalVisible={modalVisible}
            setModalVisible={setModalVisible}
            Months_data={Months_data}
        />

        {/* Mostrar el total de gastos de manera dinámica */}
        <Text style={styles.amountText}>${totalExpenses}</Text>

        {/* Graph representing expenses per month */}
        {/* <View style={styles.graphContainer}>
          {totalExpensesPerMonth.map((total, index) => (
            <View key={index} style={styles.barContainer}>
              <View style={[styles.bar, { height: total / 50 }]}/>
              <Text style={styles.monthLabel}>{Months_data[index]}</Text>
              <Text style={styles.expenseLabel}>${total}</Text>
            </View>
          ))}
        </View> */}

        <ScrollView contentContainerStyle={styles.scrollContent}>
          <GraphPerMonth 
            transactions={transactions}
          />

          <AlertCard
            message={`Has gastado $752.0 en Starbucks en ${Months_data[mesSeleccionado]}, con un promedio de $153 por transacción.`}
            iconKey='coffee'
          />

          {/* Lilst de categorías y transacciones */}
          <FlatList
            data={monthlyExpenses}
            keyExtractor={(item, index) => index.toString()}
            renderItem={({ item }) => (
                <CategoryCard
                    category={item.category}
                    transacciones={item.transacciones}
                />
            )}
            scrollEnabled={false} // Desactivar desplazamiento en FlatList
          />
        </ScrollView>

    </View>
  );
};

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
  // graphContainer: {
  //   flexDirection: 'row',
  //   justifyContent: 'space-around',
  //   alignItems: 'flex-end',
  //   height: 200,
  //   marginVertical: 20,
  // },
  // barContainer: {
  //   alignItems: 'center',
  // },
  // bar: {
  //   width: 15,
  //   backgroundColor: '#6200EE',
  // },
  // monthLabel: {
  //   fontSize: 12,
  //   marginTop: 5,
  //   textAlign: 'center',
  // },
  // expenseLabel: {
  //   fontSize: 12,
  //   marginTop: 5,
  //   textAlign: 'center',
  // },
});

export default Gastos;