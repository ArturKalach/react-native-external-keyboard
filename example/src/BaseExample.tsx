import * as React from 'react';

import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity as RNTouchableOpacity,
} from 'react-native';
import {
  KeyboardExtendedBaseView,
  type KeyPress,
  KeyboardExtendedInput,
  KeyboardExtendedView,
  KeyboardExtendedPressable,
  type KeyboardExtendedViewType,
  type OnKeyPress,
  withKeyboardFocus,
} from 'react-native-external-keyboard';

const TouchableOpacity = withKeyboardFocus(RNTouchableOpacity);

export const BaseExample = () => {
  const ref = React.useRef<KeyboardExtendedViewType>(null);
  const [isKeyDown, setIsKeyDown] = React.useState(true);
  const [status, setStatus] = React.useState('Not pressed');
  const [textInput, setTextInput] = React.useState('Text input here!');
  const [keyInfo, setKeyInfo] = React.useState<KeyPress | undefined>(undefined);

  const onKeyUpHandler = (e: OnKeyPress) => {
    setIsKeyDown(false);
    setKeyInfo(e.nativeEvent);
  };
  const onKeyDownHandler = (e: OnKeyPress) => {
    setIsKeyDown(true);
    setKeyInfo(e.nativeEvent);
  };

  const [showAutoFocus, setShowAutoFocus] = React.useState(false);
  return (
    <View style={styles.container}>
      <TouchableOpacity
        tintColor="#ff0000"
        haloEffect={true}
        onPress={() => {
          ref.current?.focus();
        }}
      >
        <Text>Jump</Text>
      </TouchableOpacity>
      <TouchableOpacity
        onPress={() => {
          setShowAutoFocus(true);
        }}
      >
        <Text>Show auto focus component</Text>
      </TouchableOpacity>
      {showAutoFocus && (
        <KeyboardExtendedView autoFocus haloEffect={true}>
          <Text>AutoFocus</Text>
        </KeyboardExtendedView>
      )}
      <KeyboardExtendedPressable
        tintColor="#ff00ff"
        haloEffect={true}
        focusStyle={styles.pressFocusStyle}
        onPress={() => setStatus('onPress')}
        onPressIn={() => setStatus('onPressIn')}
        onPressOut={() => setStatus('onPressOut')}
        onLongPress={() => setStatus('onLongPress')}
      >
        <Text>On Press Check: {status}</Text>
      </KeyboardExtendedPressable>
      <KeyboardExtendedView haloEffect={true} ref={ref}>
        <Text>Catch</Text>
      </KeyboardExtendedView>
      <KeyboardExtendedBaseView
        haloEffect={true}
        onKeyDownPress={onKeyDownHandler}
        onKeyUpPress={onKeyUpHandler}
      >
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
      </KeyboardExtendedBaseView>
      <View style={styles.divider} />
      <KeyboardExtendedView haloEffect={true}>
        <Text>Parent component</Text>
        <KeyboardExtendedView haloEffect={true}>
          <Text>Child component 1</Text>
        </KeyboardExtendedView>
        <KeyboardExtendedView haloEffect={true}>
          <Text>Child component 2</Text>
        </KeyboardExtendedView>
      </KeyboardExtendedView>
      <KeyboardExtendedInput
        focusable={true}
        value={textInput}
        onChangeText={setTextInput}
      />
      <KeyboardExtendedView haloEffect={true} style={styles.borderExample}>
        <Text>Border here</Text>
      </KeyboardExtendedView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  box: {
    width: 60,
    height: 60,
    marginVertical: 20,
  },
  divider: { height: 10 },
  pressFocusStyle: { backgroundColor: '#b2c6b7' },
  borderExample: {
    marginVertical: 10,
    borderColor: 'black',
    borderRadius: 15,
    borderWidth: 2,
    padding: 10,
  },
});
