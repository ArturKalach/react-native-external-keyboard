import React, { forwardRef, useRef } from 'react';
import {
  Modal,
  TouchableOpacity as RNTouchableOpacity,
  TouchableWithoutFeedback as RNTouchableWithoutFeedback,
} from 'react-native';
import {
  NativeSyntheticEvent,
  ScrollView,
  StyleSheet,
  Text,
  Pressable as RNPressable,
  View,
} from 'react-native';
import {
  KeyboardExtendedInput,
  KeyboardExtendedBaseView,
  type KeyboardFocus,
  type KeyPress,
  withKeyboardFocus,
} from 'react-native-external-keyboard';

const Pressable = withKeyboardFocus(RNPressable);
const TouchableOpacity = withKeyboardFocus(RNTouchableOpacity);
const TouchableWithoutFeedback = withKeyboardFocus(RNTouchableWithoutFeedback);
export const ComponentsExample = forwardRef<KeyboardFocus, {}>((_, ref) => {
  const modalButtonRef = useRef<KeyboardFocus>(null);
  const [isKeyDown, setIsKeyDown] = React.useState(true);
  const [textInput, setTextInput] = React.useState('Input here!');
  const [multilineTextInput, setMultilineTextInput] = React.useState(
    'Multiline input here!'
  );

  const [keyInfo, setKeyInfo] = React.useState<KeyPress | undefined>(undefined);
  const [showModal, setShowModal] = React.useState(false);
  const [dShow, setDShow] = React.useState(false);

  const onKeyUpHandler = (e: NativeSyntheticEvent<KeyPress>) => {
    setIsKeyDown(false);
    setKeyInfo(e.nativeEvent);
  };
  const onKeyDownHandler = (e: NativeSyntheticEvent<KeyPress>) => {
    setIsKeyDown(true);
    setKeyInfo(e.nativeEvent);
  };

  return (
    <ScrollView
      contentContainerStyle={styles.contentContainer}
      style={styles.container}
    >
      <TouchableOpacity
        onPress={() => {
          console.log(1);
          setDShow((v: boolean) => !v);
        }}
        onLongPress={() => console.log(11)}
        ref={ref}
        style={styles.pressable}
        containerStyle={styles.pressableContainer}
      >
        <Text>TouchableOpacity</Text>
      </TouchableOpacity>
      {dShow && (
        <Pressable autoFocus>
          <View>
            <Text>Display</Text>
          </View>
        </Pressable>
      )}
      <TouchableWithoutFeedback
        autoFocus
        containerStyle={styles.pressableContainer}
        onPress={() => console.log(2)}
        onLongPress={() => console.log(22)}
      >
        <View style={styles.pressable}>
          <Text>TouchableWithoutEffect</Text>
        </View>
      </TouchableWithoutFeedback>
      <Pressable
        // autoFocus
        containerStyle={styles.pressableContainer}
        style={styles.pressable}
        onPress={() => modalButtonRef.current?.focus()}
        onLongPress={() => console.log(33)}
      >
        <Text>Pressable: Focus Modal</Text>
      </Pressable>
      <Text>Label: KeyboardExtendedInput </Text>
      <KeyboardExtendedInput
        focusable={true}
        value={textInput}
        onChangeText={setTextInput}
        containerStyle={styles.doubleBottom}
        style={styles.input}
      />
      <Text>Label: Multiline</Text>
      <KeyboardExtendedInput
        focusable={true}
        value={multilineTextInput}
        multiline
        onSubmitEditing={() => console.log('OnSubmitEditing: multiline')}
        onChangeText={setMultilineTextInput}
        containerStyle={styles.doubleBottom}
        style={styles.input}
      />
      <Text>Key tracker:</Text>
      <Pressable
        ref={modalButtonRef}
        onPress={() => setShowModal(true)}
        containerStyle={styles.pressableContainer}
        style={styles.pressable}
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
      <Modal visible={showModal}>
        <View style={styles.modal}>
          <View>
            <Pressable onPress={() => setShowModal(false)}>
              <Text>Modal example</Text>
            </Pressable>
            <Pressable autoFocus onPress={() => setShowModal(false)}>
              <Text>AutoFocus</Text>
            </Pressable>
            <Pressable onPress={() => setShowModal(false)}>
              <Text>Close</Text>
            </Pressable>
          </View>
        </View>
      </Modal>
    </ScrollView>
  );
});

const styles = StyleSheet.create({
  container: { flex: 1, paddingHorizontal: 10 },
  contentContainer: {
    backgroundColor: '#ffffff',
    flex: 1,
    padding: 10,
    borderRadius: 15,
  },
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
  modal: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  pressableContainer: {
    borderRadius: 10,
    borderWidth: 2,
    marginBottom: 10,
  },
  pressable: {
    width: '100%',
    padding: 10,
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
