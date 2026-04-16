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

// Returns a permutation where order[step] = gridIndex focused at that step
function makeOrder(count: number): number[] {
  return shuffle(Array.from({ length: count }, (_, i) => i));
}

function cellId(gridIndex: number): string {
  return `lnk-${gridIndex}`;
}

export const FocusLinkRandomizer = () => {
  const [order, setOrder] = useState(() => makeOrder(CELL_COUNT));

  const randomize = () => setOrder(makeOrder(CELL_COUNT));

  // For each grid position, its step in the current tab sequence
  const stepOf = (gridIndex: number) => order.indexOf(gridIndex);

  const rows = Math.ceil(CELL_COUNT / COLS);

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Link Order Randomizer</Text>
        <Text style={styles.description}>
          Press Randomize to rebuild the{' '}
          <Text style={styles.code}>orderForward</Text> /{' '}
          <Text style={styles.code}>orderBackward</Text> chain dynamically. Tab
          through to verify the new sequence.
        </Text>
      </View>
      <KeyboardOrderFocusGroup>
        <View style={styles.grid}>
          {Array.from({ length: rows }, (_i, row) => (
            <View key={row} style={styles.row}>
              {Array.from({ length: COLS }, (_j, col) => {
                const gridIndex = row * COLS + col;
                if (gridIndex >= CELL_COUNT) return null;

                const step = stepOf(gridIndex);
                const forwardIndex = order[(step + 1) % CELL_COUNT]!;
                const backwardIndex =
                  order[(step - 1 + CELL_COUNT) % CELL_COUNT]!;

                return (
                  <Pressable
                    key={gridIndex}
                    orderId={cellId(gridIndex)}
                    orderForward={cellId(forwardIndex)}
                    orderBackward={cellId(backwardIndex)}
                    style={styles.cell}
                    focusStyle={ANDROID_FOCUS_STYLE}
                    defaultFocusHighlightEnabled={false}
                  >
                    <Text style={styles.cellStep}>{step + 1}</Text>
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
  cellStep: {
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
