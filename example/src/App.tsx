import {
  GestureHandlerRootView,
  TextInput,
} from 'react-native-gesture-handler';

import { Home } from './screens/Home/Home';
import { Button, SafeAreaView, StyleSheet } from 'react-native';
import { View, Text } from 'react-native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import {
  NavigationContainer,
  type NavigationProp,
} from '@react-navigation/native';
import {
  KeyboardExtendedInput,
  KeyboardFocusGroup,
  Pressable,
} from 'react-native-external-keyboard';
import { useState } from 'react';

export function DetailsScreen() {
  return (
    <GestureHandlerRootView style={styles.flex}>
      <SafeAreaView style={styles.container}>
        <Home />
      </SafeAreaView>
    </GestureHandlerRootView>
  );
}

const Stack = createNativeStackNavigator();

function HomeScreen({ navigation }: { navigation: NavigationProp<any> }) {
  const [v, setV] = useState('1234123');
  return (
    <View style={[styles.home, { flexDirection: "row" }]}>
      <Pressable orderId="start" orderForward="almost_end">
        <Text>Start</Text>
      </Pressable>
      {/* <KeyboardFocusGroup orderGroup="relax"> */}
      <Pressable orderGroup="relax" orderIndex={1}>
        <Text>Second</Text>
      </Pressable>
      <Pressable
        // lockFocus={['up', 'backward']}
        orderGroup="relax"
        orderIndex={0}
      >
        <Text>First</Text>
      </Pressable>
      <Pressable
        // lockFocus={['up', 'backward']}
        orderGroup="relax"
        orderIndex={3}
      >
        <Text>Fourth</Text>
      </Pressable>
      <Pressable orderGroup="relax" orderIndex={2}>
        <Text>Third</Text>
      </Pressable>
      {/* </KeyboardFocusGroup> */}
      <Pressable orderId="almost_end" orderBackward="start">
        <Text>Almost End</Text>
      </Pressable>
      <Pressable orderId="end">
        <Text>End</Text>
      </Pressable>
    </View>
  );
}

export function App() {
  return (
    <GestureHandlerRootView style={styles.flex}>
      <NavigationContainer>
        <Stack.Navigator>
          <Stack.Screen name="Home" component={HomeScreen} />
          <Stack.Screen name="Details" component={DetailsScreen} />
        </Stack.Navigator>
      </NavigationContainer>
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
  home: { flex: 1, alignItems: 'center', justifyContent: 'center' },
});
