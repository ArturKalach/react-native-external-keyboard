import * as React from 'react';

import { NativeSyntheticEvent, StyleSheet, Text, View } from 'react-native';
import {
  ExternalKeyboardView,
  KeyPress,
  KeyboardFocusView,
  A11yModule,
} from 'react-native-external-keyboard';

export default function App() {
  const ref = React.useRef(null);
  const [isKeyDown, setIsKeyDown] = React.useState(true);
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
    <View style={styles.container}>
      <KeyboardFocusView onKeyUpPress={() => A11yModule.setKeyboardFocus(ref)}>
        <Text>Focusable</Text>
      </KeyboardFocusView>
      <KeyboardFocusView
        ref={ref}
        onKeyUpPress={() => A11yModule.setKeyboardFocus(ref)}
      >
        <Text>Catch</Text>
      </KeyboardFocusView>
      <ExternalKeyboardView
        onKeyDownPress={onKeyDownHandler}
        onKeyUpPress={onKeyUpHandler}
        canBeFocused
      >
        <View accessible>
          <Text>{isKeyDown ? 'Press begin:' : 'Press ended:'}</Text>
        </View>
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
      </ExternalKeyboardView>
    </View>
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
});
