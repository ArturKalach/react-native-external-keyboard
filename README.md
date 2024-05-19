# React Native External Keyboard

React Native library for enhanced external keyboard support.
⚡️ The New Architecture is supported

## New Release Features

- `KeyboardExtendedTextInput`: a new component for handling TextInput focusability. More [here](#keyboardextendedinput)
- Performance Optimization: Improved key press handling functionality.
- Renaming: Added aliases for components and modules. More [here](#component-aliases)

| iOS                                                        | Android                                                        |
| ---------------------------------------------------------- | -------------------------------------------------------------- |
| <img src="/.github/images/ios_example.gif" height="500" /> | <img src="/.github/images/android_example.gif" height="500" /> |

## Features

- Forcing keyboard focus (moving the keyboard focus to a specific element)
- Key press handling
- View and TextInput focus control

## Installation

```sh
npm install react-native-external-keyboard
```

iOS:

```sh
cd ios && pod install && cd ..
```

## Usage

### KeyboardExtendedInput

The `TextInput` component with keyboard focus support. This component allows the TextInput to be focused using the keyboard in various scenarios.

```js
import { KeyboardExtendedInput } from 'react-native-external-keyboard';
...
  <KeyboardExtendedInput
    focusType="default"
    blurType="default"
    value={textInput}
    onChangeText={setTextInput}
  />
```

| Props           | Description                                                                                                                                                                                                                                                                                                                                                                      | Type                                                                     |
| --------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------ |
| canBeFocused?:  | Boolean property whether component can be focused by keyboard                                                                                                                                                                                                                                                                                                                    | `boolean \| undefined` default `true`                                    |
| onFocusChange?: | Callback for focus change handling                                                                                                                                                                                                                                                                                                                                               | `(e:NativeSyntheticEvent<{ isFocused: boolean; }>) => void \| undefined` |
| focusType?:     | Focus type can be `default`, `auto`, or `press`. Based on investigation, Android and iOS typically have different default behaviors. On Android, the `TextInput` is focused by default, while on iOS, you need to press to focus. `auto` is used for automatic focusing, while keyboard focus targets the input. With `press`, you need to press the spacebar to focus an input. | `"default" \| "press" \| "auto"`                                         |
| blurType?:      | Only for iOS. This defines the behavior for blurring input when focus moves away from the component. By default, iOS allows typing when the keyboard focus is on another component. You can use disable to blur input when focus moves away. (Further investigation is needed for Android.)                                                                                      | `"default"\| "disable" \| "auto"`                                        |

### KeyboardExtendedPressable: (alias for: Pressable)

The `Pressable` component with keyboard focus support. This component allows handling the `onLongPress` event fired by the keyboard.

FYI: `iOS` has a specific press action that is configured by system settings. Read [more](#ios-commands)

```js
import { KeyboardExtendedPressable } from 'react-native-external-keyboard';

// ...

<KeyboardExtendedPressable
  focusStyle={{ backgroundColor: '#cdf2ef' }}
  onPress={() => console.log('onPress')}
  onPressIn={() => console.log('onPressIn')}
  onPressOut={() => console.log('onPressOut')}
  onLongPress={() => console.log('onLongPress')}
>
  <Text>On Press Check</Text>
</KeyboardExtendedPressable>;
```

You can pass the default React Native `PressableProps` as well as additional props for keyboard handling functionality:

| Props           | Description                                                                 | Type                                                                                         |
| --------------- | --------------------------------------------------------------------------- | -------------------------------------------------------------------------------------------- |
| canBeFocused?:  | Boolean property whether component can be focused by keyboard               | `boolean \| undefined` default `true`                                                        |
| onFocusChange?: | Callback for focus change handling                                          | `(e:NativeSyntheticEvent<{ isFocused: boolean; }>) => void \| undefined`                     |
| focusStyle?:    | Style for selected by keyboard component                                    | `((state: { focused: boolean}) => StyleProp<ViewStyle> \| StyleProp<ViewStyle> \| undefined` |
| onPress?:       | Default `onPress` or `keyboard` handled `onPress`                           | `(e: GestureResponderEvent \| OnKeyPress) => void; \| undefined`                             |
| onLongPress?:   | Default `onLongPress` or `keyboard` handled `onLongPress`                   | `(e: GestureResponderEvent \| OnKeyPress) => void; \| undefined`                             |
| withView?:      | Android only prop, it is used for wrapping children in `<View accessible/>` | `boolean \| undefined` default `true`                                                        |

### KeyboardExtendedView: (alias for: KeyboardFocusView)

The `KeyboardExtendedView` component is styled component for keyboard handling, has a default focus color and preferable for fast start to handling keyboard focus.

```js
import { KeyboardExtendedView } from 'react-native-external-keyboard';
// ...

<KeyboardExtendedView
  focusStyle={{ backgroundColor: '#a0dcbe' }}
  onFocusChange={(e) => console.log(e.nativeEvent.isFocused)}
>
  <Text>Focusable</Text>
</KeyboardExtendedView>;
```

You can pass the default React Native `ViewProps` as well as additional props for keyboard handling functionality:
| Props | Description | Type |
| ------------- | ------------- | ---- |
| canBeFocused?: | Boolean property whether component can be focused by keyboard | `boolean \| undefined` default `true` |
| onFocusChange?: | Callback for focus change handling | `(e:NativeSyntheticEvent<{ isFocused: boolean; }>) => void` |
| onKeyUpPress?: | Callback for handling key up event | `(e: OnKeyPress) => void` |
| onKeyDownPress?: | Callback for handling key down event | `(e: OnKeyPress) => void`|
| focusStyle?: | Style for selected by keyboard component | `((state: { focused: boolean}) => StyleProp<ViewStyle> \| StyleProp<ViewStyle>` |

### KeyboardExtendedBaseView: (alias for: ExternalKeyboardView)

It's a core component similar to native ones, but it includes a helper for optimizing key presses. Currently, it's recommended to use `KeyboardExtendedView` if you don't need a custom implementation.

Important: When using `KeyboardExtendedBaseView` on Android, make sure the children component has the accessible prop.

```js
import { KeyboardExtendedBaseView } from 'react-native-external-keyboard';
// ...
<KeyboardExtendedBaseView
        onKeyDownPress={...}
        onKeyUpPress={...}
        canBeFocused
      >
    <View accessible>
        <Text>Content</Text>
    </View>
</KeyboardExtendedBaseView>
```

| Props            | Description                                                   | Type                                                        |
| ---------------- | ------------------------------------------------------------- | ----------------------------------------------------------- |
| canBeFocused?:   | Boolean property whether component can be focused by keyboard | `boolean \| undefined` default `true`                       |
| onFocusChange?:  | Callback for focus change handling                            | `(e:NativeSyntheticEvent<{ isFocused: boolean; }>) => void` |
| onKeyUpPress?:   | Callback for handling key up event                            | `(e: OnKeyPress) => void`                                   |
| onKeyDownPress?: | Callback for handling key down event                          | `(e: OnKeyPress) => void`                                   |

### KeyboardExtendedModule (alias for: A11yModule)

The `KeyboardExtendedModule` API is utilized to shift the keyboard focus to a target component. The component's ref is necessary for this operation. On `iOS`, proper functionality of keyboard focus is ensured only with `KeyboardExtendedView` or `KeyboardExtendedPressable`, as iOS requires specific workarounds for moving keyboard focus."

```js
KeyboardExtendedModule.setKeyboardFocus(ref);
```

```js
import {
  KeyboardExtendedView,
  KeyboardExtendedModule,
  KeyboardExtendedPressable,
} from 'react-native-external-keyboard';
// ...
 <KeyboardExtendedPressable onPress={() => KeyboardExtendedModule.setKeyboardFocus(ref)}>
   <Text>On Press Check</Text>
 </KeyboardExtendedPressable>
 <KeyboardExtendedView
    onFocusChange={(e) => console.log(e.nativeEvent.isFocused)}
    >
    <Text>Focusable</Text>
 </KeyboardExtendedView>
```

```ts
export interface IA11yModule {
  currentFocusedTag?: number;

  setPreferredKeyboardFocus: (nativeTag: number, nextTag: number) => void;
  setKeyboardFocus: (ref: RefObjType) => void;
}
```

| Props                      | Description                                                                  | Type                                            |
| -------------------------- | ---------------------------------------------------------------------------- | ----------------------------------------------- |
| currentFocusedTag?:        | iOS only, it is used for the keyboard focus moving feature                   | `number`                                        |
| setPreferredKeyboardFocus: | iOS only, you can define default focus redirect from a component to a target | `(nativeTag: number, nextTag: number) => void;` |
| setKeyboardFocus:          | Move focus to the target by ref                                              | `(ref: RefObjType) => void`                     |

# Important

## iOS commands

New versions of iOS have specific `commands` for `physical keyboards`. If you can't handle a `long press event` on iOS, it may be that the `space` key is bound to an `Activate` command. Clearing the `Activate` command will help with handling of the `long press` event. There is no known way to handle this (if you have any ideas, please share).

User can change `Commands` in:
`Settings` -> `Accessibility` -> `Keyboards` -> `Full Keyboard Access` -> `Commands`

# Upgrading

## Component aliases

It is believed that good naming can simplify usage and development. Based on this principle and for compatibility with `0.2.x`, aliases were added. You can still use the old naming convention, and it will be maintained in future releases.

The map of aliases is provided below:
`A11yModule` -> `KeyboardExtendedModule`
`Pressable` -> `KeyboardExtendedPressable`
`KeyboardFocusView` -> `KeyboardExtendedView`
`ExternalKeyboardView` -> `KeyboardExtendedBaseView`

# API

```ts
export type OnKeyPress = NativeSyntheticEvent<{
  keyCode: number;
  unicode: number;
  unicodeChar: string;
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
