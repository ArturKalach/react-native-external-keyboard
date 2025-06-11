import { GestureHandlerRootView } from 'react-native-gesture-handler';

import { Home } from './screens/Home/Home';
import { Button, SafeAreaView, StyleSheet } from 'react-native';
import { View, Text } from 'react-native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import {
  NavigationContainer,
  type NavigationProp,
} from '@react-navigation/native';
import { KeyboardFocusGroup, Pressable } from 'react-native-external-keyboard';

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
      <Button title="Go" onPress={() => navigation.navigate('Details')} />
      <KeyboardFocusGroup orderGroup="relax">
        <View>
          <View style={{ flexDirection: 'row' }}>
            <Pressable
              style={{ width: 100, height: 100, backgroundColor: 'yellow' }}
              lockFocus={['down', 'forward', 'last']}
            >
              <Text>right</Text>
            </Pressable>
            <Pressable
              style={{ width: 100, height: 100, backgroundColor: 'green' }}
              lockFocus={['left', 'forward', 'backward', 'first']}
            >
              <Text>down</Text>
            </Pressable>
          </View>
          <View style={{ flexDirection: 'row' }}>
            <Pressable
              style={{ width: 100, height: 100, backgroundColor: 'blue' }}
              lockFocus={['right', 'backward', 'first']}
            >
              <Text>top</Text>
            </Pressable>
            <Pressable
              style={{ width: 100, height: 100, backgroundColor: 'orange' }}
              lockFocus={['up', 'backward', 'first']}
            >
              <Text>left</Text>
            </Pressable>
          </View>
          {/* <Pressable
            lockFocus={['up', 'down']}
            orderGroup="relax"
            orderIndex={2}
          >
            <Text>Third</Text>
          </Pressable>
          <Pressable orderGroup="relax" orderIndex={0}>
            <Text>First</Text>
          </Pressable>
          <Pressable orderGroup="relax" orderIndex={1}>
            <Text>Second</Text>
          </Pressable>
          <Pressable orderGroup="relax" orderIndex={4}>
            <Text>Fifth</Text>
          </Pressable>
          <Pressable orderGroup="relax" orderIndex={3}>
            <Text>Fourth</Text>
          </Pressable>
          <Pressable /> */}
        </View>
      </KeyboardFocusGroup>
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
