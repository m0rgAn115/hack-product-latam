import React from 'react';
import { StyleSheet  } from 'react-native';
import { WebView } from 'react-native-webview';

const WebViewComponent: React.FC = () => {
  const url = 'https://blog.logrocket.com/';

  return (
      <WebView source={{ uri: url }} style={styles.webview} />
  );
};

const styles = StyleSheet.create({
  webview: {
    flex: 1,
    width: '100%',
  },
});

export default WebViewComponent;
