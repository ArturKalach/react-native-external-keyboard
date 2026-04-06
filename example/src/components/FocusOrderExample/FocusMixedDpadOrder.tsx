import { useRef, useState } from 'react';
import { StyleSheet, Text, View, Button } from 'react-native';
import {
  KeyboardExtendedInput,
  Pressable,
  type KeyboardFocus,
} from 'react-native-external-keyboard';

const list = ['0_0', '0_1', '0_2', '1_0', '1_1', '1_2', '2_0', '2_1', '2_2'];
const arrows = ['⇖', '⇑', '⇗', '⇐', '⊙', '⇒', '⇙', '⇓', '⇘'];

export const FocusMixedDpadOrder = ({
  onChange,
}: {
  onChange: (v: number) => void;
}) => {
  const [state, setState] = useState<number>(0);
  const role = () => {
    setState((i) => (i === list.length - 1 ? 0 : i + 1));
  };

  const ref = useRef<KeyboardFocus>(null);

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Mixed DPad</Text>
      <View style={styles.column}>
        <View style={styles.row}>
          <KeyboardExtendedInput
            orderId="0_0"
            orderRight="0_2"
            orderDown="2_0"
            placeholder="↓→"
            style={styles.inputText}
            containerStyle={styles.block}
          />
          <Pressable orderId="0_1" style={styles.block}>
            <Text>=</Text>
          </Pressable>
          <KeyboardExtendedInput
            orderId="0_2"
            orderLeft="0_0"
            orderDown="2_2"
            placeholder="←↓"
            style={styles.inputText}
            containerStyle={styles.block}
          />
        </View>
        <View style={styles.row}>
          <Pressable orderId="1_0" style={styles.block}>
            <Text>‖</Text>
          </Pressable>
          <Pressable
            ref={ref}
            orderLeft={list[state]}
            orderRight={list[state]}
            orderUp={list[state]}
            orderDown={list[state]}
            onPress={role}
            orderId="1_1"
            style={styles.block}
          >
            <Text>{arrows[state]}</Text>
          </Pressable>
          <Pressable orderId="1_2" style={styles.block}>
            <Text>‖</Text>
          </Pressable>
        </View>
        <View style={styles.row}>
          <KeyboardExtendedInput
            orderId="2_0"
            orderUp="0_0"
            orderRight="2_2"
            placeholder="↑→"
            style={styles.inputText}
            containerStyle={styles.block}
          />
          <Pressable orderId="2_1" style={styles.block}>
            <Text>=</Text>
          </Pressable>
          <KeyboardExtendedInput
            orderId="2_2"
            orderLeft="2_0"
            orderUp="0_2"
            placeholder="↑←"
            style={styles.inputText}
            containerStyle={styles.block}
          />
        </View>
      </View>
      <Button title="Focus Order" onPress={() => onChange(0)} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    gap: 12,
  },
  column: {
    flexDirection: 'column',
    gap: 2,
  },
  row: { flexDirection: 'row', gap: 2 },
  title: { fontSize: 24 },
  block: {
    width: 60,
    height: 60,
    borderWidth: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  inputText: {
    textAlign: 'center',
    fontSize: 16,
    padding: 0,
  },
});
