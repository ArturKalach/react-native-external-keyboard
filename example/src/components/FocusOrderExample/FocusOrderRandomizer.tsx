import { useState } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import {
  KeyboardOrderFocusGroup,
  Pressable,
} from 'react-native-external-keyboard';
import {
  ANDROID_FOCUS_STYLE,
  ANDROID_SECONDARY_FOCUS_STYLE,
} from '../../constants/styles';

const CELL_COUNT = 16;
const COLS = 4;

function shuffle(arr: number[]): number[] {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j]!, a[i]!];
  }
  return a;
}

function makeOrder(count: number): number[] {
  return shuffle(Array.from({ length: count }, (_, i) => i));
}

export const FocusOrderRandomizer = () => {
  const [order, setOrder] = useState(() => makeOrder(CELL_COUNT));

  const randomize = () => setOrder(makeOrder(CELL_COUNT));

  const rows = Math.ceil(CELL_COUNT / COLS);

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Focus Order Randomizer</Text>
        <Text style={styles.description}>
          Press Randomize to reassign{' '}
          <Text style={styles.code}>orderIndex</Text> values dynamically. Tab
          through to verify the new sequence.
        </Text>
      </View>
      <KeyboardOrderFocusGroup>
        <View style={styles.grid}>
          {Array.from({ length: rows }, (_i, row) => (
            <View key={row} style={styles.row}>
              {Array.from({ length: COLS }, (_j, col) => {
                const cellId = row * COLS + col;
                if (cellId >= CELL_COUNT) return null;
                const orderIndex = order[cellId]!;
                return (
                  <Pressable
                    key={cellId}
                    orderIndex={orderIndex}
                    style={styles.cell}
                    focusStyle={ANDROID_FOCUS_STYLE}
                    defaultFocusHighlightEnabled={false}
                  >
                    <Text style={styles.cellIndex}>{orderIndex + 1}</Text>
                    <Text style={styles.cellPos}>
                      [{row},{col}]
                    </Text>
                  </Pressable>
                );
              })}
            </View>
          ))}
        </View>
      </KeyboardOrderFocusGroup>
      <Pressable
        defaultFocusHighlightEnabled={false}
        focusStyle={ANDROID_SECONDARY_FOCUS_STYLE}
        style={styles.btn}
        onPress={randomize}
      >
        <Text style={styles.btnText}>⇄ Randomize</Text>
      </Pressable>
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
  code: {
    fontFamily: 'Menlo',
    fontSize: 12,
    color: '#5856D6',
  },
  grid: { gap: 8 },
  row: { flexDirection: 'row', gap: 8 },
  cell: {
    width: 64,
    height: 64,
    backgroundColor: '#ffffff',
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 2,
  },
  cellIndex: {
    fontSize: 18,
    fontWeight: '700',
    color: '#007AFF',
  },
  cellPos: {
    fontSize: 9,
    color: '#8e8e93',
  },
  btn: {
    backgroundColor: '#007AFF',
    paddingVertical: 10,
    paddingHorizontal: 24,
    borderRadius: 20,
  },
  btnText: {
    fontSize: 15,
    fontWeight: '600',
    color: '#ffffff',
  },
});
