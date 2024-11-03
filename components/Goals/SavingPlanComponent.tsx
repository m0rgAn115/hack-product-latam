import { Text, View, StyleSheet } from 'react-native';
import React, { Component } from 'react'

interface ComponentProps {
  title: string;
  description: string;
  annual_rate: number;
  style?: {};
}

export const SavingPlanComponent = ({title,style,description,annual_rate}:ComponentProps) => {


  return (
    <View style={[styles.container, style]} >

    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    borderRadius: 20,
    backgroundColor: 'white',

  }
})