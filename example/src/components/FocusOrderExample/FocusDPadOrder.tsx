import { useRef, useState } from 'react';
import { Button, StyleSheet, Text, View } from 'react-native';
import { Pressable, type KeyboardFocus } from 'react-native-external-keyboard';

const list = ['0_0', '0_1', '0_2', '1_0', '1_1', '1_2', '2_0', '2_1', '2_2'];
const arrows = ['⇖', '⇑', '⇗', '⇐', '⊙', '⇒', '⇙', '⇓', '⇘'];

export const FocusDPadOrder = ({
  onChange,
}: {
  onChange: (v: number) => void;
}) => {
  const [state, setState] = useState<number>(0);
  const role = () => {
    setState((i) => (i === list.length - 1 ? 0 : i + 1));
  };

  const ref = useRef<KeyboardFocus>(null);
  const onPress = () => {
    ref.current?.focus();
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>DPad</Text>
      <View style={styles.column}>
        <View style={styles.row}>
          <Pressable
            orderId="0_0"
            orderDown="2_0"
            orderRight="0_2"
            onPress={onPress}
            style={styles.block}
          >
            <Text>→</Text>
            <Text>↓</Text>
          </Pressable>
          <Pressable onPress={onPress} orderId="0_1" style={styles.block}>
            <Text>=</Text>
          </Pressable>
          <Pressable
            onPress={onPress}
            orderId="0_2"
            orderDown="2_2"
            orderLeft="0_0"
            style={styles.block}
          >
            <Text>←</Text>
            <Text>↓</Text>
          </Pressable>
        </View>
        <View style={styles.row}>
          <Pressable onPress={onPress} orderId="1_0" style={styles.block}>
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
          <Pressable onPress={onPress} orderId="1_2" style={styles.block}>
            <Text>‖</Text>
          </Pressable>
        </View>
        <View style={styles.row}>
          <Pressable
            orderId="2_0"
            orderUp="0_0"
            orderRight="2_2"
            onPress={onPress}
            style={styles.block}
          >
            <Text>↑</Text>
            <Text>→</Text>
          </Pressable>
          <Pressable onPress={onPress} orderId="2_1" style={styles.block}>
            <Text>=</Text>
          </Pressable>
          <Pressable
            onPress={onPress}
            orderId="2_2"
            orderUp="0_2"
            orderLeft="2_0"
            style={styles.block}
          >
            <Text>↑</Text>
            <Text>←</Text>
          </Pressable>
        </View>
      </View>
      <Button title="Focus Order" onPress={() => onChange(0)} />
      <Button title="Focus Link Order" onPress={() => onChange(2)} />
    </View>
  );
};

const styles = StyleSheet.create({
  flex: {
    flex: 1,
  },
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
    width: 50,
    height: 50,
    borderWidth: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
