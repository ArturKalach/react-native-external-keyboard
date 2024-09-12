import React, { forwardRef } from 'react';
import {
  NativeSyntheticEvent,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import {
  Pressable,
  TouchableOpacity,
  TouchableWithoutFeedback,
  KeyboardExtendedInput,
  KeyboardExtendedBaseView,
  type KeyboardFocus,
  type KeyPress,
} from 'react-native-external-keyboard';

export const ComponentsExample = forwardRef<KeyboardFocus, {}>((_, ref) => {
  const [isKeyDown, setIsKeyDown] = React.useState(true);
  const [textInput, setTextInput] = React.useState('Input here!');
  const [keyInfo, setKeyInfo] = React.useState<KeyPress | undefined>(undefined);

  const onKeyUpHandler = (e: NativeSyntheticEvent<KeyPress>) => {
    setIsKeyDown(false);
    setKeyInfo(e.nativeEvent);
  };
  const onKeyDownHandler = (e: NativeSyntheticEvent<KeyPress>) => {
    setIsKeyDown(true);
    setKeyInfo(e.nativeEvent);
  };

  return (
    <ScrollView style={styles.container}>
      <TouchableOpacity
        onPress={() => console.log(1)}
        onLongPress={() => console.log(11)}
        ref={ref}
        style={styles.marginBottom}
      >
        <View style={styles.touchable}>
          <Text>TouchableOpacity</Text>
        </View>
      </TouchableOpacity>
      <TouchableWithoutFeedback
        haloEffect={false}
        containerStyle={styles.marginBottom}
        onPress={() => console.log(2)}
        onLongPress={() => console.log(22)}
      >
        <View style={styles.touchable}>
          <Text>TouchableWithoutEffect</Text>
        </View>
      </TouchableWithoutFeedback>
      <Pressable
        tintColor="#00ffff"
        containerStyle={styles.marginBottom}
        style={styles.pressable}
        onPress={() => console.log(3)}
        onLongPress={() => console.log(33)}
      >
        <Text>Pressable: Focus Modal</Text>
      </Pressable>
      <Text>Label: </Text>
      <KeyboardExtendedInput
        focusable={true}
        value={textInput}
        onChangeText={setTextInput}
        containerStyle={styles.doubleBottom}
        style={styles.input}
      />
      <Text>Key tracker:</Text>
      <Pressable
        onPress={() => console.log(4)}
        onLongPress={() => console.log(44)}
        containerStyle={styles.doubleBottom}
        style={styles.modalBtn}
      >
        <Text>Modal</Text>
      </Pressable>
      <KeyboardExtendedBaseView
        haloEffect={true}
        onKeyDownPress={onKeyDownHandler}
        onKeyUpPress={onKeyUpHandler}
        style={styles.keyHandler}
      >
        <View>
          <Text>{isKeyDown ? 'Press begin:' : 'Press ended:'}</Text>
          {Object.keys(keyInfo ?? {}).map((key) => (
            <View key={key}>
              {
                <Text>{`${key}: ${
                  (keyInfo as Record<string, string | number | boolean>)[key] ??
                  ''
                }`}</Text>
              }
            </View>
          ))}
        </View>
      </KeyboardExtendedBaseView>
    </ScrollView>
  );
});

const styles = StyleSheet.create({
  container: { flex: 1 },
  marginBottom: { marginBottom: 5 },
  doubleBottom: {
    marginBottom: 10,
  },
  input: {
    width: '100%',
    padding: 10,
    borderWidth: 1,
    borderRadius: 10,
  },
  touchable: {
    width: '100%',
    padding: 10,
    borderWidth: 2,
    borderRadius: 10,
  },
  pressable: {
    width: '100%',
    padding: 10,
    borderWidth: 2,
    borderRadius: 10,
  },
  modalBtn: {
    width: '100%',
    padding: 10,
    borderWidth: 2,
    borderRadius: 10,
  },
  keyHandler: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
    marginBottom: 5,
    borderRadius: 10,
  },
});
