import * as React from 'react';
import { GestureHandlerRootView } from 'react-native-gesture-handler';

import { Home } from './screens/Home/Home';
import { SafeAreaView, StyleSheet } from 'react-native';
import { KeyboardRootView } from 'react-native-external-keyboard';

export default function App() {
  return (
    <GestureHandlerRootView style={styles.flex}>
      <KeyboardRootView style={styles.flex}>
        <SafeAreaView style={styles.container}>
          <Home />
        </SafeAreaView>
      </KeyboardRootView>
    </GestureHandlerRootView>
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
