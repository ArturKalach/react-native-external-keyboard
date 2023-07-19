# React Native External Keyboard
### react-native-external-keyboard

React Native library for extended external keyboard support.



## Features
- Forcing keyboard focus (moving the keyboard focus to the specific element)
- A key press handling

## Installation

```sh
npm install react-native-external-keyboard
```

iOS:
```sh
cd ios && pod install && cd ..
```

## Usage


### Pressable
Updated pressable component with handling long press events on a keyboard 
```js
import { Pressable,  } from "react-native-external-keyboard";

// ...

 <Pressable
    focusStyle={{ backgroundColor: '#cdf2ef' }}
    onPress={() => console.log('onPress')}
    onPressIn={() => console.log('onPressIn')}
    onPressOut={() => console.log('onPressOut')}
    onLongPress={() => console.log('onLongPress')}
    >
    <Text>On Press Check</Text>
</Pressable>
```

### KeyboardFocusView
The KeyboardFocusView component is core component for keyboard handling, it is used for force focusing and handling `onFocusChange` event
```js
import { KeyboardFocusView } from "react-native-external-keyboard";
// ...

<KeyboardFocusView
    focusStyle={{ backgroundColor: '#a0dcbe' }}
    onFocusChange={(e) => console.log(e.nativeEvent.isFocused)}
>
    <Text>Focusable</Text>
</KeyboardFocusView>
```

If you want to move keyboard focus, you need to have a `ref` for the target component. It is important to use `KeyboardFocusView` as the target component (There can be a problem with moving focus for iOS if you use any component other than `KeyboardFocusView`).


```js
import {
  KeyboardFocusView,
  A11yModule,
  Pressable as KPressable,
} from 'react-native-external-keyboard';
// ...
 <KPressable onPress={() => A11yModule.setKeyboardFocus(ref)}>
   <Text>On Press Check</Text>
 </KPressable>
 <KeyboardFocusView
    onFocusChange={(e) => console.log(e.nativeEvent.isFocused)}
    >
    <Text>Focusable</Text>
 </KeyboardFocusView>
```

### ExternalKeyboardView
It is a bare `Native` component. It is better to use `KeyboardFocusView` if you don't need your own specific implementation.

Important: If you use `KeyboardFocusView` on Android, you need to use a children component with the `accessible` prop.


```js
import { ExternalKeyboardView } from 'react-native-external-keyboard';
// ...
<ExternalKeyboardView
        onKeyDownPress={...}
        onKeyUpPress={...}
        canBeFocused
      >
    <View accessible>
        <Text>Content</Text>
    </View>
</ExternalKeyboardView>
```

## License

MIT

---

Made with [create-react-native-library](https://github.com/callstack/react-native-builder-bob)
