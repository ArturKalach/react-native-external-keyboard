# React Native External Keyboard
### react-native-external-keyboard

React Native library for extended external keyboard support.
The `new` and `old` architectures are compatible!


| iOS           | Android        |
| ------------- | -------------- |
| <img src="/.github/images/ios_example.gif" height="500" />| <img src="/.github/images/android_example.gif" height="500" />|



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
import { Pressable } from "react-native-external-keyboard";

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

You can pass the default ReactNative `PressableProps` and some extra:

| Props         | Description   | Type |
| ------------- | ------------- | ---- | 
| canBeFocused?: | Boolean property whether component can be focused by keyboard | `boolean \| undefined` default `true` |
| onFocusChange?: | Callback for focus change handling | `(e:NativeSyntheticEvent<{ isFocused: boolean; }>) => void \| undefined` |
| focusStyle?:  | Style for selected by keyboard component | `((state: { focused: boolean}) => StyleProp<ViewStyle> | StyleProp<ViewStyle> \| undefined` |
| onPress?: | Default `onPress` or `keyboard` handled `onPress` | `(e: GestureResponderEvent \| OnKeyPress) => void; \| undefined` |
| onLongPress?: | Default `onLongPress` or `keyboard` handled `onLongPress` | `(e: GestureResponderEvent \| OnKeyPress) => void; \| undefined`|
| withView?: | Android only prop, it is used for wrapping children in `<View accessible/>` | `boolean \| undefined` default `true` |


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

You can pass the default ReactNative view props and some extra:
| Props         | Description   | Type |
| ------------- | ------------- | ---- | 
| canBeFocused?: | Boolean property whether component can be focused by keyboard | `boolean \| undefined` default `true` |
| onFocusChange?: | Callback for focus change handling | `(e:NativeSyntheticEvent<{ isFocused: boolean; }>) => void` |
| onKeyUpPress?: | Callback for handling key up event | `(e: OnKeyPress) => void` |
| onKeyDownPress?: | Callback for handling key down event | `(e: OnKeyPress) => void`|
| focusStyle?:  | Style for selected by keyboard component | `((state: { focused: boolean}) => StyleProp<ViewStyle> \| StyleProp<ViewStyle>` |

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

| Props         | Description   | Type |
| ------------- | ------------- | ---- | 
| canBeFocused?: | Boolean property whether component can be focused by keyboard | `boolean \| undefined` default `true` |
| onFocusChange?: | Callback for focus change handling | `(e:NativeSyntheticEvent<{ isFocused: boolean; }>) => void` |
| onKeyUpPress?: | Callback for handling key up event | `(e: OnKeyPress) => void` |
| onKeyDownPress?: | Callback for handling key down event | `(e: OnKeyPress) => void`|

### A11yModule

The `A11yModule` API is used to move the `keyboard focus` to a target component.
Component's `ref` is needed to move keyboard focus. On iOS keyboard focus will work properly only with  `KeyboardFocusView` or `Pressable` (from library one), because iOS has specific work around for moving keyboard focus. 

```js
A11yModule.setKeyboardFocus(ref)
```

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

```ts
export interface IA11yModule {
  currentFocusedTag?: number;

  setPreferredKeyboardFocus: (nativeTag: number, nextTag: number) => void;
  setKeyboardFocus: (ref: RefObjType) => void;
}
```

| Props         | Description   | Type |
| ------------- | ------------- | ---- | 
| currentFocusedTag?: | iOS only, it is used for the keyboard focus moving feature | `number` |
| setPreferredKeyboardFocus: | iOS only, you can define default focus redirect from a component to a target | `(nativeTag: number, nextTag: number) => void;` |
| setKeyboardFocus: | Move focus to the target by ref | (ref: RefObjType) => void; |

# Important
## iOS
New versions of iOS have specific `commands` for `physical keyboards`. If you can't handle a `long press event` on iOS, it may be that the `space` key is bound to an `Activate` command. Clearing the `Activate` command will help with handling of the `long press` event. There is no known way to handle this (if you have any ideas, please share).

User can change `Commands` in:
`Settings` -> `Accessibility` -> `Keyboards` -> `Full Keyboard Access` -> `Commands`

# API

```ts
export type OnKeyPress = NativeSyntheticEvent<{
  keyCode: number;
  isLongPress: boolean;
  isAltPressed: boolean;
  isShiftPressed: boolean;
  isCtrlPressed: boolean;
  isCapsLockOn: boolean;
  hasNoModifiers: boolean;
}>;
```

## License

MIT

---

Made with [create-react-native-library](https://github.com/callstack/react-native-builder-bob)
