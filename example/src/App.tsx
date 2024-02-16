import * as React from 'react';

import { NativeSyntheticEvent, StyleSheet, Text, View } from 'react-native';
import {
  ExternalKeyboardView,
  KeyPress,
  KeyboardFocusView,
  A11yModule,
  Pressable,
} from 'react-native-external-keyboard';

export default function App() {
  const ref = React.useRef(null);
  const [isKeyDown, setIsKeyDown] = React.useState(true);
  const [status, setStatus] = React.useState('Not pressed');
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
      <Pressable onPress={() => A11yModule.setKeyboardFocus(ref)}>
        <Text>Jump</Text>
      </Pressable>
      <Pressable
        focusStyle={styles.pressFocusStyle}
        onPress={() => setStatus('onPress')}
        onPressIn={() => setStatus('onPressIn')}
        onPressOut={() => setStatus('onPressOut')}
        onLongPress={() => setStatus('onLongPress')}
      >
        <Text>On Press Check: {status}</Text>
      </Pressable>

      <KeyboardFocusView ref={ref}>
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
      <View style={styles.divider} />
      <KeyboardFocusView>
        <Text>Parent component</Text>
        <KeyboardFocusView>
          <Text>Child component 1</Text>
        </KeyboardFocusView>
        <KeyboardFocusView>
          <Text>Child component 2</Text>
        </KeyboardFocusView>
      </KeyboardFocusView>
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
  divider: { height: 10 },
  pressFocusStyle: { backgroundColor: '#a0dcbe' },
});
