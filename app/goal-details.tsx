import { Pressable, StyleSheet, Text, View, ScrollView, Platform } from 'react-native';
import React, { useEffect, useState } from 'react';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import DateTimePicker from '@react-native-community/datetimepicker'; // Asegúrate de que esté correctamente importado
import { parseISO, format, differenceInDays } from 'date-fns';

import InputField from '@/components/Goals/InputField';
import Header from '@/components/Header';
import GoalBox from '@/components/Goals/GoalBox';

const formatCurrency = (value: string | undefined): string => {
  if (!value) return '$ 0';
  
  const numericValue = value.toString().replace(/[^0-9.]/g, '');
  if (!numericValue) return '$ 0';

  const number = parseFloat(numericValue);
  return isNaN(number) ? '$ 0' : `$ ${number.toLocaleString('en-US', { minimumFractionDigits: 0, maximumFractionDigits: 2 })}`;
};
const unformatCurrency = (value: string | undefined): string => value ? value.replace(/[^0-9.]/g, '') : '0';

const calculateDaysRemaining = (targetDate: Date): number => {
  const now = new Date();
  const daysToGoal = differenceInDays(targetDate, now);
  return targetDate > now ? Math.max(1, daysToGoal) : 0;
};

const calculateDailySavings = (daysToGoal: number, targetAmount: number, initialAmount: number): number => {
  const remainingAmount = targetAmount - initialAmount;
  return remainingAmount <= 0 ? 0 : remainingAmount / daysToGoal;
};

const getDaysText = (days: number): string => {
  if (days === 1) return 'tomorrow';
  return `${days} days`;
};

const GoalDetails = () => {
  const { q_goal_title, q_goal_amount, q_initial_amount, q_goal_description, q_plazo } = useLocalSearchParams();
  const router = useRouter();
  

  const initialGoalTitle = Array.isArray(q_goal_title) ? q_goal_title[0] : q_goal_title || 'New Goal';
  console.log( "COMPONENTE", initialGoalTitle);

  const [goalTitle, setGoalTitle] = useState<string>(initialGoalTitle);
  const [goalAmount, setGoalAmount] = useState<string>(formatCurrency(Array.isArray(q_goal_amount) ? q_goal_amount[0] : q_goal_amount || '0'));
  const [initialAmountValue, setInitialAmountValue] = useState<string>(formatCurrency(Array.isArray(q_initial_amount) ? q_initial_amount[0] : q_initial_amount || '0'));
  const [goalDescription, setGoalDescription] = useState<string>(Array.isArray(q_goal_description) ? q_goal_description[0] : q_goal_description || '');
  const [monthlySavings, setMonthlySavings] = useState<string>(formatCurrency('0'));
  const [monthsToGoal, setMonthsToGoal] = useState<string>('0');
  const [isUpdatingMonths, setIsUpdatingMonths] = useState<boolean>(false);

  const tomorrow = new Date();
  tomorrow.setDate(tomorrow.getDate() + 1);
  const [targetDate, setTargetDate] = useState<Date | undefined>(tomorrow);
  const [showDatePicker, setShowDatePicker] = useState<boolean>(false);

  useEffect(() => {
    if (!targetDate) return;
    
    const daysToGoal = calculateDaysRemaining(targetDate);
    const targetAmount = parseFloat(unformatCurrency(goalAmount));
    const initialAmount = parseFloat(unformatCurrency(initialAmountValue));
    
    if (daysToGoal > 0) {
      const dailySavings = calculateDailySavings(daysToGoal, targetAmount, initialAmount);
      setMonthlySavings(formatCurrency(dailySavings.toFixed(2)));
    } else {
      setMonthlySavings('$ 0');
    }
  }, [targetDate, goalAmount, initialAmountValue]);

  useEffect(() => {
    if (isUpdatingMonths) {
      const months = parseFloat(monthsToGoal);
      const targetAmount = parseFloat(unformatCurrency(goalAmount));
      if (months > 0 && targetAmount > 0) {
        setMonthlySavings(formatCurrency((targetAmount / months).toString()));
      }
    }
  }, [monthsToGoal, goalAmount]);

  useEffect(() => {
    const plazo = Array.isArray(q_plazo) ? q_plazo[0] : q_plazo || '0';
    setMonthsToGoal(plazo);
    const amount = unformatCurrency(goalAmount);
    if (parseInt(plazo) !== 0) {
      setMonthlySavings((parseFloat(amount) / parseFloat(plazo)).toFixed(2).toString());
    }
  }, [q_plazo, goalAmount]);

  const handleBack = () => {
    router.back();
  };

  const handleInitialAmountChange = (text: string) => {
    const unformattedInitial = unformatCurrency(text);
    const unformattedGoal = unformatCurrency(goalAmount);
    
    // Convertir a números para comparación
    const initialNum = parseFloat(unformattedInitial);
    const goalNum = parseFloat(unformattedGoal);

    // Si el monto inicial es mayor que el objetivo, usar el monto objetivo
    if (initialNum > goalNum) {
      setInitialAmountValue(goalAmount);
    } else {
      setInitialAmountValue(formatCurrency(unformattedInitial));
    }
  };

  const handleGoalAmountChange = (text: string) => {
    const unformattedGoal = unformatCurrency(text);
    const unformattedInitial = unformatCurrency(initialAmountValue);
    
    // Convertir a números para comparación
    const goalNum = parseFloat(unformattedGoal);
    const initialNum = parseFloat(unformattedInitial);

    setGoalAmount(formatCurrency(unformattedGoal));


    if (goalNum < initialNum) {
      setInitialAmountValue(formatCurrency(unformattedGoal));
    }
  };

  const handleDateChange = (event: any, selectedDate?: Date) => {
    const currentDate = selectedDate || targetDate;
    setShowDatePicker(Platform.OS === 'ios' ? true : false); // Mantenerlo abierto para iOS
    setTargetDate(currentDate);
  };
      
  const inputFields = [
    {
      label: "Goal Title",
      value: goalTitle,
      onChangeText: setGoalTitle,
      placeholder: "Enter goal title",
    },
    {
      label: "Goal Description",
      value: goalDescription,
      onChangeText: setGoalDescription,
      placeholder: "Enter goal description",
      multiline: true,
    },
    {
      label: "Goal Amount",
      value: goalAmount,
      onChangeText: handleGoalAmountChange,
      placeholder: "Enter goal amount",
    },
    {
      label: "Initial Amount",
      value: initialAmountValue,
      onChangeText: handleInitialAmountChange,
      placeholder: "Enter initial amount",
    },
    
  ];

  const goal = {
    title: goalTitle,
    description: goalDescription,
    total_amount: parseFloat(unformatCurrency(goalAmount)),
    actual_amount: parseFloat(unformatCurrency(initialAmountValue)),
    deadline: targetDate ? targetDate.toISOString() : '',
  };

  return (
    <SafeAreaView style={styles.container}>
      <Header title={ initialGoalTitle } />
      
      <ScrollView style={styles.form} showsVerticalScrollIndicator={false}>
        <View>
          
          {inputFields.map((field, index) => (
            <InputField
              key={index}
              label={field.label}
              value={field.value}
              onChangeText={field.onChangeText}
              placeholder={field.placeholder}
              multiline={field.multiline}
            />
          ))}

          <View style={styles.datePickerContainer}>
            <Text style={styles.dateLabel}>Target Date</Text>
            <Pressable onPress={() => setShowDatePicker(true)} style={styles.dateInput}>
              <Text style={styles.dateInputText}>
                {targetDate ? targetDate.toLocaleDateString() : 'Select a date'}
              </Text>
            </Pressable>
          </View>

          {showDatePicker && (
            <DateTimePicker
              value={targetDate || new Date()}
              mode="date"
              display="default"
              onChange={handleDateChange}
            />
          )}

          <View>
            <Text style={styles.preview}>
              Goal Preview
            </Text>
            <GoalBox
              goal={goal}
              onPress={() => {}}
            />
            <Text style={styles.calculus}>
              Preview: You need to save {monthlySavings} per day to reach your goal {' '}
              {targetDate ? getDaysText(calculateDaysRemaining(targetDate)) : '0 days'}
            </Text>
          </View>

          <View style={styles.button}>
            <Pressable style={styles.saveButton} onPress={handleBack}>
              <Text style={styles.saveButtonText}>Save Goal</Text>
            </Pressable>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    padding: 20,
  },
  form: {
    flex: 1,
  },
  datePickerContainer: {
    marginBottom: 20,
    backgroundColor: '#f4f4f4',
    padding: 15,
    borderRadius: 8,
  },
  dateLabel: {
    fontSize: 12,
    fontWeight: '600',
    color: '#6C757D',
    marginBottom: 5,
  },
  dateInput: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: 8,
  },
  dateInputText: {
    flex: 1,
    fontSize: 18,
    color: '#000',
    paddingVertical: 0,
    backgroundColor: 'transparent',
  },
  calculus:{
    marginTop: 20,
  },
  preview:{
    fontSize: 24,                 
    fontWeight: '500',            
    color: 'black',   
    marginTop: 10,
    marginBottom: 15,
  },
  button: {
    flexDirection: 'row',
    justifyContent: 'flex-end'
  },
  saveButton: {
    backgroundColor: '#000',
    paddingHorizontal: 20,
    borderRadius: 8,
    paddingVertical: 12,
    alignSelf: 'flex-start', 
    marginTop: 20,
  },
  saveButtonText: {
    fontSize: 18,
    fontWeight: '600',
    color: '#fff',
  },
});


export default GoalDetails;
