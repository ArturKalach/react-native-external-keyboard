import { useNavigation } from '@react-navigation/native';
import React, { forwardRef, useRef } from 'react';
import {
  Modal,
  TouchableOpacity as RNTouchableOpacity,
  TouchableWithoutFeedback as RNTouchableWithoutFeedback,
} from 'react-native';
import {
  type NativeSyntheticEvent,
  ScrollView,
  StyleSheet,
  Text,
  Pressable as RNPressable,
  View,
} from 'react-native';
import {
  KeyboardExtendedInput,
  KeyboardExtendedBaseView,
  type KeyPress,
  withKeyboardFocus,
  KeyboardFocusGroup,
  Keyboard,
  type BaseKeyboardViewType,
} from 'react-native-external-keyboard';
import { ANDROID_FOCUS_STYLE } from '../../constants/styles';

const Pressable = withKeyboardFocus(RNPressable);
const TouchableOpacity = withKeyboardFocus(RNTouchableOpacity);
const TouchableWithoutFeedback = withKeyboardFocus(RNTouchableWithoutFeedback);

const RenderContent = ({
  pressed,
  focused,
}: {
  pressed?: boolean;
  focused?: boolean;
}) => (
  <View style={styles.pressable}>
    <Text>{pressed ? 'Pressed' : focused ? 'Focused' : 'Not Pressed'}</Text>
  </View>
);
export const ComponentsExample = forwardRef<BaseKeyboardViewType, {}>(
  (_, ref) => {
    const navigation = useNavigation();
    const modalButtonRef = useRef<BaseKeyboardViewType>(null);
    const [isKeyDown, setIsKeyDown] = React.useState(true);
    const [textInput, setTextInput] = React.useState('Input here!');
    const [multilineTextInput, setMultilineTextInput] = React.useState(
      'Multiline input here!'
    );

    const [keyInfo, setKeyInfo] = React.useState<KeyPress | undefined>(
      undefined
    );
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

    const onKeyDownPressHandler = (e: NativeSyntheticEvent<KeyPress>) => {
      console.log('down', e.nativeEvent.keyCode);
    };

    const onKeyUpPressHandler = (e: NativeSyntheticEvent<KeyPress>) => {
      console.log('up', e.nativeEvent.keyCode);
    };

    const onBubbledContextMenuPressHandler = () => {
      console.log('menu');
    };

    return (
      <KeyboardFocusGroup tintColor="orange" style={styles.flex}>
        <ScrollView
          contentContainerStyle={styles.contentContainer}
          style={styles.container}
        >
          <KeyboardExtendedBaseView
            onKeyUpPress={onKeyUpPressHandler}
            onKeyDownPress={onKeyDownPressHandler}
            onBubbledContextMenuPress={onBubbledContextMenuPressHandler}
            focusable={false}
            style={styles.bubbledWrapper}
          >
            <TouchableOpacity
              onPress={() => {
                console.log(1);
                setDShow((v: boolean) => !v);
              }}
              haloExpendX={5}
              haloExpendY={5}
              haloCornerRadius={10}
              onLongPress={() => console.log(11)}
              ref={ref}
              defaultFocusHighlightEnabled={false}
              style={styles.pressable as object} //ToDo updat type
              containerStyle={styles.pressableContainer}
              containerFocusStyle={ANDROID_FOCUS_STYLE}
            >
              <Text>TouchableOpacity</Text>
            </TouchableOpacity>
            {dShow && (
              <Pressable
                defaultFocusHighlightEnabled={false}
                containerFocusStyle={ANDROID_FOCUS_STYLE}
                containerStyle={styles.pressableContainer}
                autoFocus
                renderContent={RenderContent}
              />
            )}
            {dShow && (
              <TouchableOpacity
                defaultFocusHighlightEnabled={false}
                containerFocusStyle={ANDROID_FOCUS_STYLE}
                containerStyle={styles.pressableContainer}
                renderFocusable={RenderContent}
              />
            )}
            <TouchableWithoutFeedback
              defaultFocusHighlightEnabled={false}
              containerFocusStyle={ANDROID_FOCUS_STYLE}
              haloExpendX={-5}
              haloExpendY={-5}
              haloCornerRadius={5}
              containerStyle={styles.pressableContainer}
              onPress={() => {
                navigation.navigate('PressableTest' as never);
              }}
              onLongPress={() => navigation.navigate('ListTest' as never)}
            >
              <View style={styles.pressable}>
                <Text>Pressable\List Test</Text>
              </View>
            </TouchableWithoutFeedback>
            <Pressable
              defaultFocusHighlightEnabled={false}
              containerFocusStyle={ANDROID_FOCUS_STYLE}
              autoFocus
              containerStyle={styles.pressableContainer}
              style={styles.pressable as object} //ToDo updat type
              onPress={() => modalButtonRef.current?.focus()}
              onLongPress={() => console.log(33)}
              onFocus={() => {
                Keyboard.dismiss();
              }}
            >
              <Text>Pressable: Focus Modal</Text>
            </Pressable>
            <Text>Label: KeyboardExtendedInput </Text>
            <KeyboardExtendedInput
              defaultFocusHighlightEnabled={false}
              focusStyle={ANDROID_FOCUS_STYLE}
              focusable={true}
              value={textInput}
              focusType="press"
              onChangeText={setTextInput}
              containerStyle={styles.doubleBottom}
              style={styles.input as object} //ToDo updat type
            />
            <Text>Label: Multiline</Text>
            <KeyboardExtendedInput
              defaultFocusHighlightEnabled={false}
              focusStyle={ANDROID_FOCUS_STYLE}
              focusable={true}
              value={multilineTextInput}
              multiline
              focusType="press"
              onSubmitEditing={() => console.log('OnSubmitEditing: multiline')}
              onChangeText={setMultilineTextInput}
              containerStyle={styles.doubleBottom}
              style={styles.input as object} //ToDo updat type
            />
            <Pressable
              defaultFocusHighlightEnabled={false}
              containerFocusStyle={ANDROID_FOCUS_STYLE}
              ref={modalButtonRef}
              onFocus={() => {
                Keyboard.dismiss();
              }}
              onPress={() => setShowModal(true)}
              containerStyle={styles.pressableContainer}
              style={styles.pressable as object} //ToDo updat type
            >
              <Text>Modal</Text>
            </Pressable>
            <KeyboardExtendedBaseView
              haloEffect={true}
              focusable={true}
              onKeyDownPress={onKeyDownHandler as unknown as undefined} //ToDo updat type
              onKeyUpPress={onKeyUpHandler as unknown as undefined} //ToDo updat type
              style={styles.keyHandler}
              groupIdentifier="keyTracker"
            >
              <Text style={styles.keyHandlerTitle}>
                {isKeyDown ? 'Press begin:' : 'Press ended:'}
              </Text>
              {Object.keys(keyInfo ?? {}).map((key) => {
                const value = (
                  keyInfo as Record<string, string | number | boolean>
                )[key];
                const isBool = typeof value === 'boolean';
                return (
                  <View key={key} style={styles.keyHandlerRow}>
                    <Text style={styles.keyHandlerKey}>{key}</Text>
                    {isBool && (
                      <View
                        style={
                          value
                            ? styles.keyHandlerDotTrue
                            : styles.keyHandlerDotFalse
                        }
                      />
                    )}
                    <Text style={styles.keyHandlerValue}>{`${
                      value ?? ''
                    }`}</Text>
                  </View>
                );
              })}
            </KeyboardExtendedBaseView>
            <Modal visible={showModal}>
              <View style={styles.modal}>
                <View>
                  <Pressable
                    defaultFocusHighlightEnabled={false}
                    focusStyle={ANDROID_FOCUS_STYLE}
                    onPress={() => setShowModal(false)}
                  >
                    <Text>Modal example</Text>
                  </Pressable>
                  <Pressable
                    defaultFocusHighlightEnabled={false}
                    focusStyle={ANDROID_FOCUS_STYLE}
                    autoFocus
                    onPress={() => setShowModal(false)}
                  >
                    <Text>AutoFocus</Text>
                  </Pressable>
                  <Pressable
                    defaultFocusHighlightEnabled={false}
                    focusStyle={ANDROID_FOCUS_STYLE}
                    onPress={() => setShowModal(false)}
                  >
                    <Text>Close</Text>
                  </Pressable>
                </View>
              </View>
            </Modal>
          </KeyboardExtendedBaseView>
        </ScrollView>
      </KeyboardFocusGroup>
    );
  }
);

const styles = StyleSheet.create({
  container: { flex: 1, paddingHorizontal: 10 },
  bubbledWrapper: { flex: 1 },
  flex: { flex: 1 },
  contentContainer: {
    backgroundColor: '#ffffff',
    flexGrow: 1,
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
    borderWidth: 2,
    marginBottom: 5,
    borderRadius: 10,
    padding: 10,
    gap: 4,
  },
  keyHandlerTitle: {
    fontWeight: '600',
    marginBottom: 4,
  },
  keyHandlerRow: {
    flexDirection: 'row',
    gap: 8,
  },
  keyHandlerKey: {
    color: '#888',
    minWidth: 120,
  },
  keyHandlerValue: {
    fontWeight: '500',
    flexShrink: 1,
  },
  keyHandlerDotTrue: {
    width: 10,
    height: 10,
    borderRadius: 2,
    backgroundColor: '#34c759',
    alignSelf: 'center',
    marginRight: 4,
  },
  keyHandlerDotFalse: {
    width: 10,
    height: 10,
    borderRadius: 2,
    backgroundColor: '#ff3b30',
    alignSelf: 'center',
    marginRight: 4,
  },
});
