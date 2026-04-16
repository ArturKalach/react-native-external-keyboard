import { useRef } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import {
  KeyboardOrderFocusGroup,
  Pressable,
  type KeyboardFocus,
} from 'react-native-external-keyboard';
import { ANDROID_FOCUS_STYLE } from '../../constants/styles';

export const FocusOrder = () => {
  const ref = useRef<KeyboardFocus>(null);
  const onPress = () => {
    ref.current?.focus();
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Focus Order</Text>
        <Text style={styles.description}>
          Tab / Shift+Tab cycles through cells in index order. Numbers show the
          focus sequence.
        </Text>
      </View>
      <KeyboardOrderFocusGroup>
        <View style={styles.grid}>
          <View style={styles.row}>
            <Pressable
              onPress={onPress}
              orderIndex={0}
              orderId="start"
              orderBackward="end"
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
              lockFocus={['down', 'left']}
              orderIndex={1}
              style={styles.cell}
              focusStyle={ANDROID_FOCUS_STYLE}
              defaultFocusHighlightEnabled={false}
            >
              <Text style={styles.cellIndex}>2</Text>
              <Text style={styles.cellArrow}>→</Text>
            </Pressable>
            <Pressable
              onPress={onPress}
              lockFocus={['left', 'right']}
              orderIndex={2}
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
              lockFocus={['up', 'right']}
              orderIndex={6}
              style={styles.cell}
              focusStyle={ANDROID_FOCUS_STYLE}
              defaultFocusHighlightEnabled={false}
            >
              <Text style={styles.cellIndex}>7</Text>
              <Text style={styles.cellArrow}>↓</Text>
            </Pressable>
            <Pressable
              onPress={onPress}
              lockFocus={['up', 'down', 'right']}
              orderIndex={5}
              style={styles.cell}
              focusStyle={ANDROID_FOCUS_STYLE}
              defaultFocusHighlightEnabled={false}
            >
              <Text style={styles.cellIndex}>6</Text>
              <Text style={styles.cellArrow}>←</Text>
            </Pressable>
            <Pressable
              onPress={onPress}
              lockFocus={['up', 'down', 'right']}
              orderIndex={4}
              style={styles.cell}
              focusStyle={ANDROID_FOCUS_STYLE}
              defaultFocusHighlightEnabled={false}
            >
              <Text style={styles.cellIndex}>5</Text>
              <Text style={styles.cellArrow}>←</Text>
            </Pressable>
          </View>
          <View style={styles.row}>
            <Pressable
              onPress={onPress}
              lockFocus={['up', 'down', 'left']}
              orderIndex={7}
              style={styles.cell}
              focusStyle={ANDROID_FOCUS_STYLE}
              defaultFocusHighlightEnabled={false}
            >
              <Text style={styles.cellIndex}>8</Text>
              <Text style={styles.cellArrow}>→</Text>
            </Pressable>
            <Pressable
              onPress={onPress}
              lockFocus={['up', 'down', 'left']}
              orderIndex={8}
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
              orderIndex={9}
              orderId="end"
              orderForward="start"
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
