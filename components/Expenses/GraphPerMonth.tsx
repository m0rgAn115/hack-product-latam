import { LineChart } from 'react-native-chart-kit';
import { Dimensions, View } from 'react-native';
import React from 'react';
import { Transaction } from '../Interfaces/transaction.interface';
import { categoryColors } from './CategoryCard';

interface GraphPerMonthProps {
  transactions: Transaction[];
  category: string; // Se añadirá la categoría para poder determinar el color
}

const GraphPerMonth: React.FC<GraphPerMonthProps> = ({ transactions, category }) => {
  // Obtener el color de la categoría
  const chartColor = categoryColors[category as keyof typeof categoryColors] || '#6200EE';

  // Ordenar transacciones por fecha
  transactions.sort((a, b) => new Date(a.fecha).getTime() - new Date(b.fecha).getTime());

  // Agrupar gastos por día y mantener fechas completas
  const expensesByDay = transactions.reduce((acc: { [date: string]: number }, transaction) => {
    const date = transaction.fecha;
    if (!acc[date]) {
      acc[date] = 0;
    }
    acc[date] += Math.abs(transaction.monto); // Asegurarse de que los valores sean absolutos
    return acc;
  }, {});

  // Obtener los días en orden para el eje X
  const dates = Object.keys(expensesByDay).sort((a, b) => new Date(a).getTime() - new Date(b).getTime());
  const days = dates.map(date => new Date(date).getUTCDate().toString()); // Usar el día como etiqueta en el eje X

  // Preparar los datos para la gráfica
  const chartData = {
    labels: days, // Usamos solo el día para el eje X
    datasets: [
      {
        data: dates.map(date => expensesByDay[date]), // No es necesario Math.abs aquí porque ya lo aplicamos en el acumulador
      },
    ],
  };

  return (
    <View style={{ marginTop: 30 }}>
      <LineChart
        data={chartData}
        width={Dimensions.get('window').width - 40} // Reduce el ancho total para agregar espacio en los bordes
        height={220} // Aumenta un poco la altura para mejor visualización
        yAxisLabel="$"
        yAxisSuffix=""
        yAxisInterval={1} // Intervalo en el eje Y para que coincida con tus datos
        fromZero // Inicia el eje Y en cero
        chartConfig={{
          backgroundColor: '#ffffff',
          backgroundGradientFrom: '#ffffff',
          backgroundGradientTo: '#ffffff',
          decimalPlaces: 0, // Sin decimales
          color: (opacity = 1) => chartColor, // Aplicar el color dinámicamente
          labelColor: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`,
          style: {
            borderRadius: 16,
          },
          propsForBackgroundLines: {
            offsetX: 20,
          },
          propsForDots: {
            r: '4',
            strokeWidth: '2',
            stroke: chartColor, // Color de los puntos según la categoría
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