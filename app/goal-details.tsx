import { Image, Pressable, ScrollView, StyleSheet, Text, TextInput, View } from 'react-native';
import React, { useEffect, useState } from 'react';
import { useLocalSearchParams, useRouter } from 'expo-router';
import ToggleSwitch from '@/components/Goals/SwithPressable';
import icono_meta from '../assets/images/goals/goal-icon.png'
import icono_lista from '../assets/images/goals/list-icon.png'
import icono_ahorro from '../assets/images/goals/saving-icon.png'
import icono_inicial from '../assets/images/goals/initial-money-icon.png'
import { Ionicons } from '@expo/vector-icons';

const savingMoney = 50000;

// Función para formatear moneda modificada para manejar valores undefined
const formatCurrency = (value: string | undefined): string => {
  // Si el valor es undefined o null, retorna formato base
  if (value === undefined || value === null) return '$ 0';
  
  // Elimina cualquier carácter no numérico
  const numericValue = value.toString().replace(/[^0-9.]/g, '');
  
  // Si está vacío, retorna formato base
  if (!numericValue) return '$ 0';
  
  // Convierte a número y formatea
  const number = parseFloat(numericValue);
  if (isNaN(number)) return '$ 0';
  
  // Formatea el número con comas y dos decimales si los tiene
  return `$ ${number.toLocaleString('en-US', {
    minimumFractionDigits: 0,
    maximumFractionDigits: 2
  })}`;
};

// Función para quitar el formato de moneda modificada para manejar valores undefined
const unformatCurrency = (value: string | undefined): string => {
  if (value === undefined || value === null) return '0';
  return value.toString().replace(/[^0-9.]/g, '');
};

const GoalDetails = () => {
  const { q_goal_title, q_goal_amount, q_initial_amount, q_goal_description, q_plazo } = useLocalSearchParams();

  console.log("goal description: ", q_goal_description);
  console.log("goal plazo: ", q_plazo);

  
  const [user_text, setuser_text] = useState('')

  const [goalTitle, setGoalTitle] = useState<string>(Array.isArray(q_goal_title) ? q_goal_title[0] : q_goal_title || '');
  const [goalAmount, setGoalAmount] = useState<string>(formatCurrency(Array.isArray(q_goal_amount) ? q_goal_amount[0] : q_goal_amount || '0'));
  const [initialAmountValue, setInitialAmountValue] = useState<string>(formatCurrency(Array.isArray(q_initial_amount) ? q_initial_amount[0] : q_initial_amount || '0'));
  const [goalDescription, setGoalDescription] = useState<string>(Array.isArray(q_goal_description) ? q_goal_description[0] : q_goal_description || '');

  const [monthlySavings, setMonthlySavings] = useState<string>(formatCurrency('0'));

  const [monthsToGoal, setMonthsToGoal] = useState<string>('0');


  const [isUpdatingMonths, setIsUpdatingMonths] = useState<boolean>(false);
  const [isMoneyOptimized, setIsMoneyOptimized] = useState<boolean>(true);

  const router = useRouter();

  // Calcula los meses cuando cambia el monto mensual
  useEffect(() => {
    if (isUpdatingMonths) return;

    const monthlyAmount = parseFloat(unformatCurrency(monthlySavings));
    const targetAmount = parseFloat(unformatCurrency(goalAmount));
    
    if (monthlyAmount > 0 && targetAmount > 0) {
      const months = targetAmount / monthlyAmount;
      setIsUpdatingMonths(true);
      setMonthsToGoal(months.toFixed(2));
      setIsUpdatingMonths(false);
    }
  }, [monthlySavings, goalAmount]);


  // Calcula el monto mensual cuando cambian los meses
  useEffect(() => {
    if (!isUpdatingMonths) return;

    const months = parseFloat(monthsToGoal);
    const targetAmount = parseFloat(unformatCurrency(goalAmount));
    
    if (months > 0 && targetAmount > 0) {
      const monthly = targetAmount / months;
      setMonthlySavings(formatCurrency(monthly.toString()));
    }
  }, [monthsToGoal, goalAmount]);

  // Manejador para actualizar los meses
  const handleMonthsChange = (text: string) => {
    setIsUpdatingMonths(true);
    setMonthsToGoal(text);
    
    // Si el texto está vacío o no es un número válido, no calculamos nada
    const months = parseFloat(text);
    if (isNaN(months) || months <= 0) {
      return;
    }

    const targetAmount = parseFloat(unformatCurrency(goalAmount));
    if (targetAmount > 0) {
      const monthly = targetAmount / months;
      setMonthlySavings(formatCurrency(monthly.toString()));
    }
  };

  // Manejador para actualizar el monto mensual
  const handleMonthlySavingsChange = (text: string) => {
    const unformattedValue = unformatCurrency(text);
    setIsUpdatingMonths(false);
    setMonthlySavings(formatCurrency(unformattedValue));
    
    // Si el texto está vacío o no es un número válido, no calculamos nada
    const monthly = parseFloat(unformattedValue);
    if (isNaN(monthly) || monthly <= 0) {
      return;
    }

    const targetAmount = parseFloat(unformatCurrency(goalAmount));
    if (targetAmount > 0) {
      const months = targetAmount / monthly;
      setMonthsToGoal(months.toFixed(2));
    }
  };

  // Manejador para el monto objetivo
  const handleGoalAmountChange = (text: string) => {
    const unformattedValue = unformatCurrency(text);
    setGoalAmount(formatCurrency(unformattedValue));
  };

  // Manejador para el monto inicial
  const handleInitialAmountChange = (text: string) => {
    const unformattedValue = unformatCurrency(text);
    setInitialAmountValue(formatCurrency(unformattedValue));
  };

  const handleBack = () => {
    console.log('hola');
    router.back()
  }

  useEffect(() => {
    const plazo = Array.isArray(q_plazo) ? q_plazo[0] : q_plazo || '0'
    setMonthsToGoal(plazo)
    const amount = unformatCurrency(goalAmount)
    
    if(parseInt(plazo) != 0)
      setMonthlySavings((parseFloat(amount)/parseFloat(plazo)).toFixed(2).toString())
  }, [])
  

  return (
    <ScrollView style={{ flex: 1, backgroundColor: 'white', paddingVertical: 30 }}>
      <View style={{ flexDirection: 'row', alignItems: 'center' }}>
        <Pressable 
          onPress={() => handleBack()}
          style={({ pressed }) => [
            {flexDirection: 'row', alignItems: 'center', position: 'absolute', left: 0, zIndex: 10},
            { opacity: pressed ? 0.7 : 1},
          ]}>
          <Ionicons name='chevron-back-outline' size={20} />
          <Text style={{ fontSize: 18, color: 'black', marginLeft: 5 }}>Return</Text>
        </Pressable>
        <Text style={{ fontSize: 25, fontWeight: '500', textAlign: 'center', flex: 1, color: 'black' }}>Create Goal</Text>
      </View> 

      <View style={{ paddingHorizontal: 30 }} >
        <View style={{ margin: 20 }}>
          <Text style={styles.label}>Goal Name *</Text>
          <View style={{ flexDirection: 'row', borderBottomWidth: 1, borderColor: '#bbbbbb', marginBottom: 20 }} >
            <View style={{ flex: 1, justifyContent: 'center' }} >
              <Image source={icono_meta} style={{ width: 30, height: 30 }} />
            </View>
            <TextInput 
              style={styles.input}
              value={goalTitle}
              onChangeText={setGoalTitle}
              placeholder='Enter your goal name'
            />
          </View>

          <Text style={styles.label}>Goal Description</Text>
          <View style={{ flexDirection: 'row', borderBottomWidth: 1, borderColor: '#bbbbbb', marginBottom: 20 }} >
            <View style={{ flex: 1, justifyContent: 'center' }} >
              <Image source={icono_lista} style={{ width: 30, height: 30 }} />
            </View>
            <TextInput 
              style={styles.input}
              value={goalDescription}
              onChangeText={setGoalDescription}
              placeholder='Describe your goal'
              multiline
            />
          </View>

          <Text style={styles.label}>Target Amount *</Text>
          <View style={{ flexDirection: 'row', borderBottomWidth: 1, borderColor: '#bbbbbb', marginBottom: 20 }} >
            <View style={{ flex: 1, justifyContent: 'center' }} >
              <Image source={icono_ahorro} style={{ width: 30, height: 30, transform: [{ scaleX: -1 }] }} />
            </View>
            <TextInput 
              style={styles.input}
              value={goalAmount}
              onChangeText={handleGoalAmountChange}
              placeholder='Enter target amount'
              keyboardType="numeric"
            />
          </View>

          <Text style={styles.label}>Initial Amount *</Text>
          <View style={{ flexDirection: 'row', borderBottomWidth: 1, borderColor: '#bbbbbb', marginBottom: 20 }} >
            <View style={{ flex: 1, justifyContent: 'center' }} >
              <Image source={icono_inicial} style={{ width: 32, height: 32 }} />
            </View>
            <TextInput 
              style={styles.input}
              value={initialAmountValue}
              onChangeText={handleInitialAmountChange}
              placeholder='Initial amount saved'
              keyboardType="numeric"
            />
          </View>
        </View>

        <View style={styles.summaryContainer}>
          <Text style={styles.savingsLabel}>Monthly Savings Goal: {formatCurrency(savingMoney.toString())}</Text>

          <View>
            <View style={{ marginVertical: 10 }}>
              <Text style={styles.label}>Monthly Savings *</Text>
              <TextInput 
                style={styles.input}
                value={monthlySavings}
                onChangeText={handleMonthlySavingsChange}
                placeholder='Amount to save each month'
                keyboardType="numeric"
              />
            </View>

            <View style={{ marginVertical: 10 }}>
              <Text style={styles.label}>Months to Goal *</Text>
              <TextInput 
                style={styles.input}
                value={monthsToGoal}
                onChangeText={handleMonthsChange}
                placeholder='Months required'
                keyboardType="numeric"
              />
            </View>
          </View>

          <View style={{ alignItems: 'center' }} >
            <Text style={styles.savingsLabel}>Savings Plans</Text>
            <ToggleSwitch isMoneyOptimized={isMoneyOptimized} setIsMoneyOptimized={setIsMoneyOptimized} />
          </View>
        </View>

        <Pressable 
          style={{ 
            marginVertical: 20, 
            backgroundColor: '#1f8338', 
            paddingVertical: 8, 
            width: '60%', 
            alignSelf: 'center', 
            borderRadius: 10, 
            borderWidth: 1, 
            borderColor: '#165d26' 
          }}
          onPress={handleBack}
        >
          <Text style={{ textAlign: 'center', fontSize: 16, fontWeight: '500', color: 'white' }}>Save Goal</Text>
        </Pressable>
      </View>
    </ScrollView>
  );
};

export default GoalDetails;

const styles = StyleSheet.create({
  input: {
    textAlign: 'left',
    fontSize: 18,
    borderRadius: 8,
    paddingVertical: 8,
    color: '#333',
    flex: 7,
  },
  label: {
    fontSize: 16,
    color: '#555',
    fontWeight: '500',
    marginBottom: 2,
  },
  summaryContainer: {
    paddingHorizontal: 20,
    backgroundColor: '#ffffff',
    paddingTop: 30,
    borderTopLeftRadius: 30,
    borderTopRightRadius: 30,
    borderWidth: 1,
    borderColor: '#19ac09',
  },
  savingsLabel: {
    fontSize: 18,
    textAlign: 'center',
    color: '#333',
    fontWeight: '600',
    marginBottom: 0,
  }
});