import React from 'react';
import { View, StyleSheet, Text } from 'react-native';
import { WebView } from 'react-native-webview';

const MyWebView = () => {
  return (
    <View style={styles.container}>
      <Text>Hola</Text>
      <WebView source={{ uri: 'http://172.100.72.169:3000' }} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});

export default MyWebView;
