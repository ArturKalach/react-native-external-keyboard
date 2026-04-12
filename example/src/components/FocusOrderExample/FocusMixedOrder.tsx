import { StyleSheet, Text, View } from 'react-native';
import {
  KeyboardExtendedInput,
  KeyboardOrderFocusGroup,
  Pressable,
} from 'react-native-external-keyboard';

export const FocusMixedOrder = () => {
  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Mixed Order</Text>
        <Text style={styles.description}>
          Text inputs and pressables share the same focus order chain via{' '}
          <Text style={styles.code}>orderForward</Text> /{' '}
          <Text style={styles.code}>orderBackward</Text>.
        </Text>
      </View>
      <KeyboardOrderFocusGroup>
        <View style={styles.grid}>
          <View style={styles.row}>
            <KeyboardExtendedInput
              orderForward="c1"
              orderId="start"
              orderBackward="end"
              lockFocus={['down', 'left']}
              placeholder="→"
              style={styles.inputText}
              containerStyle={[styles.cell, styles.inputCell]}
            />
            <Pressable
              orderId="c1"
              orderForward="c2"
              orderBackward="start"
              lockFocus={['down', 'left']}
              style={[styles.cell, styles.pressCell]}
            >
              <Text style={styles.pressArrow}>→</Text>
            </Pressable>
            <KeyboardExtendedInput
              orderId="c2"
              orderForward="c3"
              orderBackward="c1"
              lockFocus={['left']}
              placeholder="↓"
              style={styles.inputText}
              containerStyle={[styles.cell, styles.inputCell]}
            />
          </View>
          <View style={styles.row}>
            <Pressable
              orderId="c5"
              orderForward="c6"
              orderBackward="c4"
              lockFocus={['up', 'right']}
              style={[styles.cell, styles.pressCell]}
            >
              <Text style={styles.pressArrow}>↓</Text>
            </Pressable>
            <KeyboardExtendedInput
              orderId="c4"
              orderForward="c5"
              orderBackward="c3"
              lockFocus={['up', 'down', 'right']}
              placeholder="←"
              style={styles.inputText}
              containerStyle={[styles.cell, styles.inputCell]}
            />
            <Pressable
              orderId="c3"
              orderForward="c4"
              orderBackward="c2"
              lockFocus={['up', 'down', 'right']}
              style={[styles.cell, styles.pressCell]}
            >
              <Text style={styles.pressArrow}>←</Text>
            </Pressable>
          </View>
          <View style={styles.row}>
            <KeyboardExtendedInput
              orderId="c6"
              orderForward="c7"
              orderBackward="c5"
              lockFocus={['up', 'down', 'left']}
              placeholder="→"
              style={styles.inputText}
              containerStyle={[styles.cell, styles.inputCell]}
            />
            <Pressable
              orderId="c7"
              orderBackward="c6"
              orderForward="end"
              lockFocus={['up', 'down', 'left']}
              style={[styles.cell, styles.pressCell]}
            >
              <Text style={styles.pressArrow}>→</Text>
            </Pressable>
            <KeyboardExtendedInput
              orderId="end"
              orderBackward="c7"
              orderForward="start"
              lockFocus={['up', 'down', 'left']}
              placeholder="↺"
              style={styles.inputText}
              containerStyle={[styles.cell, styles.inputCell, styles.cellEnd]}
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
          <View style={[styles.legendDot, styles.legendPress]} />
          <Text style={styles.legendText}>Pressable</Text>
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
  code: {
    fontFamily: 'Menlo',
    fontSize: 12,
    color: '#5856D6',
  },
  grid: {
    gap: 8,
  },
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
  cellEnd: {
    backgroundColor: '#e8f4ff',
    borderColor: '#a8d4f8',
  },
  inputText: {
    textAlign: 'center',
    fontSize: 18,
    fontWeight: '600',
    color: '#007AFF',
    padding: 0,
  },
  pressArrow: {
    fontSize: 20,
    color: '#1c1c1e',
    fontWeight: '500',
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
});
