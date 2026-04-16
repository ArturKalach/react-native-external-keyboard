import { useRef } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import {
  KeyboardOrderFocusGroup,
  Pressable,
  type KeyboardFocus,
} from 'react-native-external-keyboard';
import { ANDROID_FOCUS_STYLE } from '../../constants/styles';

export const FocusLinkOrder = () => {
  const ref = useRef<KeyboardFocus>(null);
  const onPress = () => {
    ref.current?.focus();
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Focus Link Order</Text>
        <Text style={styles.description}>
          Each cell explicitly links to the next and previous cell via{' '}
          <Text style={styles.code}>orderForward</Text> /{' '}
          <Text style={styles.code}>orderBackward</Text> IDs.
        </Text>
      </View>
      <KeyboardOrderFocusGroup>
        <View style={styles.grid}>
          <View style={styles.row}>
            <Pressable
              onPress={onPress}
              orderId="start"
              orderBackward="end"
              orderForward="0_1"
              style={styles.cell}
              focusStyle={ANDROID_FOCUS_STYLE}
              defaultFocusHighlightEnabled={false}
              lockFocus={['down', 'left']}
            >
              <Text style={styles.cellIndex}>1</Text>
              <Text style={styles.cellArrow}>→</Text>
            </Pressable>
            <Pressable
              onPress={onPress}
              orderId="0_1"
              orderBackward="start"
              orderForward="0_2"
              lockFocus={['down', 'left']}
              style={styles.cell}
              focusStyle={ANDROID_FOCUS_STYLE}
              defaultFocusHighlightEnabled={false}
            >
              <Text style={styles.cellIndex}>2</Text>
              <Text style={styles.cellArrow}>→</Text>
            </Pressable>
            <Pressable
              onPress={onPress}
              orderId="0_2"
              orderBackward="0_1"
              orderForward="1_2"
              lockFocus={['left']}
              style={styles.cell}
              focusStyle={ANDROID_FOCUS_STYLE}
              defaultFocusHighlightEnabled={false}
            >
              <Text style={styles.cellIndex}>3</Text>
              <Text style={styles.cellArrow}>↓</Text>
            </Pressable>
          </View>
          <View style={styles.row}>
            <Pressable
              onPress={onPress}
              orderId="1_0"
              orderBackward="1_1"
              orderForward="2_0"
              lockFocus={['up', 'right']}
              style={styles.cell}
              focusStyle={ANDROID_FOCUS_STYLE}
              defaultFocusHighlightEnabled={false}
            >
              <Text style={styles.cellIndex}>7</Text>
              <Text style={styles.cellArrow}>↓</Text>
            </Pressable>
            <Pressable
              onPress={onPress}
              orderId="1_1"
              orderForward="1_0"
              orderBackward="1_2"
              lockFocus={['up', 'down', 'right']}
              style={styles.cell}
              focusStyle={ANDROID_FOCUS_STYLE}
              defaultFocusHighlightEnabled={false}
            >
              <Text style={styles.cellIndex}>6</Text>
              <Text style={styles.cellArrow}>←</Text>
            </Pressable>
            <Pressable
              onPress={onPress}
              orderId="1_2"
              orderBackward="0_2"
              orderForward="1_1"
              lockFocus={['up', 'down', 'right']}
              style={styles.cell}
              focusStyle={ANDROID_FOCUS_STYLE}
              defaultFocusHighlightEnabled={false}
            >
              <Text style={styles.cellIndex}>4</Text>
              <Text style={styles.cellArrow}>←</Text>
            </Pressable>
          </View>
          <View style={styles.row}>
            <Pressable
              onPress={onPress}
              orderId="2_0"
              orderBackward="1_0"
              orderForward="2_1"
              lockFocus={['up', 'down', 'left']}
              style={styles.cell}
              focusStyle={ANDROID_FOCUS_STYLE}
              defaultFocusHighlightEnabled={false}
            >
              <Text style={styles.cellIndex}>8</Text>
              <Text style={styles.cellArrow}>→</Text>
            </Pressable>
            <Pressable
              onPress={onPress}
              orderId="2_1"
              orderForward="end"
              orderBackward="2_0"
              lockFocus={['up', 'down', 'left']}
              style={styles.cell}
              focusStyle={ANDROID_FOCUS_STYLE}
              defaultFocusHighlightEnabled={false}
            >
              <Text style={styles.cellIndex}>9</Text>
              <Text style={styles.cellArrow}>→</Text>
            </Pressable>
            <Pressable
              onPress={onPress}
              lockFocus={['up', 'left']}
              orderId="end"
              orderForward="start"
              orderBackward="2_1"
              style={[styles.cell, styles.cellEnd]}
              focusStyle={ANDROID_FOCUS_STYLE}
              defaultFocusHighlightEnabled={false}
            >
              <Text style={styles.cellIndex}>↺</Text>
              <Text style={styles.cellArrow}>loop</Text>
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
    backgroundColor: '#ffffff',
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 2,
  },
  cellEnd: {
    backgroundColor: '#e8f4ff',
  },
  cellIndex: {
    fontSize: 18,
    fontWeight: '700',
    color: '#007AFF',
  },
  cellArrow: {
    fontSize: 11,
    color: '#8e8e93',
  },
});
