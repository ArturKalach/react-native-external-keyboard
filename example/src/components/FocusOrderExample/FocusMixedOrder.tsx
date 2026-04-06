import { StyleSheet, Text, View, Button } from 'react-native';
import {
  KeyboardExtendedInput,
  KeyboardOrderFocusGroup,
  Pressable,
} from 'react-native-external-keyboard';

export const FocusMixedOrder = ({
  onChange,
}: {
  onChange: (v: number) => void;
}) => {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Mixed Order</Text>
      <KeyboardOrderFocusGroup>
        <View style={styles.column}>
          <View style={styles.row}>
            <KeyboardExtendedInput
              orderForward="c1"
              orderId="start"
              orderBackward="end"
              lockFocus={['down', 'left']}
              placeholder="→"
              style={styles.inputText}
              containerStyle={styles.block}
            />
            <Pressable
              orderId="c1"
              orderForward="c2"
              orderBackward="start"
              lockFocus={['down', 'left']}
              style={styles.block}
            >
              <Text>→</Text>
            </Pressable>
            <KeyboardExtendedInput
              orderId="c2"
              orderForward="c3"
              orderBackward="c1"
              lockFocus={['left']}
              placeholder="↓"
              style={styles.inputText}
              containerStyle={styles.block}
            />
          </View>
          <View style={styles.row}>
            <Pressable
              orderId="c5"
              orderForward="c6"
              orderBackward="c4"
              lockFocus={['up', 'right']}
              style={styles.block}
            >
              <Text>↓</Text>
            </Pressable>
            <KeyboardExtendedInput
              orderId="c4"
              orderForward="c5"
              orderBackward="c3"
              lockFocus={['up', 'down', 'right']}
              placeholder="←"
              style={styles.inputText}
              containerStyle={styles.block}
            />
            <Pressable
              orderId="c3"
              orderForward="c4"
              orderBackward="c2"
              lockFocus={['up', 'down', 'right']}
              style={styles.block}
            >
              <Text>←</Text>
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
              containerStyle={styles.block}
            />
            <Pressable
              orderId="c7"
              orderBackward="c6"
              orderForward="end"
              lockFocus={['up', 'down', 'left']}
              style={styles.block}
            >
              <Text>→</Text>
            </Pressable>
            <KeyboardExtendedInput
              orderId="end"
              orderBackward="c7"
              orderForward="start"
              lockFocus={['up', 'down', 'left']}
              placeholder="↺"
              style={styles.inputText}
              containerStyle={styles.block}
            />
          </View>
        </View>
      </KeyboardOrderFocusGroup>
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
    width: 50,
    height: 50,
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
