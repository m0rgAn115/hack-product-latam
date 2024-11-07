import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

interface Parameter {
  title: string;
  percentage: number;
  status: string;
  statusColor: string;
  showMore: boolean;
}

interface ParameterListProps {
  parameters: Parameter[];
}

const ParameterList: React.FC<ParameterListProps> = ({ parameters }) => {
  return (
    <View style={styles.container}>
      {parameters.map((param, index) => (
        <View
          key={index}
          style={[
            styles.parameterContainer,
            { borderBottomWidth: index < parameters.length - 1 ? 1 : 0 },
            { marginTop: index === 0 ? 0 : 10 }
          ]}
        >
          <View style={styles.row}>
            <Text style={styles.titleText}>{param.title}</Text>
            <Text style={styles.percentageText}>{param.percentage}%</Text>
          </View>
          <View style={[styles.row, { marginBottom: param.showMore ? 18 : 0 }]}>
            
            <Text style={[
                styles.statusText,
                { color: 
                    param.percentage > 80 ? 'green' :  // Sobresaliente
                    param.percentage > 60 ? 'blue' :  // Bueno
                    param.percentage > 40 ? 'orange' :  // Aceptable
                    param.percentage > 20 ? 'yellow' :  // Mejorable
                    'red'  // Deficiente
                }
              ]}
            >
              {
                param.percentage > 80
                ? 'Excelente'
                : param.percentage > 60
                ? 'Bueno'
                : param.percentage > 40
                ? 'Regular'
                : param.percentage > 20
                ? 'Bajo'
                : 'Crítico'
              }
            </Text>
            
            {param.showMore && (
                <Text style={styles.showMoreText}>Conocer más {'>'}</Text>
            )}
            
          </View>
        </View>
      ))}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: '5%',
    borderWidth: 1,
    borderColor: '#E3E3E5',
    borderRadius: 10,
  },
  parameterContainer: {
    borderColor: '#E3E3E5',
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 15,
  },
  titleText: {
    color: '#67677A',
    fontFamily: 'DMSans_700Bold',
    fontSize: 16,
  },
  percentageText: {
    color: '#303048',
    fontFamily: 'DMSans_700Bold',
    fontSize: 15,
    opacity: 0.8,
  },
  statusText: {
    fontFamily: 'DMSans_500Medium',
    fontSize: 14,
    opacity: 0.6,
  },
  showMoreText: {
    color: '#0066FF',
    fontFamily: 'DMSans_500Medium',
    fontSize: 14,
    opacity: 0.8,
  },
});

export default ParameterList;