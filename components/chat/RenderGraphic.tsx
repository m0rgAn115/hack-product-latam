import { Dimensions, View } from 'react-native';
import React from 'react';
import { Transaction } from '../Interfaces/transaction.interface';
import { BarChart, LineChart } from 'react-native-chart-kit';

interface GraphPerMonthProps {
  transactions: Transaction[];
  chart_info: {
    transactions: Transaction[],
    chart_type: 'barras' | 'lineas',
    categoria: string[],
    fecha_final: string,
    fecha_inicial: string,
  }
}

export const RenderGraphic = ({ transactions, chart_info }: GraphPerMonthProps) => {
  const { categoria, fecha_inicial, fecha_final, chart_type } = chart_info;

  console.log(fecha_inicial, fecha_final, categoria);

  // Filtrar las transacciones por fecha inicial, fecha final y categoría
  const filteredTransactions = transactions.filter(transaction => {
    const transactionDate = new Date(transaction.date);
    const startDate = new Date(fecha_inicial);
    const endDate = new Date(fecha_final);
    
    const isInDateRange = transactionDate >= startDate && transactionDate <= endDate;

    // Ajuste aquí: verifica si la categoría está en el arreglo de categorías
    const isCategoryMatch = categoria.includes('todos') || categoria.some(cat => transaction.category.includes(cat));

    return isInDateRange && isCategoryMatch;
  });

  // Ordenar las transacciones filtradas por fecha y multiplicar el monto por -1
  const sortedTransactions = filteredTransactions
    .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())
    .map(transaction => ({
      ...transaction,
      amount: transaction.amount * -1
    }));

  // Agrupar gastos por día
  const expensesByDay = sortedTransactions.reduce((acc: { [date: string]: number }, transaction) => {
    const date = transaction.date;
    if (!acc[date]) {
      acc[date] = 0;
    }
    acc[date] += transaction.amount;
    return acc;
  }, {});

  // Obtener las fechas para el eje X
  const dates = Object.keys(expensesByDay).sort((a, b) => new Date(a).getTime() - new Date(b).getTime());
  const days = dates.map(date => new Date(date).getUTCDate().toString());

  console.log(filteredTransactions);

  // Preparar los datos para la gráfica
  const chartData = {
    labels: days,
    datasets: [
      {
        data: dates.map(date => expensesByDay[date]),
      },
    ],
  };

  return (
    <View>
      {chart_type === 'lineas' && (
        <LineChart
          data={chartData}
          width={Dimensions.get('window').width - 110}
          height={170}
          yAxisLabel="$"
          yAxisSuffix=""
          yAxisInterval={1}
          fromZero
          chartConfig={{
            backgroundColor: '#ffffff',
            backgroundGradientFrom: '#ffffff',
            backgroundGradientTo: '#ffffff',
            decimalPlaces: 0,
            color: (opacity = 1) => `rgba(98, 0, 238, ${opacity})`,
            labelColor: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`,
            style: {
              borderRadius: 16,
              borderColor: '#d3ebfe'
            },
            propsForBackgroundLines: {
              offsetX: 20,
            },
            propsForDots: {
              r: '4',
              strokeWidth: '2',
              stroke: '#6200EE',
            },
          }}
          bezier
          style={{
            marginTop: 0,
            marginBottom: 0,
            borderRadius: 16,
          }}
        />
      )}

      {chart_type === 'barras' && (
        <BarChart
          data={chartData}
          width={Dimensions.get('window').width - 110}
          height={170}
          yAxisLabel="$"
          yAxisSuffix=""
          yAxisInterval={1}
          fromZero
          chartConfig={{
            backgroundColor: '#ffffff',
            backgroundGradientFrom: '#ffffff',
            backgroundGradientTo: '#ffffff',
            decimalPlaces: 0,
            color: (opacity = 1) => `rgba(98, 0, 238, ${opacity})`,
            labelColor: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`,
            style: {
              borderRadius: 16,
              borderColor: '#d3ebfe'
            },
            propsForBackgroundLines: {
              offsetX: 20,
            },
            propsForDots: {
              r: '4',
              strokeWidth: '2',
              stroke: '#6200EE',
            },
          }}
          style={{
            marginTop: 0,
            marginBottom: 0,
            borderRadius: 16,
          }}
        />
      )}
    </View>
  );
};
