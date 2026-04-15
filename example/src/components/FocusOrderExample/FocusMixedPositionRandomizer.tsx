import { useState } from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import {
  KeyboardExtendedInput,
  KeyboardOrderFocusGroup,
  Pressable,
} from 'react-native-external-keyboard';

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
  return shuffle(Array.from({ length: count }, (_i, i) => i));
}

export const FocusMixedPositionRandomizer = () => {
  const [order, setOrder] = useState(() => makeOrder(CELL_COUNT));

  const randomize = () => setOrder(makeOrder(CELL_COUNT));

  const rows = Math.ceil(CELL_COUNT / COLS);

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Mixed Position Randomizer</Text>
        <Text style={styles.description}>
          Press Randomize to reassign{' '}
          <Text style={styles.code}>orderIndex</Text> values across inputs and
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
                const orderIndex = order[gridIndex]!;

                if (isInput(gridIndex)) {
                  return (
                    <KeyboardExtendedInput
                      key={gridIndex}
                      orderIndex={orderIndex}
                      placeholder={String(orderIndex + 1)}
                      style={styles.inputText}
                      containerStyle={[styles.cell, styles.inputCell]}
                    />
                  );
                }

                return (
                  <Pressable
                    key={gridIndex}
                    orderIndex={orderIndex}
                    style={[styles.cell, styles.pressCell]}
                  >
                    <Text style={styles.cellIndex}>{orderIndex + 1}</Text>
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
      <TouchableOpacity style={styles.btn} onPress={randomize}>
        <Text style={styles.btnText}>⇄ Randomize</Text>
      </TouchableOpacity>
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
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.08,
    shadowRadius: 3,
    elevation: 2,
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
  cellIndex: {
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
