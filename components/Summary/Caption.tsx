import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

interface Parameter {
  range: { min: number, max: number };
  formattedDate: string;
}

interface CaptionProps {
  parameters: Parameter[];
}

const Caption: React.FC<CaptionProps> = ({ parameters }) => {
  // Ensure there is at least one parameter
  if (parameters.length === 0) {
    return null;
  }

  // Use the first parameter
  const { range, formattedDate } = parameters[0];

  return (
    <View style={styles.container}>
      <Text style={styles.text}>{range.min}</Text>
      <View style={styles.center}>
        <Text style={styles.text}>Last updated on</Text>
        <Text style={styles.text}>{formattedDate}</Text>
      </View>
      <Text style={styles.text}>{range.max}</Text>
    </View>
  );
};

// Centralized styles
const styles = StyleSheet.create({
  container: {
    paddingHorizontal: '5%',
    paddingTop: 10,
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  text: {
    color: '#67677A',
    fontSize: 14,
    fontFamily: 'DMSans_400Regular',
  },
  center: {
    alignItems: 'center',
  },
});

export default Caption;
