import {
  ScrollView,
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { FocusOrder } from './FocusOrder';
import { FocusDPadOrder } from './FocusDPadOrder';
import { FocusLinkOrder } from './FocusLinkOrder';
import { FocusMixedOrder } from './FocusMixedOrder';
import { FocusMixedDpadOrder } from './FocusMixedDpadOrder';
import { FocusMixedPositionOrder } from './FocusMixedPositionOrder';
import { FocusOrderRandomizer } from './FocusOrderRandomizer';
import { FocusLinkRandomizer } from './FocusLinkRandomizer';
import { FocusMixedRandomizer } from './FocusMixedRandomizer';
import { FocusMixedPositionRandomizer } from './FocusMixedPositionRandomizer';
import { OrderMaze } from '../OrderMaze/OrderMaze';
import type { NavigationProp } from '@react-navigation/native';
import { Pressable } from 'react-native-external-keyboard';

type NavItem = { name: string; title: string; description: string };

export const FOCUS_ORDER_ITEMS: NavItem[] = [
  {
    name: 'FocusOrderExample',
    title: 'Focus Order',
    description: 'Index-based ordering with lockFocus',
  },
  {
    name: 'DPadOrderExample',
    title: 'DPad Order',
    description: 'Directional D-pad navigation',
  },
  {
    name: 'LinkOrderExample',
    title: 'Focus Link Order',
    description: 'Explicit forward/backward links',
  },
  {
    name: 'MixedOrderExample',
    title: 'Mixed Order',
    description: 'Inputs and pressables combined',
  },
  {
    name: 'MixedDPadExample',
    title: 'Mixed DPad',
    description: 'D-pad with inputs and pressables',
  },
  {
    name: 'MixedPositionOrderExample',
    title: 'Mixed Position Order',
    description: 'Inputs and pressables with index-based ordering',
  },
  {
    name: 'OrderRandomizerExample',
    title: 'Order Randomizer',
    description: 'Dynamically reassign orderIndex values',
  },
  {
    name: 'LinkRandomizerExample',
    title: 'Link Randomizer',
    description: 'Dynamically rebuild orderForward/orderBackward chain',
  },
  {
    name: 'MixedRandomizerExample',
    title: 'Mixed Randomizer',
    description: 'Randomize link chain across inputs and pressables',
  },
  {
    name: 'MixedPositionRandomizerExample',
    title: 'Mixed Position Randomizer',
    description: 'Randomize orderIndex across inputs and pressables',
  },
  {
    name: 'MazeExample',
    title: 'Maze',
    description: 'Navigate a maze with arrow keys',
  },
];

export function FocusOrderScreen({
  navigation,
}: {
  navigation: NavigationProp<any>;
}) {
  return (
    <SafeAreaView style={styles.safeArea} edges={['bottom']}>
      <ScrollView
        style={styles.scroll}
        contentContainerStyle={styles.scrollContent}
      >
        <View style={styles.sectionCard}>
          {FOCUS_ORDER_ITEMS.map((item, index) => (
            <View key={item.name}>
              <Pressable
                style={({ pressed }) => [
                  styles.navItem,
                  pressed && styles.navItemPressed,
                ]}
                onPress={() => navigation.navigate(item.name)}
              >
                <View style={styles.navTextContainer}>
                  <Text style={styles.navTitle}>{item.title}</Text>
                  <Text style={styles.navDescription}>{item.description}</Text>
                </View>
                <Text style={styles.navChevron}>{'›'}</Text>
              </Pressable>
              {index < FOCUS_ORDER_ITEMS.length - 1 && (
                <View style={styles.separator} />
              )}
            </View>
          ))}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

function pickRandom(currentName: string): NavItem {
  const others = FOCUS_ORDER_ITEMS.filter((i) => i.name !== currentName);
  return others[Math.floor(Math.random() * others.length)]!;
}

function ExampleScreen({
  children,
  navigation,
  currentName,
}: {
  children: React.ReactNode;
  navigation: NavigationProp<any>;
  currentName: string;
}) {
  const currentIndex = FOCUS_ORDER_ITEMS.findIndex(
    (i) => i.name === currentName
  );
  const prev = currentIndex > 0 ? FOCUS_ORDER_ITEMS[currentIndex - 1] : null;
  const next =
    currentIndex < FOCUS_ORDER_ITEMS.length - 1
      ? FOCUS_ORDER_ITEMS[currentIndex + 1]
      : null;

  const pushRandom = () => {
    const item = pickRandom(currentName);
    (navigation as any).push(item.name);
  };

  return (
    <SafeAreaView style={styles.exampleSafeArea} edges={['bottom']}>
      <View style={styles.exampleContainer}>{children}</View>
      <TouchableOpacity style={styles.navBtnRandom} onPress={pushRandom}>
        <Text style={styles.navBtnRandomText}>⚡ Push random</Text>
      </TouchableOpacity>
      <View style={styles.navRow}>
        {prev ? (
          <TouchableOpacity
            style={[styles.navBtn, styles.navBtnLeft]}
            onPress={() => navigation.navigate(prev.name)}
          >
            <Text style={styles.navBtnChevron}>‹</Text>
            <Text style={styles.navBtnLabel}>{prev.title}</Text>
          </TouchableOpacity>
        ) : (
          <View />
        )}
        {next ? (
          <TouchableOpacity
            style={[styles.navBtn, styles.navBtnRight]}
            onPress={() => navigation.navigate(next.name)}
          >
            <Text style={styles.navBtnLabel}>{next.title}</Text>
            <Text style={styles.navBtnChevron}>›</Text>
          </TouchableOpacity>
        ) : (
          <View />
        )}
      </View>
    </SafeAreaView>
  );
}

export function FocusOrderExampleScreen({
  navigation,
}: {
  navigation: NavigationProp<any>;
}) {
  return (
    <ExampleScreen navigation={navigation} currentName="FocusOrderExample">
      <FocusOrder />
    </ExampleScreen>
  );
}
export function DPadOrderScreen({
  navigation,
}: {
  navigation: NavigationProp<any>;
}) {
  return (
    <ExampleScreen navigation={navigation} currentName="DPadOrderExample">
      <FocusDPadOrder />
    </ExampleScreen>
  );
}
export function LinkOrderScreen({
  navigation,
}: {
  navigation: NavigationProp<any>;
}) {
  return (
    <ExampleScreen navigation={navigation} currentName="LinkOrderExample">
      <FocusLinkOrder />
    </ExampleScreen>
  );
}
export function MixedOrderScreen({
  navigation,
}: {
  navigation: NavigationProp<any>;
}) {
  return (
    <ExampleScreen navigation={navigation} currentName="MixedOrderExample">
      <FocusMixedOrder />
    </ExampleScreen>
  );
}
export function MixedDPadScreen({
  navigation,
}: {
  navigation: NavigationProp<any>;
}) {
  return (
    <ExampleScreen navigation={navigation} currentName="MixedDPadExample">
      <FocusMixedDpadOrder />
    </ExampleScreen>
  );
}
export function MixedPositionOrderScreen({
  navigation,
}: {
  navigation: NavigationProp<any>;
}) {
  return (
    <ExampleScreen
      navigation={navigation}
      currentName="MixedPositionOrderExample"
    >
      <FocusMixedPositionOrder />
    </ExampleScreen>
  );
}
export function LinkRandomizerScreen({
  navigation,
}: {
  navigation: NavigationProp<any>;
}) {
  return (
    <ExampleScreen navigation={navigation} currentName="LinkRandomizerExample">
      <FocusLinkRandomizer />
    </ExampleScreen>
  );
}
export function OrderRandomizerScreen({
  navigation,
}: {
  navigation: NavigationProp<any>;
}) {
  return (
    <ExampleScreen navigation={navigation} currentName="OrderRandomizerExample">
      <FocusOrderRandomizer />
    </ExampleScreen>
  );
}
export function MixedRandomizerScreen({
  navigation,
}: {
  navigation: NavigationProp<any>;
}) {
  return (
    <ExampleScreen navigation={navigation} currentName="MixedRandomizerExample">
      <FocusMixedRandomizer />
    </ExampleScreen>
  );
}
export function MixedPositionRandomizerScreen({
  navigation,
}: {
  navigation: NavigationProp<any>;
}) {
  return (
    <ExampleScreen
      navigation={navigation}
      currentName="MixedPositionRandomizerExample"
    >
      <FocusMixedPositionRandomizer />
    </ExampleScreen>
  );
}
export function MazeExampleScreen({
  navigation,
}: {
  navigation: NavigationProp<any>;
}) {
  return (
    <ExampleScreen navigation={navigation} currentName="MazeExample">
      <OrderMaze />
    </ExampleScreen>
  );
}

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: '#f2f2f7' },
  scroll: { flex: 1, backgroundColor: '#f2f2f7' },
  scrollContent: { padding: 16 },
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
  navTextContainer: { flex: 1, gap: 2 },
  navTitle: { fontSize: 16, fontWeight: '500', color: '#000000' },
  navDescription: { fontSize: 13, color: '#8e8e93' },
  navChevron: { fontSize: 22, color: '#c7c7cc', lineHeight: 26 },
  separator: {
    height: StyleSheet.hairlineWidth,
    backgroundColor: '#e5e5ea',
    marginLeft: 16,
  },
  exampleSafeArea: { flex: 1, backgroundColor: '#f2f2f7' },
  exampleContainer: { flex: 1, alignItems: 'center', justifyContent: 'center' },
  navRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  navBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: '#007AFF',
    paddingVertical: 8,
    paddingHorizontal: 14,
    borderRadius: 20,
  },
  navBtnLeft: {},
  navBtnRight: {},
  navBtnChevron: { fontSize: 18, color: '#ffffff', lineHeight: 22 },
  navBtnLabel: { fontSize: 14, fontWeight: '500', color: '#ffffff' },
  navBtnText: { fontSize: 15, color: '#007AFF' },
  navBtnRandom: {
    alignSelf: 'center',
    paddingVertical: 8,
    paddingHorizontal: 20,
    borderRadius: 20,
    backgroundColor: '#e5e5ea',
    marginBottom: 4,
  },
  navBtnRandomText: { fontSize: 13, fontWeight: '500', color: '#3c3c43' },
});
