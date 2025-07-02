import { useRef } from 'react';
import { Button, StyleSheet, Text, View } from 'react-native';
import {
  KeyboardExtendedBaseView,
  Pressable,
  type KeyboardFocus,
} from 'react-native-external-keyboard';

export const FocusLinkOrder = ({
  onChange,
}: {
  onChange: (v: number) => void;
}) => {
  const ref = useRef<KeyboardFocus>(null);
  const onPress = () => {
    ref.current?.focus();
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Focus Link Order</Text>
      <View style={styles.column}>
        <View style={styles.row}>
          <Pressable
            onPress={onPress}
            orderId="start"
            orderBackward="end"
            orderForward="0_1"
            style={styles.block}
            lockFocus={['down', 'left']}
          >
            <Text>→</Text>
          </Pressable>
          <Pressable
            onPress={onPress}
            orderId="0_1"
            orderBackward="start"
            orderForward="0_2"
            lockFocus={['down', 'left']}
            style={styles.block}
          >
            <Text>→</Text>
          </Pressable>
          <Pressable
            onPress={onPress}
            orderId="0_2"
            orderBackward="0_1"
            orderForward="1_2"
            lockFocus={['left']}
            style={styles.block}
          >
            <Text>↓</Text>
          </Pressable>
        </View>
        <View style={styles.row}>
          <Pressable
            onPress={onPress}
            orderId="1_0"
            orderBackward="1_1"
            orderForward="2_0"
            lockFocus={['up', 'right']}
            style={styles.block}
          >
            <Text>↓</Text>
          </Pressable>
          <Pressable
            onPress={onPress}
            orderId="1_1"
            orderForward="1_0"
            orderBackward="1_2"
            lockFocus={['up', 'down', 'right']}
            style={styles.block}
          >
            <Text>←</Text>
          </Pressable>
          <Pressable
            onPress={onPress}
            orderId="1_2"
            orderBackward="0_2"
            orderForward="1_1"
            lockFocus={['up', 'down', 'right']}
            style={styles.block}
          >
            <Text>←</Text>
          </Pressable>
        </View>
        <View style={styles.row}>
          <Pressable
            onPress={onPress}
            orderId="2_0"
            orderBackward="1_0"
            orderForward="2_1"
            lockFocus={['up', 'down', 'left']}
            style={styles.block}
          >
            <Text>→</Text>
          </Pressable>
          <Pressable
            onPress={onPress}
            orderId="2_1"
            orderForward="end"
            orderBackward="2_0"
            lockFocus={['up', 'down', 'left']}
            style={styles.block}
          >
            <Text>→</Text>
          </Pressable>
          <Pressable
            onPress={onPress}
            lockFocus={['up', 'down', 'left']}
            orderId="end"
            orderForward="start"
            orderBackward="2_1"
            style={styles.block}
          >
            <Text>↺</Text>
          </Pressable>
        </View>
      </View>
      <KeyboardExtendedBaseView ref={ref}>
        <Button title="DPad Order" onPress={() => onChange(1)} />
      </KeyboardExtendedBaseView>
      <Button title="Focus Order" onPress={() => onChange(0)} />
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
