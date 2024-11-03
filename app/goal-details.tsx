import { StyleSheet, Text, TextInput, View } from 'react-native'
import React, { Component, useState } from 'react'

import { useLocalSearchParams } from 'expo-router';

const GoalDetails = () =>  {
    const { text,amount } = useLocalSearchParams();

    const initialText = Array.isArray(text) ? text[0] : text || '';
  const initialAmount = Array.isArray(amount) ? amount[0] : amount || '';

    const [goal_title_value, setgoal_title_value] = useState<string>(initialText)
    const [goal_amount_value, setgoal_amount_value] = useState<string>(initialAmount)
    const [goal_initial_amount_value, setgoal_initial_amount_value] = useState<string>('$ 0')
    const [goal_description_value, setgoal_description_value] = useState<string>('')


    
    return (
      <View style={{ paddingHorizontal: 20, justifyContent: 'space-around', flex: 1 }} >

        <View>
          <Text>Goal Title: </Text>
          <TextInput 
            style={ styles.input_1 }
            value={goal_title_value}
            onChangeText={setgoal_title_value}
            placeholder='Goal title'

          />

          <View style={{ marginVertical: 10 }} >
            <Text>Description: </Text>
            <TextInput 
              style={ styles.input_1 }
              value={goal_description_value}
              onChangeText={setgoal_description_value}
              placeholder='Amount to save'
              multiline={true}

            />
          </View>

          <View style={{ marginVertical: 10 }} >
            <Text>Amount to Save: </Text>
            <TextInput 
              style={ styles.input_1 }
              value={goal_amount_value}
              onChangeText={setgoal_amount_value}
              placeholder='Amount to save'

            />
          </View>

          <View style={{ marginVertical: 10 }} >
            <Text>Initial Amount: </Text>
            <TextInput 
              style={ styles.input_1 }
              value={goal_initial_amount_value}
              onChangeText={setgoal_initial_amount_value}
              placeholder='Amount to save'

            />
          </View>

          
          
        </View>
        
      </View>
    )
  }

export default GoalDetails

const styles = StyleSheet.create({
  input_1:{
    backgroundColor: '#e9e9e9',
    borderWidth: 1,
    borderColor: '#cfcfcf', 
    textAlign: 'center', 
    fontSize: 18,
    borderRadius: 10,
    paddingVertical: 8
  }
})