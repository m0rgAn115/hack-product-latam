import React from 'react';
import { View, Text, FlatList, StyleSheet } from 'react-native';
import { Category_Transactions } from '../Interfaces/transaction.interface';
import { Icons } from './iconsConfig';
import { iconColors } from './iconsConfig';

interface ComponentProps {
    category: Category_Transactions['category'];
    transacciones: Category_Transactions['transacciones'];
}

const CategoryCard = ({ category, transacciones }: ComponentProps) => {
    const totalCategory = transacciones.reduce((sum, t) => sum + t.monto, 0);

    return (
        <View style={styles.categoryContainer}>
          <View style={styles.header}>
            <View>
                  {Icons[category.icon].iconName}
            </View>
            <Text style={styles.categoryTitle}>{category.name}</Text>
            <Text style={styles.categoryTotal}>${totalCategory}</Text>
          </View>
            <FlatList
                data={transacciones}
                keyExtractor={(transaction) => transaction.titulo}
                renderItem={({item}) => {
                  const porcentaje = (item.monto / totalCategory) * 100;
                  return (
                    <View style={styles.transactionContainer}>
                      <View style={styles.transactionDetails}>
                        <Text style={styles.transactionTitle}>{item.titulo}</Text>
                        <Text style={styles.transactionAmount}>${item.monto}</Text>
                      </View>
                      <View style={styles.progressBarContainer}>
                        <View style={styles.progressBarBackground}>
                          <View style={[styles.progressBar, { width: `${porcentaje}%`, backgroundColor:iconColors[category.icon]  }]} />
                        </View>
                        <Text style={styles.transactionDate}>{item.fecha}</Text>
                      </View>
                    </View>
                  );
                }}
            >
            </FlatList>
        </View>
    )
}

const styles = StyleSheet.create({
    categoryContainer: {
      marginVertical: 10,
      marginHorizontal: 30,
      paddingHorizontal: 15,
      backgroundColor: '#FFFFFF',
      borderRadius: 15,
      padding: 15,
      borderWidth: 1,
      borderColor: '#E0E0E0',
      // shadowColor: '#000',
      // shadowOffset: { width: 0, height: 2 },
      // shadowOpacity: 0.1,
      // shadowRadius: 8,
      // elevation: 5,
    },
    header: {
      flexDirection: 'row',
      alignItems: 'center',
      marginBottom: 10,
    },
    categoryTitle: {
      fontSize: 18,
      fontWeight: 'bold',
      color: '#4F4F4F',
      flex: 1,
    },
    categoryTotal: {
      fontSize: 16,
      fontWeight: 'bold',
      color: '#4F4F4F',
    },
    transactionContainer: {
      flexDirection: 'column',
      marginBottom: 10,
    },
    transactionDetails: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
    },
    transactionTitle: {
      fontSize: 16,
      fontWeight: 'bold',
      color: '#333',
    },
    transactionAmount: {
      fontSize: 16,
      fontWeight: 'bold',
      color: '#333',
    },
    transactionDate: {
      fontSize: 13,
      color: '#A0A0A0',
      marginLeft: 30,
    },
    progressBarContainer: {
      flexDirection: 'row',
      alignItems: 'center',
      marginTop: 10,
      
    },
    progressBarBackground: {
      backgroundColor: '#E0E0E0', // Color de fondo para simular la barra completa
      borderRadius: 2,
      flex: 1,
    },
    progressBar: {
        height: 4,
        borderRadius: 2,
    },
});

export default CategoryCard;