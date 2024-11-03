import * as React from 'react';
import { GestureHandlerRootView } from 'react-native-gesture-handler';

import { Home } from './screens/Home/Home';
import { Button, SafeAreaView, StyleSheet } from 'react-native';
import { View, Text } from 'react-native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { NavigationContainer, NavigationProp } from '@react-navigation/native';

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
      <Text>Home Screen</Text>
      <Button
        title="Go to Details"
        onPress={() => navigation.navigate('Details')}
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
