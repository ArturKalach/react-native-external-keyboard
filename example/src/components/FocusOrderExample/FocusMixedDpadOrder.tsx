import { useRef, useState } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import {
  KeyboardExtendedInput,
  KeyboardOrderFocusGroup,
  Pressable,
  type KeyboardFocus,
} from 'react-native-external-keyboard';
import {
  ANDROID_FOCUS_STYLE,
  ANDROID_SECONDARY_FOCUS_STYLE,
} from '../../constants/styles';

const list = ['0_0', '0_1', '0_2', '1_0', '1_1', '1_2', '2_0', '2_1', '2_2'];
const arrows = ['⇖', '⇑', '⇗', '⇐', '⊙', '⇒', '⇙', '⇓', '⇘'];

export const FocusMixedDpadOrder = () => {
  const [state, setState] = useState<number>(4);
  const role = () => {
    setState((i) => (i === list.length - 1 ? 0 : i + 1));
  };

  const ref = useRef<KeyboardFocus>(null);

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Mixed DPad</Text>
        <Text style={styles.description}>
          Arrow keys navigate between inputs and buttons in a grid. Center cell
          links change on press.
        </Text>
      </View>
      <KeyboardOrderFocusGroup>
        <View style={styles.grid}>
          <View style={styles.row}>
            <KeyboardExtendedInput
              orderId="0_0"
              orderRight="0_2"
              orderDown="2_0"
              placeholder="→↓"
              style={styles.inputText}
              defaultFocusHighlightEnabled={false}
              containerStyle={[styles.cell, styles.inputCell]}
              containerFocusStyle={ANDROID_FOCUS_STYLE}
            />
            <Pressable
              orderId="0_1"
              orderLeft="0_0"
              orderRight="0_2"
              defaultFocusHighlightEnabled={false}
              style={[styles.cell, styles.pressCell, styles.cellDim]}
              focusStyle={ANDROID_FOCUS_STYLE}
            >
              <Text style={styles.pressSymbol}>—</Text>
            </Pressable>
            <KeyboardExtendedInput
              orderId="0_2"
              orderLeft="0_0"
              orderDown="2_2"
              placeholder="←↓"
              style={styles.inputText}
              defaultFocusHighlightEnabled={false}
              containerStyle={[styles.cell, styles.inputCell]}
              containerFocusStyle={ANDROID_FOCUS_STYLE}
            />
          </View>
          <View style={styles.row}>
            <Pressable
              orderUp="0_0"
              orderId="1_0"
              orderDown="2_0"
              style={[styles.cell, styles.pressCell, styles.cellDim]}
              defaultFocusHighlightEnabled={false}
              focusStyle={ANDROID_FOCUS_STYLE}
            >
              <Text style={styles.pressSymbol}>—</Text>
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
              defaultFocusHighlightEnabled={false}
              focusStyle={ANDROID_SECONDARY_FOCUS_STYLE}
            >
              <Text style={styles.centerArrow}>{arrows[state]}</Text>
            </Pressable>
            <Pressable
              orderUp="0_2"
              orderId="1_2"
              orderDown="2_2"
              style={[styles.cell, styles.pressCell, styles.cellDim]}
              defaultFocusHighlightEnabled={false}
              focusStyle={ANDROID_FOCUS_STYLE}
            >
              <Text style={styles.pressSymbol}>—</Text>
            </Pressable>
          </View>
          <View style={styles.row}>
            <KeyboardExtendedInput
              orderId="2_0"
              orderUp="0_0"
              orderRight="2_2"
              placeholder="↑→"
              style={styles.inputText}
              containerStyle={[styles.cell, styles.inputCell]}
              defaultFocusHighlightEnabled={false}
              containerFocusStyle={ANDROID_FOCUS_STYLE}
            />
            <Pressable
              orderLeft="2_0"
              orderId="2_1"
              orderRight="2_2"
              style={[styles.cell, styles.pressCell, styles.cellDim]}
              defaultFocusHighlightEnabled={false}
              focusStyle={ANDROID_FOCUS_STYLE}
            >
              <Text style={styles.pressSymbol}>—</Text>
            </Pressable>
            <KeyboardExtendedInput
              orderId="2_2"
              orderLeft="2_0"
              orderUp="0_2"
              placeholder="↑←"
              style={styles.inputText}
              containerStyle={[styles.cell, styles.inputCell]}
              defaultFocusHighlightEnabled={false}
              containerFocusStyle={ANDROID_FOCUS_STYLE}
            />
          </View>
        </View>
      </KeyboardOrderFocusGroup>
      <View style={styles.legend}>
        <View style={styles.legendItem}>
          <View style={[styles.legendDot, styles.legendInput]} />
          <Text style={styles.legendText}>Text Input</Text>
        </View>
        <View style={styles.legendItem}>
          <View style={[styles.legendDot, styles.legendCenter]} />
          <Text style={styles.legendText}>Interactive</Text>
        </View>
      </View>
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
  cellDim: {
    backgroundColor: '#f2f2f7',
    borderColor: '#e5e5ea',
    shadowOpacity: 0,
    elevation: 0,
  },
  cellCenter: {
    backgroundColor: '#007AFF',
    shadowOpacity: 0.15,
  },
  inputText: {
    textAlign: 'center',
    fontSize: 16,
    fontWeight: '600',
    color: '#007AFF',
    padding: 0,
  },
  pressSymbol: {
    fontSize: 18,
    color: '#c7c7cc',
  },
  centerArrow: {
    fontSize: 28,
    color: '#ffffff',
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
  legendCenter: {
    backgroundColor: '#007AFF',
  },
  legendText: {
    fontSize: 12,
    color: '#6b6b6b',
  },
});
