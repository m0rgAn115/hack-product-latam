import { Pressable, StyleSheet, Text, View } from 'react-native'
import React, { Component } from 'react'
import { opacity } from 'react-native-reanimated/lib/typescript/reanimated2/Colors';

interface ComponentProps {
  titulo:string
  onPress: (titulo:string) => void;
}

const RecomendationButton = ({ onPress, titulo }:ComponentProps) => {

    return (
      <Pressable
      onPress={() => onPress(titulo)}
      style={({ pressed }) => [
        styles.container,
        { backgroundColor: pressed ? '#d9d9d9' : '#efefef'},
      ]}
    >
      <Text style={styles.text}>{titulo}</Text>
    </Pressable>
    )
  }

export default RecomendationButton;

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#ededed',
    paddingVertical: 5, 
    paddingHorizontal: 10, 
    borderRadius: 5, 
    alignSelf: 'flex-start', 
    marginRight: 20, 
    borderWidth: 1, 
    borderColor: '#c0c0c0'
  },
  text: {
    fontSize: 18, 
    textAlign: 'center'
  }
})