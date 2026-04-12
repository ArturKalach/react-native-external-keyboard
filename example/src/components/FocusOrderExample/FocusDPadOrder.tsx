import { useRef, useState } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import {
  KeyboardOrderFocusGroup,
  Pressable,
  type KeyboardFocus,
} from 'react-native-external-keyboard';

const list = ['0_0', '0_1', '0_2', '1_0', '1_1', '1_2', '2_0', '2_1', '2_2'];
const arrows = ['⇖', '⇑', '⇗', '⇐', '⊙', '⇒', '⇙', '⇓', '⇘'];
const arrowLabels = [
  '↖ top-left',
  '↑ up',
  '↗ top-right',
  '← left',
  '· all',
  '→ right',
  '↙ bot-left',
  '↓ down',
  '↘ bot-right',
];

export const FocusDPadOrder = () => {
  const [state, setState] = useState<number>(4);
  const role = () => {
    setState((i) => (i === list.length - 1 ? 0 : i + 1));
  };

  const ref = useRef<KeyboardFocus>(null);
  const onPress = () => {
    ref.current?.focus();
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>DPad Order</Text>
        <Text style={styles.description}>
          Arrow keys navigate between cells directionally. Press the center cell
          to change its link target.
        </Text>
      </View>
      <KeyboardOrderFocusGroup>
        <View style={styles.grid}>
          <View style={styles.row}>
            <Pressable
              orderId="0_0"
              orderDown="2_0"
              orderRight="0_2"
              onPress={onPress}
              style={styles.cell}
            >
              <Text style={styles.cellSymbol}>◤</Text>
              <Text style={styles.cellLabel}>→ ↓</Text>
            </Pressable>
            <Pressable
              onPress={onPress}
              orderId="0_1"
              style={[styles.cell, styles.cellDim]}
            >
              <Text style={styles.cellSymbol}>—</Text>
            </Pressable>
            <Pressable
              onPress={onPress}
              orderId="0_2"
              orderDown="2_2"
              orderLeft="0_0"
              style={styles.cell}
            >
              <Text style={styles.cellSymbol}>◥</Text>
              <Text style={styles.cellLabel}>← ↓</Text>
            </Pressable>
          </View>
          <View style={styles.row}>
            <Pressable
              onPress={onPress}
              orderId="1_0"
              style={[styles.cell, styles.cellDim]}
            >
              <Text style={styles.cellSymbol}>—</Text>
            </Pressable>
            <Pressable
              ref={ref}
              orderLeft={list[state]}
              orderRight={list[state]}
              orderUp={list[state]}
              orderDown={list[state]}
              onPress={role}
              orderId="1_1"
              style={[styles.cell, styles.cellCenter]}
            >
              <Text style={styles.cellCenterArrow}>{arrows[state]}</Text>
              <Text style={styles.cellCenterLabel}>{arrowLabels[state]}</Text>
            </Pressable>
            <Pressable
              onPress={onPress}
              orderId="1_2"
              style={[styles.cell, styles.cellDim]}
            >
              <Text style={styles.cellSymbol}>—</Text>
            </Pressable>
          </View>
          <View style={styles.row}>
            <Pressable
              orderId="2_0"
              orderUp="0_0"
              orderRight="2_2"
              onPress={onPress}
              style={styles.cell}
            >
              <Text style={styles.cellSymbol}>◣</Text>
              <Text style={styles.cellLabel}>↑ →</Text>
            </Pressable>
            <Pressable
              onPress={onPress}
              orderId="2_1"
              style={[styles.cell, styles.cellDim]}
            >
              <Text style={styles.cellSymbol}>—</Text>
            </Pressable>
            <Pressable
              onPress={onPress}
              orderId="2_2"
              orderUp="0_2"
              orderLeft="2_0"
              style={styles.cell}
            >
              <Text style={styles.cellSymbol}>◢</Text>
              <Text style={styles.cellLabel}>↑ ←</Text>
            </Pressable>
          </View>
        </View>
      </KeyboardOrderFocusGroup>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    gap: 20,
    padding: 16,
  },
  header: {
    alignItems: 'center',
    gap: 6,
    paddingHorizontal: 8,
  },
  title: {
    fontSize: 20,
    fontWeight: '700',
    color: '#1c1c1e',
  },
  description: {
    fontSize: 13,
    color: '#6b6b6b',
    textAlign: 'center',
    lineHeight: 18,
  },
  grid: {
    gap: 8,
  },
  row: { flexDirection: 'row', gap: 8 },
  cell: {
    width: 72,
    height: 72,
    backgroundColor: '#ffffff',
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.08,
    shadowRadius: 3,
    elevation: 2,
  },
  cellDim: {
    backgroundColor: '#f2f2f7',
    shadowOpacity: 0,
    elevation: 0,
  },
  cellCenter: {
    backgroundColor: '#007AFF',
  },
  cellSymbol: {
    fontSize: 20,
    color: '#007AFF',
  },
  cellLabel: {
    fontSize: 10,
    color: '#8e8e93',
    fontWeight: '500',
  },
  cellCenterArrow: {
    fontSize: 24,
    color: '#ffffff',
  },
  cellCenterLabel: {
    fontSize: 9,
    color: 'rgba(255,255,255,0.8)',
    fontWeight: '500',
  },
});
