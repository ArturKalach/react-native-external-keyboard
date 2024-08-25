import * as React from 'react';

import { NativeSyntheticEvent, StyleSheet, Text, View } from 'react-native';
import {
  KeyboardExtendedBaseView,
  KeyPress,
  KeyboardExtendedInput,
  KeyboardExtendedView,
  KeyboardExtendedPressable,
  KeyboardRootView,
  KeyboardExtendedViewType,
} from 'react-native-external-keyboard';

export default function App() {
  const ref = React.useRef<KeyboardExtendedViewType>(null);
  const [isKeyDown, setIsKeyDown] = React.useState(true);
  const [status, setStatus] = React.useState('Not pressed');
  const [textInput, setTextInput] = React.useState('Text input here!');
  const [keyInfo, setKeyInfo] = React.useState<KeyPress | undefined>(undefined);

  const onKeyUpHandler = (e: NativeSyntheticEvent<KeyPress>) => {
    setIsKeyDown(false);
    setKeyInfo(e.nativeEvent);
  };
  const onKeyDownHandler = (e: NativeSyntheticEvent<KeyPress>) => {
    setIsKeyDown(true);
    setKeyInfo(e.nativeEvent);
  };

  const [showAutoFocus, setShowAutoFocus] = React.useState(false);
  return (
    <KeyboardRootView style={styles.container}>
      <KeyboardExtendedPressable
        enableHaloEffect={false}
        onPress={() => {
          setShowAutoFocus((show) => !show);
          // console.log('123123');
          ref.current?.focus();
          // setShowAutoFocus(v => !v);
          // setSt((v) => !v);
        }}
      >
        <Text>Jump</Text>
      </KeyboardExtendedPressable>
      {showAutoFocus && (
        <KeyboardExtendedView autoFocus enableHaloEffect={false}>
          <Text>AutoFocus</Text>
        </KeyboardExtendedView>
      )}
      <KeyboardExtendedPressable
        enableHaloEffect={false}
        focusStyle={styles.pressFocusStyle}
        onPress={() => setStatus('onPress')}
        onPressIn={() => setStatus('onPressIn')}
        onPressOut={() => setStatus('onPressOut')}
        onLongPress={() => setStatus('onLongPress')}
      >
        <Text>On Press Check: {status}</Text>
      </KeyboardExtendedPressable>
      <KeyboardExtendedView enableHaloEffect={false} ref={ref}>
        <Text>Catch</Text>
      </KeyboardExtendedView>
      <KeyboardExtendedBaseView
        enableHaloEffect={false}
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
      <KeyboardExtendedView enableHaloEffect={false}>
        <Text>Parent component</Text>
        <KeyboardExtendedView enableHaloEffect={false}>
          <Text>Child component 1</Text>
        </KeyboardExtendedView>
        <KeyboardExtendedView enableHaloEffect={false}>
          <Text>Child component 2</Text>
        </KeyboardExtendedView>
      </KeyboardExtendedView>
      <KeyboardExtendedInput value={textInput} onChangeText={setTextInput} />
      <KeyboardExtendedView
        enableHaloEffect={false}
        style={styles.borderExample}
      >
        <Text>Border here</Text>
      </KeyboardExtendedView>
    </KeyboardRootView>
  );
}

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
