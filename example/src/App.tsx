import * as React from 'react';

import { Home } from './screens/Home/Home';
import { SafeAreaView, StyleSheet } from 'react-native';
import { KeyboardRootView } from 'react-native-external-keyboard';

export default function App() {
  return (
    <KeyboardRootView style={styles.flex}>
      <SafeAreaView style={styles.container}>
        <Home />
      </SafeAreaView>
    </KeyboardRootView>
  );
}

const styles = StyleSheet.create({
  flex: {
    flex: 1,
  },
  container: {
    flex: 1,
    backgroundColor: '#f4f4f4',
  },
});
