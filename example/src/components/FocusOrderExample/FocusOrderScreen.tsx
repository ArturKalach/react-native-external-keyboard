import { SafeAreaView, StyleSheet } from 'react-native';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { FocusOrder } from './FocusOrder';
import { useState } from 'react';
import { FocusDPadOrder } from './FocusDPadOrder';
import { FocusLinkOrder } from './FocusLinkOrder';

export const FocusOrderScreen = () => {
  const [example, setExample] = useState(0);

  return (
    <GestureHandlerRootView style={styles.flex}>
      <SafeAreaView style={styles.container}>
        {example === 0 ? (
          <>
            <FocusOrder onChange={setExample} />
          </>
        ) : null}
        {example === 1 ? (
          <>
            <FocusDPadOrder onChange={setExample} />
          </>
        ) : null}
        {example === 2 ? (
          <>
            <FocusLinkOrder onChange={setExample} />
          </>
        ) : null}
      </SafeAreaView>
    </GestureHandlerRootView>
  );
};

const styles = StyleSheet.create({
  flex: {
    flex: 1,
  },
  container: {
    flex: 1,
    backgroundColor: '#f4f4f4',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
