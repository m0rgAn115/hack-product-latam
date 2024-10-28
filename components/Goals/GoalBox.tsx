import { StyleSheet, Text, View } from 'react-native'
import React, { Component, useState } from 'react'

interface Component_Props {
  title: string,
  actual_amount: number,
  total_amount: number,
  months: number, 
  ContainerStyles?: {}
}

export const GoalBox = ({title,actual_amount,months,total_amount, ContainerStyles}:Component_Props) => {
  const [completedState, setcompletedState] = useState(actual_amount/total_amount == 1)

  return (
    <View style={[styles.container, ContainerStyles, {backgroundColor: (actual_amount/total_amount===1 ? '#15a332' : '#2c2c2c')}]} >
      <View style={{ flex: 5, padding: 5, justifyContent: 'space-around' }}>
        <Text style={styles.title} >{title}</Text>
        <Text style={styles.text} >{'$'+actual_amount + ' / ' + '$'+total_amount}</Text>
        <Text style={styles.text} >{ (completedState) ? 'Completed!' : months + (months > 1 ? ' months remaining' : ' month remaining') }</Text>
        <Text style={[styles.text, { fontWeight: '700' }]} >{ (actual_amount/total_amount * 100).toFixed(2)+'%' }</Text>


      </View>
      <View style={{ flex: 2, backgroundColor: '#b5b5b5', borderRadius: 10 }}>


      </View>
    </View>
  )
}
export default GoalBox;

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#2c2c2c',
    borderRadius: 10,
    height: 130,
    flexDirection: 'row',
    borderWidth: 1,
    borderColor: '#9c9c9c'
    
  },
  title: {
    fontSize: 22,
    color: 'white',
    textAlign: 'center',
    fontWeight: '500'
  },
  text: {
    fontSize: 20,
    color: 'white',
    textAlign: 'center',
  }
})