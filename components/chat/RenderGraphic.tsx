import { Dimensions, View, Text } from 'react-native';
import React from 'react';
import { useState } from 'react';
import { LineChart } from 'react-native-chart-kit';
import { MainCategories } from '@/components/Expenses/categoriesConfig';
import { BarChart } from 'react-native-gifted-charts';


interface PlaidTransaction {
  date: string;
  amount: number;
  logo_url?: string;
  merchant_name?: string;
  name: string;
  category: string[];
  mainCategory?: keyof MainCategories | "Others";
}

interface GraphPerMonthProps {
  PlaidTransaction: PlaidTransaction[];
  chart_info: {
    transactions: PlaidTransaction[],
    chart_type: 'barras' | 'lineas',
    categoria: string[],
    fecha_final: string,
    fecha_inicial: string,
  }
}

export const RenderGraphic = ({ PlaidTransaction, chart_info }: GraphPerMonthProps) => {
  const { categoria, fecha_inicial, fecha_final, chart_type } = chart_info;
  const [containerWidth, setContainerWidth] = useState(0);
  console.log(PlaidTransaction);
  console.log(fecha_inicial, fecha_final, categoria);

  // Filtrar las transacciones por fecha inicial, fecha final y categoría
  // Asegúrate de que 'categoria' es un array de strings
  const filteredTransactions = PlaidTransaction.filter((transaction: PlaidTransaction) => {
    const transactionDate = new Date(transaction.date);
    const startDate = new Date(fecha_inicial);
    const endDate = new Date(fecha_final);

    const isInDateRange = transactionDate >= startDate && transactionDate <= endDate;

    // Verifica si la categoría coincide con alguna en el array de 'categoria'
    const isCategoryMatch = categoria.includes('todos') || 
      categoria.some(cat => transaction.category.includes(cat));

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
    if (!acc[date] && transaction.amount > 0) {
      acc[date] = 0;
    }
    if (transaction.amount > 0){
      acc[date] += transaction.amount;
    }
    
    return acc;
  }, {});

  console.log(expensesByDay);

  // Obtener las fechas para el eje X
  const dates = Object.keys(expensesByDay).sort((a, b) => new Date(a).getTime() - new Date(b).getTime());
  const days = dates.map(date => new Date(date).getUTCDate().toString());

  const monthNames = [
    "Ene", "Feb", "Mar", "Abr", "May", "Jun", 
    "Jul", "Ago", "Sep", "Oct", "Nov", "Dic"
  ];
  
  const barData = Object.entries(expensesByDay).map(([date, value]) => {
    const dateObj = new Date(date);
    const day = dateObj.getUTCDate().toString(); // Obtiene el día del mes
    const month = monthNames[dateObj.getUTCMonth()]; // Obtiene el nombre del mes
  
    // Combina el día y el mes como etiqueta
    const dayMonthLabel = `${day} ${month}`; // Ejemplo: '10 Junio'
  
    return {
      value,
      label: dayMonthLabel,
    };
  });

  console.log(barData);

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
        
        <View
      style={{
        margin: 10,
        padding: 16,
        borderRadius: 20,
        backgroundColor: '#ffffff',
      }}
      onLayout={(event) => {
        const {width} = event.nativeEvent.layout;
        setContainerWidth(width);
      }}>
      <Text style={{color: 'black', fontSize: 16, fontWeight: 'bold'}}>
        Resumen de gastos
      </Text>
      <View style={{padding: 20}}>
        {containerWidth > 0 && (
          <BarChart
            data={barData}
            width={containerWidth - 125}
            height={300}
            barWidth={40}
            spacing={2}
            xAxisThickness={1}
            yAxisThickness={0}
            yAxisTextStyle={{color: 'black'}}
            xAxisLabelTextStyle={{color: 'black'}}
            labelWidth={40}
            yAxisLabelWidth={60}
            noOfSections={7}
            isAnimated={true}
            // barBorderRadius={7}
            barBorderBottomRightRadius={0}
            barBorderBottomLeftRadius={0}
            yAxisLabelPrefix="$"
            rotateLabel={true}
            frontColor="#20B2AA"
            renderTooltip={(item, index) => {
              return (
                <View style={{
                  backgroundColor: 'black',
                  padding: 10,
                  borderRadius: 4,
                }}>
                  <Text style={{
                    color: 'white',
                    fontSize: 14,
                  }}>${item.value}</Text>
                </View>
              );
            }}
          />
        )}
      </View>
    </View>
      

        // <BarChart
        //   data={chartData}
        //   width={Dimensions.get('window').width - 110}
        //   height={170}
        //   yAxisLabel="$"
        //   yAxisSuffix=""
        //   yAxisInterval={1}
        //   fromZero
        //   chartConfig={{
        //     backgroundColor: '#ffffff',
        //     backgroundGradientFrom: '#ffffff',
        //     backgroundGradientTo: '#ffffff',
        //     decimalPlaces: 0,
        //     color: (opacity = 1) => `rgba(98, 0, 238, ${opacity})`,
        //     labelColor: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`,
        //     style: {
        //       borderRadius: 16,
        //       borderColor: '#d3ebfe'
        //     },
        //     propsForBackgroundLines: {
        //       offsetX: 20,
        //     },
        //     propsForDots: {
        //       r: '4',
        //       strokeWidth: '2',
        //       stroke: '#6200EE',
        //     },
        //   }}
        //   style={{
        //     marginTop: 0,
        //     marginBottom: 0,
        //     borderRadius: 16,
        //   }}
        // />
      )}
    </View>
  );
};
