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
        <Text style={styles.title}>
          ¡Cuidado! {Icons[iconKey].iconName}
        </Text>
        <Text style={styles.alertText}>
            {message}
        </Text>
        <TouchableOpacity style={styles.linkContainer}>
          <Text style={styles.link}>Conocer más ›</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  alertContainer: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    backgroundColor: '#FFFFFF', // Fondo suave para la alerta
    padding: 15,
    borderRadius: 15,
    marginTop: -30,
    marginBottom: 10,
    marginHorizontal: 30,
    borderWidth: 1,
    borderColor: '#E0E0E0',
    // shadowColor: '#000',
    // shadowOffset: { width: 0, height: 2 },
    // shadowOpacity: 0.1,
    // shadowRadius: 8,
    elevation: 2,
  },
  icon: {
    width: 30,
    height: 30,
    marginRight: 10,
    resizeMode: 'contain',
  },
  textContainer: {
    flex: 1,
  },
  title: {
    fontSize: 16,
    color: '#FF9900',
    fontWeight: 'bold',
    marginBottom: 5,
  },
  alertText: {
    fontSize: 14,
    color: '#333',
    marginBottom: 8,
  },
  smallIcon: {
    width: 18,
    height: 18,
    marginLeft: 5,
    resizeMode: 'contain',
  },
  linkContainer: {
    alignSelf: 'flex-end'
  },
  link: {
    fontSize: 14,
    color: '#007BFF',
    fontWeight: 'bold',
  },
});

export default AlertCard;