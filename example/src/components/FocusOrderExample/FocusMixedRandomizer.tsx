import { useState } from 'react';
import { Platform, StyleSheet, Text, View } from 'react-native';
import {
  KeyboardExtendedInput,
  KeyboardOrderFocusGroup,
  Pressable,
} from 'react-native-external-keyboard';
import { ANDROID_SECONDARY_FOCUS_STYLE } from '../../constants/styles';

const ANDROID_FOCUS_STYLE = Platform.select({
  android: { borderWidth: 2, borderColor: '#007AFF' },
});

const CELL_COUNT = 9;
const COLS = 3;

// Checkerboard: even positions are inputs, odd are pressables
function isInput(gridIndex: number): boolean {
  const row = Math.floor(gridIndex / COLS);
  const col = gridIndex % COLS;
  return (row + col) % 2 === 0;
}

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

function cellId(gridIndex: number): string {
  return `mix-${gridIndex}`;
}

export const FocusMixedRandomizer = () => {
  const [order, setOrder] = useState(() => makeOrder(CELL_COUNT));

  const randomize = () => setOrder(makeOrder(CELL_COUNT));

  const stepOf = (gridIndex: number) => order.indexOf(gridIndex);

  const rows = Math.ceil(CELL_COUNT / COLS);

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Mixed Link Randomizer</Text>
        <Text style={styles.description}>
          Press Randomize to rebuild the{' '}
          <Text style={styles.code}>orderForward</Text> /{' '}
          <Text style={styles.code}>orderBackward</Text> chain across inputs and
          pressables. Tab through to verify the new sequence.
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

                if (isInput(gridIndex)) {
                  return (
                    <KeyboardExtendedInput
                      defaultFocusHighlightEnabled={false}
                      key={gridIndex}
                      orderId={cellId(gridIndex)}
                      orderForward={cellId(forwardIndex)}
                      orderBackward={cellId(backwardIndex)}
                      placeholder={String(step + 1)}
                      style={styles.inputText}
                      containerStyle={[styles.cell, styles.inputCell]}
                      containerFocusStyle={ANDROID_FOCUS_STYLE}
                    />
                  );
                }

                return (
                  <Pressable
                    defaultFocusHighlightEnabled={false}
                    key={gridIndex}
                    orderId={cellId(gridIndex)}
                    orderForward={cellId(forwardIndex)}
                    orderBackward={cellId(backwardIndex)}
                    style={[styles.cell, styles.pressCell]}
                    focusStyle={ANDROID_FOCUS_STYLE}
                  >
                    <Text style={styles.cellStep}>{step + 1}</Text>
                  </Pressable>
                );
              })}
            </View>
          ))}
        </View>
      </KeyboardOrderFocusGroup>
      <View style={styles.legend}>
        <View style={styles.legendItem}>
          <View style={[styles.legendDot, styles.legendInput]} />
          <Text style={styles.legendText}>Text Input</Text>
        </View>
        <View style={styles.legendItem}>
          <View style={[styles.legendDot, styles.legendPress]} />
          <Text style={styles.legendText}>Pressable</Text>
        </View>
      </View>
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
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },
  inputCell: {
    backgroundColor: '#f0f4ff',
    borderWidth: 1.5,
    borderColor: '#c7d5f8',
  },
  pressCell: {
    backgroundColor: '#ffffff',
    borderWidth: 1,
    borderColor: '#e5e5ea',
  },
  inputText: {
    textAlign: 'center',
    fontSize: 18,
    fontWeight: '700',
    color: '#007AFF',
    padding: 0,
  },
  cellStep: {
    fontSize: 18,
    fontWeight: '700',
    color: '#007AFF',
  },
  legend: {
    flexDirection: 'row',
    gap: 16,
  },
  legendItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  legendDot: {
    width: 12,
    height: 12,
    borderRadius: 3,
  },
  legendInput: {
    backgroundColor: '#f0f4ff',
    borderWidth: 1.5,
    borderColor: '#c7d5f8',
  },
  legendPress: {
    backgroundColor: '#ffffff',
    borderWidth: 1,
    borderColor: '#e5e5ea',
  },
  legendText: {
    fontSize: 12,
    color: '#6b6b6b',
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
