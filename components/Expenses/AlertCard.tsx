import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Icons } from './iconsConfig';

interface AlertCardProps {
  message: string;
  iconKey: keyof typeof Icons;
}

const AlertCard: React.FC<AlertCardProps> = ({ message, iconKey }) => {
    return (
    <View style={styles.alertContainer}>
      <View style={styles.textContainer}>
        <View style={styles.titleContainer}>
          <Text style={styles.title}>¡Alert!</Text>
          <View style={styles.iconWrapper}>
            {Icons[iconKey].iconName}
          </View>
        </View>
        <Text style={styles.alertText}>{message}</Text>
        <TouchableOpacity style={styles.linkContainer}>
          <Text style={styles.link}>Learn more ›</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  alertContainer: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    backgroundColor: '#FFFFFF',
    padding: 15,
    borderRadius: 15,
    marginTop: 10,
    marginBottom: 10,
    marginHorizontal: 30,
    borderWidth: 1,
    borderColor: '#E0E0E0',
    elevation: 2,
  },
  textContainer: {
    flex: 1,
  },
  titleContainer: {
    flexDirection: 'row',
    alignItems: 'center', // Centra el ícono y el texto verticalmente
  },
  title: {
    fontSize: 16,
    color: '#FF9900',
    fontWeight: 'bold',
    marginBottom: 5,
  },
  iconWrapper: {
    marginLeft: 5,
    alignItems: 'center', // Centra el ícono horizontalmente
    justifyContent: 'center', // Centra el ícono verticalmente
  },
  alertText: {
    fontSize: 14,
    color: '#333',
    marginBottom: 8,
  },
  linkContainer: {
    alignSelf: 'flex-end',
  },
  link: {
    fontSize: 14,
    color: '#007BFF',
    fontWeight: 'bold',
  },
});

export default AlertCard;