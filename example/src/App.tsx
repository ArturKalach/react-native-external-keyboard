import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { Home } from './screens/Home/Home';
import { ScrollView, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import {
  NavigationContainer,
  type NavigationProp,
} from '@react-navigation/native';
import {
  FocusOrderScreen,
  FocusOrderExampleScreen,
  DPadOrderScreen,
  LinkOrderScreen,
  MixedOrderScreen,
  MixedDPadScreen,
  MixedPositionOrderScreen,
  OrderRandomizerScreen,
  LinkRandomizerScreen,
  MixedRandomizerScreen,
  MixedPositionRandomizerScreen,
  MazeExampleScreen,
} from './components/FocusOrderExample/FocusOrderScreen';
import { PressableTest } from './components/Pressables/PressableTest';
import { KeyboardPressableScreen } from './components/Pressables/KeyboardPressableScreen';
import { ListsTest } from './components/Lists/ListsText';
import { ComponentsPlayground } from './components/BaseKeyboardView/ComponentsPlayground';
import { FocusLockExample } from './components/FocusLockExample/FocusLockExample';
import { OrderMaze } from './components/OrderMaze/OrderMaze';
import { Pressable } from 'react-native-external-keyboard';
import { ANDROID_FOCUS_STYLE } from './constants/styles';

type NavItem = {
  name: string;
  title: string;
  description: string;
  color: string;
};

type NavGroup = {
  group: string;
  items: NavItem[];
};

const NAV_GROUPS: NavGroup[] = [
  {
    group: 'Demos',
    items: [
      {
        name: 'Details',
        title: 'Components',
        description: 'Buttons, inputs, modals & key tracker',
        color: '#007AFF',
      },
      {
        name: 'FocusOrder',
        title: 'Focus Order',
        description: 'Custom keyboard navigation ordering',
        color: '#34C759',
      },
      {
        name: 'FocusLock',
        title: 'Focus Lock',
        description: 'Trap keyboard focus within a region',
        color: '#FF9500',
      },
    ],
  },
  {
    group: 'Tests',
    items: [
      {
        name: 'PressableTest',
        title: 'Pressables',
        description: 'Test pressable and touchable variants',
        color: '#5856D6',
      },
      {
        name: 'KeyboardPressable',
        title: 'Keyboard Pressable',
        description: 'children, renderContent & renderFocusable',
        color: '#0A84FF',
      },
      {
        name: 'ListTest',
        title: 'Lists',
        description: 'Focusable scrollable list',
        color: '#AF52DE',
      },
      {
        name: 'ComponentsPlayground',
        title: 'Components Playground',
        description: 'Focus, key press, halo & lockFocus',
        color: '#FF3B30',
      },
    ],
  },
];

function HomeScreen({ navigation }: { navigation: NavigationProp<any> }) {
  return (
    <SafeAreaView style={styles.safeArea} edges={['bottom']}>
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        style={styles.scroll}
      >
        {NAV_GROUPS.map((group) => (
          <View key={group.group} style={styles.section}>
            <Text style={styles.sectionTitle}>{group.group.toUpperCase()}</Text>
            <View style={styles.sectionCard}>
              {group.items.map((item, index) => (
                <View key={item.name}>
                  <Pressable
                    defaultFocusHighlightEnabled={false}
                    focusStyle={ANDROID_FOCUS_STYLE}
                    style={({ pressed }) => [
                      styles.navItem,
                      pressed && styles.navItemPressed,
                    ]}
                    onPress={() => navigation.navigate(item.name)}
                  >
                    <View
                      style={[styles.navDot, { backgroundColor: item.color }]}
                    />
                    <View style={styles.navTextContainer}>
                      <Text style={styles.navTitle}>{item.title}</Text>
                      <Text style={styles.navDescription}>
                        {item.description}
                      </Text>
                    </View>
                    <Text style={styles.navChevron}>{'›'}</Text>
                  </Pressable>
                  {index < group.items.length - 1 && (
                    <View style={styles.separator} />
                  )}
                </View>
              ))}
            </View>
          </View>
        ))}
      </ScrollView>
    </SafeAreaView>
  );
}

export function DetailsScreen() {
  return (
    <GestureHandlerRootView style={styles.flex}>
      <SafeAreaView style={styles.container} edges={['bottom']}>
        <Home />
      </SafeAreaView>
    </GestureHandlerRootView>
  );
}

function MazeScreen() {
  return <OrderMaze />;
}

const Stack = createNativeStackNavigator();

export function App() {
  return (
    <GestureHandlerRootView style={styles.flex}>
      <NavigationContainer>
        <Stack.Navigator>
          <Stack.Screen name="Home" component={HomeScreen} />
          <Stack.Screen
            name="Details"
            component={DetailsScreen}
            options={{ title: 'Components' }}
          />
          <Stack.Screen
            name="FocusOrder"
            component={FocusOrderScreen}
            options={{ title: 'Focus Order' }}
          />
          <Stack.Screen
            name="FocusOrderExample"
            component={FocusOrderExampleScreen}
            options={{ title: 'Focus Order' }}
          />
          <Stack.Screen
            name="DPadOrderExample"
            component={DPadOrderScreen}
            options={{ title: 'DPad Order' }}
          />
          <Stack.Screen
            name="LinkOrderExample"
            component={LinkOrderScreen}
            options={{ title: 'Focus Link Order' }}
          />
          <Stack.Screen
            name="MixedOrderExample"
            component={MixedOrderScreen}
            options={{ title: 'Mixed Order' }}
          />
          <Stack.Screen
            name="MixedDPadExample"
            component={MixedDPadScreen}
            options={{ title: 'Mixed DPad' }}
          />
          <Stack.Screen
            name="MixedPositionOrderExample"
            component={MixedPositionOrderScreen}
            options={{ title: 'Mixed Position Order' }}
          />
          <Stack.Screen
            name="LinkRandomizerExample"
            component={LinkRandomizerScreen}
            options={{ title: 'Link Randomizer' }}
          />
          <Stack.Screen
            name="MixedRandomizerExample"
            component={MixedRandomizerScreen}
            options={{ title: 'Mixed Randomizer' }}
          />
          <Stack.Screen
            name="MixedPositionRandomizerExample"
            component={MixedPositionRandomizerScreen}
            options={{ title: 'Mixed Position Randomizer' }}
          />
          <Stack.Screen
            name="OrderRandomizerExample"
            component={OrderRandomizerScreen}
            options={{ title: 'Order Randomizer' }}
          />
          <Stack.Screen
            name="MazeExample"
            component={MazeExampleScreen}
            options={{ title: 'Maze' }}
          />
          <Stack.Screen name="PressableTest" component={PressableTest} />
          <Stack.Screen
            name="KeyboardPressable"
            component={KeyboardPressableScreen}
            options={{ title: 'Keyboard Pressable' }}
          />
          <Stack.Screen name="ListTest" component={ListsTest} />
          <Stack.Screen
            name="ComponentsPlayground"
            component={ComponentsPlayground}
            options={{ title: 'Components Playground' }}
          />
          <Stack.Screen name="FocusLock" component={FocusLockExample} />
          <Stack.Screen name="Maze" component={MazeScreen} />
        </Stack.Navigator>
      </NavigationContainer>
    </GestureHandlerRootView>
  );
}

const styles = StyleSheet.create({
  flex: { flex: 1 },
  safeArea: { flex: 1, backgroundColor: '#f2f2f7' },
  scroll: { flex: 1, backgroundColor: '#f2f2f7' },
  scrollContent: { padding: 16, gap: 8 },
  container: { flex: 1, backgroundColor: '#f2f2f7' },

  section: { gap: 6 },
  sectionTitle: {
    fontSize: 12,
    fontWeight: '600',
    color: '#6b6b6b',
    marginLeft: 16,
    letterSpacing: 0.5,
  },
  sectionCard: {
    backgroundColor: '#ffffff',
    borderRadius: 12,
    overflow: 'hidden',
  },

  navItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    gap: 12,
    backgroundColor: '#ffffff',
  },
  navItemPressed: { backgroundColor: '#f2f2f7' },
  navDot: {
    width: 36,
    height: 36,
    borderRadius: 8,
  },
  navTextContainer: { flex: 1, gap: 2 },
  navTitle: { fontSize: 16, fontWeight: '500', color: '#000000' },
  navDescription: { fontSize: 13, color: '#8e8e93' },
  navChevron: { fontSize: 22, color: '#c7c7cc', lineHeight: 26 },

  separator: {
    height: StyleSheet.hairlineWidth,
    backgroundColor: '#e5e5ea',
    marginLeft: 64,
  },
});
