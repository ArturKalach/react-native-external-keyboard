# React Native External Keyboard

React Native library for enhanced external keyboard support.

- ⚡️ The New Architecture is supported
- ⚡️ Bridgeless

## New Release Features

- `withKeyboardFocus`: an HOC that adds focus capabilities to any pressable component.
- Tint and halo effects for iOS.
- Keyboard focus and autofocus support.

- Renaming: Added aliases for components and modules. More [here](#component-aliases)

iOS | Android
-- | --
<img src="/.github/images/ios_example.gif" height="500" /> | <img src="/.github/images/android_example.gif" height="500" />

## Features

- Keyboard focus control and autofocus
- Key press event handling
- Focus control for `TextInput` and `Pressable` components
- Halo effect and tint color customization for iOS

## Installation

```sh
npm install react-native-external-keyboard
```

iOS:

```sh
cd ios && pod install && cd ..
```

After installation, wrap your entry point and modals with `<KeyboardRootView>`. This is required for the `autoFocus` and `focus command`. functionality.

```
import { KeyboardRootView } from 'react-native-external-keyboard';

export default function App() {
  return (
    <KeyboardRootView style={{ flex: 1 }}>
      {/* content */}
    </KeyboardRootView>
  );
}

...

export function CustomModal() {
  return <Modal>
    <KeyboardRootView style={{ flex: 1 }}>
      {/* content */}
    </KeyboardRootView>
  </Modal>
}
```



## Usage

### withKeyboardFocus - For Pressable, Touchable, and more

The `withKeyboardFocus` HOC is a helper for integrating keyboard focus functionality. It significantly simplifies integration by wrapping the provided component in `KeyboardFocusView` and extending it with additional features, such as focus and blur events.

```js
const KeybardedPressable = withKeyboardFocus(Pressable);
const KeybardedTouchable = withKeyboardFocus(TouchableOpacity);
const KeybardedButton = withKeyboardFocus(Button);

...

<TouchableOpacity
  ref={ref}
  onPress={...}
  onLongPress={...}
  onFocus={...}
  onBlur={...}
  style={styles.pressable}
  containerStyle={styles.pressableContainer}
  autoFocus
>
  <Text>TouchableOpacity</Text>
</TouchableOpacity>
```

After wrapping a `Pressable` or `Touchable` with `withKeyboardFocus`, you will be able to handle `focus` and `blur` events, control the `tint color`, apply focus and container focus styles, `focus` the component using a `ref`, or configure `autoFocus`. 


Props | Description | Type
-- | -- | --
onPress?: | Default `onPress` or keyboard-handled `onPress` | `((event: GestureResponderEvent) => void) \| null \| undefined`
onLongPress?: | Default `onLongPress` or keyboard-handled `onLongPress` (`Tab+M` for iOS). | `((event: GestureResponderEvent) => void) \| null \| undefined`
onPressIn:? | Default `onPressIn` or keyboard-handled `onPressIn` | `((event: GestureResponderEvent) => void) \| null \| undefined`
onPressOut:? | Default `onPressOut` or keyboard-handled `onPressOut` | `((event: GestureResponderEvent) => void) \| null \| undefined`
style?: | Style for the inner component | `StyleProp<ViewStyle>`
focusStyle?: | Style applied to the inner component when focused | `FocusStyle`
containerStyle?: | Style for the container | StyleProp<ViewStyle>;
containerFocusStyle?: | Style applied to the container when focused | `FocusStyle`
onFocus?: | Handler called when the component is focused  | `() => void`
onBlur?: | Handler called when the component loses focus | `() => void`
onFocusChange?: | Handler called when the component is focused or blurred | `(isFocused: boolean, tag?: number) => void`
onKeyUpPress?: | Handler for the key-up event | `(e: OnKeyPress) => void`
onKeyDownPress?: | Handler for the key-down event | `(e: OnKeyPress) => void`
autoFocus?: | Indicates if the component should automatically gain focus | `boolean | undefined`
focusable?: | Indicates if the component can be focused by keyboard | `boolean | undefined`
tintColor?: | Color used for tinting the component | `string`
tintType?: | Tint behavior type | `'default' \| 'hover' \| 'background' \| 'none'`
FocusHoverComponent?: | Component displayed on focus | `\| ReactElement  \| FunctionComponent  \| (() => ReactElement);`
group?: | Indicates if the component is a focusable group | `boolean`
haloEffect?: | Enables halo effect on focus (iOS only) | `boolean`
...rest | Remaining component props  | `Type of Component`


> [!NOTE]
> You may discover that `long press on spacebar` does not trigger a long press event on `iOS`. This is because `iOS` use a `Full Keyboard Access` system that provides commands for interacting with the system. Rather than holding down the spacebar, you can use `Tab+M` (the default action for opening the context menu).
> You can change `Commands` in: `Full Keyboard Access` -> `Commands`


### KeyboardExtendedView
`KeyboardExtendedView` is similar to `withKeyboardFocus`; it is also based on `KeyboardExtendedBaseView` and provides keyboard focus functionality. It can be useful for handling key presses or managing the focus of a group of components.

```
<KeyboardExtendedView>
  <Text>Parent component</Text>
  <KeyboardExtendedView>
    <Text>Child component 1</Text>
  </KeyboardExtendedView>
  <KeyboardExtendedView>
    <Text>Child component 2</Text>
  </KeyboardExtendedView>
</KeyboardExtendedView>
```

Props | Description | Type
-- | -- | --
onPress?: | Default `onPress` or keyboard-handled `onPress` | `((event: GestureResponderEvent) => void) \| null \| undefined`
onLongPress?: | Default `onLongPress` or keyboard-handled `onLongPress` (`Tab+M` for iOS). | `((event: GestureResponderEvent) => void) \| null \| undefined`
onPressIn:? | Default `onPressIn` or keyboard-handled `onPressIn` | `((event: GestureResponderEvent) => void) \| null \| undefined`
onPressOut:? | Default `onPressOut` or keyboard-handled `onPressOut` | `((event: GestureResponderEvent) => void) \| null \| undefined`
style?: | Style for the inner component | `StyleProp<ViewStyle>`
focusStyle?: | Style applied to the inner component when focused | `FocusStyle`
containerStyle?: | Style for the container | StyleProp<ViewStyle>;
containerFocusStyle?: | Style applied to the container when focused | `FocusStyle`
onFocus?: | Handler called when the component is focused  | `() => void`
onBlur?: | Handler called when the component loses focus | `() => void`
onFocusChange?: | Handler called when the component is focused or blurred | `(isFocused: boolean, tag?: number) => void`
onKeyUpPress?: | Handler for the key-up event | `(e: OnKeyPress) => void`
onKeyDownPress?: | Handler for the key-down event | `(e: OnKeyPress) => void`
autoFocus?: | Indicates if the component should automatically gain focus | `boolean | undefined`
focusable?: | Indicates if the component can be focused by keyboard | `boolean | undefined`
tintColor?: | Color used for tinting the component | `string`
tintType?: | Tint behavior type | `'default' \| 'hover' \| 'background' \| 'none'`
FocusHoverComponent?: | Component displayed on focus | `\| ReactElement  \| FunctionComponent  \| (() => ReactElement);`
group?: | Indicates if the component is a focusable group | `boolean`
haloEffect?: | Enables halo effect on focus (iOS only) | `boolean`
...rest | Remaining View props  | `View`


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

Props | Description | Type
-- | -- | --
focusable?: | Boolean property whether component can be focused by keyboard | `boolean \\| undefined` default `true`
onFocusChange?: | Callback for focus change handling | `(isFocused: boolean) => void \\| undefined`
focusType?: | Focus type can be `default`, `auto`, or `press`. Based on investigation, Android and iOS typically have different default behaviors. On Android, the `TextInput` is focused by default, while on iOS, you need to press to focus. `auto` is used for automatic focusing, while keyboard focus targets the input. With `press`, you need to press the spacebar to focus an input. | `"default" \\| "press" \\| "auto"`
blurType?: | Only for iOS. This defines the behavior for blurring input when focus moves away from the component. By default, iOS allows typing when the keyboard focus is on another component. You can use disable to blur input when focus moves away. (Further investigation is needed for Android.) | `"default"\\| "disable" \\| "auto"`
haloEffect?: | Enables halo effect on focus (iOS only) | `boolean`
tintColor?: | Color used for tinting the component | `string`
style?: | Style for the inner TextInput | `StyleProp<ViewStyle>`
focusStyle? | Style applied to the inner TextInput when focused | `FocusStyle`
containerStyle | Style for the container | StyleProp<ViewStyle>
containerFocusStyle?: | Style applied to the container when focused | `FocusStyle`
tintType?: | Tint behavior type | `'default' \\| 'hover' \\| 'background' \\| 'none'`
FocusHoverComponent?: | Component displayed on focus | `\\| ReactElement  \\| FunctionComponent  \\| (() => ReactElement);`
...rest | Remaining TextInput props  | `TextInputProps`


### KeyboardExtendedBaseView: (alias for: ExternalKeyboardView)

```js
import { KeyboardExtendedBaseView } from 'react-native-external-keyboard';
...
  <KeyboardExtendedBaseView
    onKeyDownPress={...}
    onKeyUpPress={...}
    focussable
  >
    <Text>Content</Text>
  </KeyboardExtendedBaseView>
```

Props | Description | Type
-- | -- | --
focusable | Indicates if the component can be focused by keyboard | `boolean \| undefined`
canBeFocused | (deprecated) Indicates if the component can be focused by keyboard | `boolean \| undefined`
group | Indicates if the component is a focusable group | `boolean`
onFocus | Handler called when the component is focused | `() => void`
onBlur | Handler called when the component loses focus | `() => void`
onFocusChange | Handler called when the component is focused or blurred | `(isFocused: boolean, tag?: number) => void`
onKeyUpPress | Handler for the key-up event | `(e: OnKeyPress) => void`
onKeyDownPress | Handler for the key-down event | `(e: OnKeyPress) => void`
onContextMenuPress?: | Handler for long press events triggered by the context menu command (iOS only) | () => void;
haloEffect | Enables halo effect on focus (iOS only) | `boolean \| undefined`
autoFocus | Indicates if the component should automatically gain focus | `boolean \| undefined`
tintColor | Color used for tinting the component | `string`
ref->focus | Command to programmatically focus the component | () => void;
...rest | Remaining View props | `View`

### Focus system, focus and autoFocus property

The focus system consists of two main parts: `KeyboardRootView` and `KeyboardExtendedBaseView`-based components.

- `KeyboardRootView` is used to manage preferredFocusEnvironments on iOS, enabling native control over focus.
- Components based on `KeyboardExtendedBaseView` (or `withKeyboardFocus` HOC) interact with `KeyboardRootView` and provide the `KeyboardFocus` command, allowing components to be focused via a ref (e.g., ref.current.focus).

For example:

```js
import { KeyboardFocus, KeyboardRootView, Pressable } from 'react-native-external-keyboard';

export default function App() {
  const ref = useRef<KeyboardFocus>(null);


  return (
    <KeyboardRootView>
      <SafeAreaView style={styles.container}>
        <Pressable
          ref={ref}
          autoFocus
          tintType={tinyType}
          tintColor="#ffffff"
          containerStyle={[styles.container, { width }]}
        >
          <Image source={source} style={styles.image} />
        </Pressable>
        <Button title="Focus" onPress={() => ref.current?.focus()}>
      </SafeAreaView>
    </KeyboardRootView>
  );
}
```

Ideally, the `KeyboardRootView` should be placed at the `root` of your app. If you have focusable components inside a modal and want to control them using the `autoFocus` or `focus command`, the `KeyboardRootView` should also be placed at the root of the `Modal`.

```js
import { KeyboardRootView, Pressable } from 'react-native-external-keyboard';
...

export default function App() {
  return (
    <KeyboardRootView style={{ flex: 1 }}>
      {/* content */}
    </KeyboardRootView>
  );
}

...

export function CustomModal() {
  return <Modal>
    <KeyboardRootView style={{ flex: 1 }}>
      {/* content */}
      <Pressable autoFocus>
        <Text>Focusable pressable</Text>
      </Pressable>
    </KeyboardRootView>
  </Modal>
}
```

# Migration 0.3.x to 0.4.0
ToDo

## Pressable
<details>
  <summary>Pressable changes</summary>

Unfortunately, the previous version of Pressable had many issues. For iOS, we cloned the entire Pressable component from React Native's source code, while for Android, we simply wrapped the component.


This led to two main problems:

1. Difficulty in updating Pressable for iOS.
2. Challenges in controlling styles.

For example:

| Android | iOS |
| ------- | --- |
```js
  <KeyboardFocusView
        style={style}
        focusStyle={focusStyle}
        ref={ref}
        withView={false}
        onKeyUpPress={onKeyUpPressHandler}
        onKeyDownPress={onKeyDownHandler}
        canBeFocused={canBeFocused}
        onFocusChange={onFocusChange}
      >
        <RNPressable
          onPressOut={onPressOut}
          onPressIn={onPressIn}
          onPress={onPressablePressHandler}
          onLongPress={onLongPress}
          {...props}
        />
      </KeyboardFocusView>
 ```
 |
 ```js
<KeyboardFocusView
        {...restPropsWithDefaults}
        {...eventHandlers}
        canBeFocused={canBeFocused}
        onFocusChange={onFocusChange}
        onKeyUpPress={onKeyUpPress}
        onKeyDownPress={onKeyDownPress}
        onContextMenuPress={onLongPress}
        ref={viewRef}
        style={typeof style === 'function' ? style({ pressed }) : style}
        collapsable={false}
      >
        {typeof children === 'function' ? children({ pressed }) : children}
      </KeyboardFocusView> |
```

For these reasons, we replaced Pressable with `withKeyboardFocus(Pressable)`, as it was the only viable path forward to introduce new features. To ease the migration, a `Tappable` component was added as a temporary substitute.

The `KeyboardExtendedPressable` component is an Android-based version of Pressable that mimics the previous implementation. However, it will also likely be deprecated, possibly with the final release.

</details>


## Component aliases

It is believed that good naming can simplify usage and development. Based on this principle and for compatibility with `0.2.x`, aliases were added. You can still use the old naming convention, and it will be maintained in future releases.

The map of aliases is provided below: <br />
`A11yModule` -> `KeyboardExtendedModule` <br />
`Pressable` -> `KeyboardExtendedPressable` <br />
`KeyboardFocusView` -> `KeyboardExtendedView` <br />
`ExternalKeyboardView` -> `KeyboardExtendedBaseView` <br />


# API
ToDo

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

## Roadmap
ToDo

## Contributing
ToDo

## Acknowledgements
ToDo

## License

MIT

---

Made with [create-react-native-library](https://github.com/callstack/react-native-builder-bob)
