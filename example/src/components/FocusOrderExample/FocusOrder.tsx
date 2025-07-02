import { useRef } from 'react';
import { Button, StyleSheet, Text, View } from 'react-native';
import {
  KeyboardExtendedBaseView,
  KeyboardOrderFocusGroup,
  Pressable,
  type KeyboardFocus,
} from 'react-native-external-keyboard';

export const FocusOrder = ({ onChange }: { onChange: (v: number) => void }) => {
  const ref = useRef<KeyboardFocus>(null);
  const onPress = () => {
    ref.current?.focus();
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Focus Order</Text>
      <KeyboardOrderFocusGroup>
        <View style={styles.column}>
          <View style={styles.row}>
            <Pressable
              onPress={onPress}
              orderIndex={0}
              orderId="start"
              orderBackward="end"
              style={styles.block}
              lockFocus={['down', 'left']}
            >
              <Text>→</Text>
            </Pressable>
            <Pressable
              onPress={onPress}
              lockFocus={['down', 'left']}
              orderIndex={1}
              style={styles.block}
            >
              <Text>→</Text>
            </Pressable>
            <Pressable
              onPress={onPress}
              lockFocus={['left']}
              orderIndex={2}
              style={styles.block}
            >
              <Text>↓</Text>
            </Pressable>
          </View>
          <View style={styles.row}>
            <Pressable
              onPress={onPress}
              lockFocus={['up', 'right']}
              orderIndex={6}
              style={styles.block}
            >
              <Text>↓</Text>
            </Pressable>
            <Pressable
              onPress={onPress}
              lockFocus={['up', 'down', 'right']}
              orderIndex={5}
              style={styles.block}
            >
              <Text>←</Text>
            </Pressable>
            <Pressable
              onPress={onPress}
              lockFocus={['up', 'down', 'right']}
              orderIndex={4}
              style={styles.block}
            >
              <Text>←</Text>
            </Pressable>
          </View>
          <View style={styles.row}>
            <Pressable
              onPress={onPress}
              lockFocus={['up', 'down', 'left']}
              orderIndex={7}
              style={styles.block}
            >
              <Text>→</Text>
            </Pressable>
            <Pressable
              onPress={onPress}
              lockFocus={['up', 'down', 'left']}
              orderIndex={8}
              style={styles.block}
            >
              <Text>→</Text>
            </Pressable>
            <Pressable
              onPress={onPress}
              lockFocus={['up', 'down', 'left']}
              orderIndex={9}
              orderId="end"
              orderForward="start"
              style={styles.block}
            >
              <Text>↺</Text>
            </Pressable>
          </View>
        </View>
      </KeyboardOrderFocusGroup>
      <KeyboardExtendedBaseView ref={ref}>
        <Button title="DPad Order" onPress={() => onChange(1)} />
      </KeyboardExtendedBaseView>
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
