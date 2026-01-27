import { GestureHandlerRootView } from 'react-native-gesture-handler';

import { Home } from './screens/Home/Home';
import { Button, SafeAreaView, StyleSheet } from 'react-native';
import { View } from 'react-native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import {
  NavigationContainer,
  type NavigationProp,
} from '@react-navigation/native';
import { FocusOrderScreen } from './components/FocusOrderExample/FocusOrderScreen';
import { PressableTest } from './components/Pressables/PressableTest';
import { ListsTest } from './components/Lists/ListsText';
import { FocusLockExample } from './components/FocusLockExample/FocusLockExample';

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
  return (
    <View style={styles.home}>
      <Button title="Details" onPress={() => navigation.navigate('Details')} />
      <Button
        title="Focus Order"
        onPress={() => navigation.navigate('FocusOrder')}
      />
      <Button
        title="Focus Lock"
        onPress={() => navigation.navigate('FocusOrder')}
      />
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
          <Stack.Screen name="FocusOrder" component={FocusOrderScreen} />
          <Stack.Screen name="PressableTest" component={PressableTest} />
          <Stack.Screen name="ListTest" component={ListsTest} />
          <Stack.Screen name="FocusLock" component={FocusLockExample} />
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
  home: { flex: 1, alignItems: 'center', justifyContent: 'center', gap: 12 },
});
