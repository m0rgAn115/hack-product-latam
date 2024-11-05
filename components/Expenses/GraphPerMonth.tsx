import { LineChart } from 'react-native-chart-kit';
import { Dimensions, View } from 'react-native';
import React from 'react';
import { Transaction } from '../Interfaces/transaction.interface';

interface GraphPerMonthProps {
  transactions: Transaction[];
}

const GraphPerMonth: React.FC<GraphPerMonthProps> = ({ transactions }) => {
  // Ordenar transacciones por fecha
  transactions.sort((a, b) => new Date(a.fecha).getTime() - new Date(b.fecha).getTime());

  // Agrupar gastos por día y mantener fechas completas
  const expensesByDay = transactions.reduce((acc: { [date: string]: number }, transaction) => {
    const date = transaction.fecha;
    if (!acc[date]) {
      acc[date] = 0;
    }
    acc[date] += transaction.monto;
    return acc;
  }, {});

  // Obtener solo los días en orden para el eje X
  const dates = Object.keys(expensesByDay).sort((a, b) => new Date(a).getTime() - new Date(b).getTime());
  const days = dates.map(date => new Date(date).getUTCDate().toString()); // Extrae el día sin cambiar la zona horaria

  // Preparar los datos para la gráfica
  const chartData = {
    labels: days, // Usamos solo el día para el eje X
    datasets: [
      {
        data: dates.map(date => expensesByDay[date]),
      },
    ],
  };

  return (
    <View style={{ alignItems: 'center', padding: 16 }}>
      <LineChart
        data={chartData}
        width={Dimensions.get('window').width - 23} // Reduce el ancho total para agregar espacio en los bordes
        height={170}
        yAxisLabel="$"
        yAxisSuffix=""
        yAxisInterval={1} // Ajuste el intervalo del eje Y para que coincida con tus datos
        fromZero // Inicia el eje Y en cero
        chartConfig={{
          backgroundColor: '#ffffff',
          backgroundGradientFrom: '#ffffff',
          backgroundGradientTo: '#ffffff',
          decimalPlaces: 0, // Sin decimales
          color: (opacity = 1) => `rgba(98, 0, 238, ${opacity})`,
          labelColor: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`,
          style: {
            borderRadius: 16,
          },
          propsForBackgroundLines: {
            offsetX: 20, // Ajuste del margen para líneas de fondo
          },
          propsForDots: {
            r: '4',
            strokeWidth: '2',
            stroke: '#6200EE',
          },
        }}
        bezier
        style={{
          marginTop: -20,
          marginBottom: 25,
          borderRadius: 16,
        }}
      />
    </View>
  );
};

export default GraphPerMonth;
