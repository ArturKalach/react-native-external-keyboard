# React Native External Keyboard

React Native library for enhanced external keyboard support.

- ⚡️ The New Architecture is supported
- ⚡️ Bridgeless

> [!NOTE]
> React Native `0.80.0` includes a fix for `TextInput` focus on Android.
> `TextInput`: Can now focus TextInput with keyboard ([e00028f6bb](https://github.com/facebook/react-native/commit/e00028f6bb6c19de861f9a25f377295755f3671b) by [@joevilches](https://github.com/joevilches))
>
> This means that there is no need to use the workaround with `KeyboardExtendedInput`, and it is recommended to use the default `TextInput` instead. Additionally, because of changes in `TextInput`, `focusType="press"` for `KeyboardExtendedInput`  no longer works on Android.


## New Release: Focus Lock and Focus Order
Improved keyboard focus control with features like focus order, ordered links, and focus lock.

|Android| iOS|
|-|-|
| <image alt="Android Focus Order Example" src="https://github.com/user-attachments/assets/8bae353e-cf4b-41f7-8796-fd1cceae5df5" height="400" />|  <image alt="iOS Focus Order Example" src="https://github.com/user-attachments/assets/51850cc6-9573-4ccb-b69c-14deefbb4b65" height="400"/> |

<details>
  <summary>More Information</summary>
  
Advanced focus order functionality for Android and iOS, plus focus lock!

It can be really challenging to manage focus in React Native, but fortunately, there are tools available to simplify the process. 

## Link Focus Order

`Linking` components could be the most logical way to define focus order. By using properties such as `orderId` and `orderBackward`, `orderForward`, `orderLeft`, `orderRight`, `orderUp`, and `orderDown`, you can customize the focus order according to your needs.

```tsx
<View>
  <Pressable
    onPress={onPress}
    orderId="0_0"
    orderForward="0_2"
  >
    <Text>1</Text>
  </Pressable>
  <Pressable
    onPress={onPress}
    orderId="0_2"
    orderBackward="0_1"
  >
    <Text>3</Text>
  </Pressable>
  <Pressable
    onPress={onPress}
    orderId="0_1"
    orderForward="0_2"
    orderBackward="0_0"
  >
    <Text>2</Text>
  </Pressable>
</View>
```

You can find more examples here: [Focus Link Order](https://github.com/ArturKalach/react-native-external-keyboard/blob/release/0.6.0-rc/example/src/components/FocusOrderExample/FocusLinkOrder.tsx), [DPad Order](https://github.com/ArturKalach/react-native-external-keyboard/blob/release/0.6.0-rc/example/src/components/FocusOrderExample/FocusDPadOrder.tsx)

| Props | Description | Type |
| :-- | :-- | :-- |
| orderId? | A unique ID used for link target identification. | `string` |
| orderBackward? | ID of the target for backward navigation with "Tab + Shift". | `string` |
| orderForward? | ID of the target for forward navigation with "Tab". | `string` |
| orderLeft? | ID of the target for navigation to the left. | `string` |
| orderRight? | ID of the target for navigation to the right. | `string` |
| orderUp? | ID of the target for navigation upward. | `string` |
| orderDown? | ID of the target for navigation downward. | `string` |

## Indexes Focus Order

Linking is one of the best ways to set up focus order. However, there may be cases where you need to define the order of multiple elements, such as groups. As an alternative solution, you can use Indexes.

```tsx
<KeyboardOrderFocusGroup>
  <View>
    <Pressable
      onPress={onPress}
      orderIndex={0}
    >
      <Text>First</Text>
    </Pressable>
    <Pressable
      onPress={onPress}
      orderIndex={2}
    >
      <Text>Third</Text>
    </Pressable>
    <Pressable
      onPress={onPress}
      orderIndex={1}
    >
      <Text>Second</Text>
    </Pressable>
  </View>
</KeyboardOrderFocusGroup>
```
Indexing requres `orderGroup` param for proper order set,  you can use `KeyboardOrderFocusGroup` or provide `orderGroup` to the component.

```tsx
 <Pressable
      orderGroup="main"
      onPress={onPress}
      orderIndex={2}
    >
      <Text>Back</Text>
  </Pressable>
```

| Props | Description | Type |
| :-- | :-- | :-- |
| orderGroup? | The name of the group containing ordered elements. | `string` |
| orderIndex? | The order index of the element within the group. | `number` |


You can find more examples here: [Focus Order via indexes](https://github.com/ArturKalach/react-native-external-keyboard/blob/release/0.6.0-rc/example/src/components/FocusOrderExample/FocusOrder.tsx)

## Focus Lock

Finally, you can lock focus to specific directions. 

```tsx
 <Pressable
  lockFocus={['down', 'right']}
>
  <Text>Lock Example</Text>
</Pressable>
```


| Props | Description | Type |
| :-- | :-- | :-- |
| lockFocus? | An array of directions to lock focus. | Array of 'left' | 'right' | 'up' | 'down' | 'forward' | 'backward' | 'first' | 'last' |

> [!NOTE]  
> `first` and `last` are specific to `iOS`. When focus is blocked for `forward` and `backward` on iOS, it checks for the `last` and `first` elements to focus.
</details>


iOS | Android
-- | --
<img src="/.github/images/rnek-ios-example.gif" height="500" /> | <img src="/.github/images/rnek-android-example.gif" height="500" />

## Features

- Keyboard focus management and autofocus capabilities.
- Key press event handling.
- Focus management for `TextInput` and `Pressable` components.
- Customization of the `Halo Effect` and `tintColor` for iOS.
- Keyboard focus order.

## Installation

```sh
npm install react-native-external-keyboard
```

iOS:

```sh
cd ios && pod install && cd ..
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
style?: | Styles the inner component | `StyleProp<ViewStyle>; for Pressable: PressableProps['style']`
withPressedStyle?: | Enables the pressed style handler for custom components; always true for the standard Pressable. | `boolean \| undefined`, false by default
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
ref?: | Provides a reference to the component, allowing programmatic focus control | `{ focus: () => void}`
viewRef?: | Provides a reference to the underlying view component | `RefObject<View>`
onBubbledContextMenuPress | Handler for bubbled long-press events triggered by the context menu command (iOS only) | () => void;
triggerCodes?: | `onPress` and `onLongPress` trigger codes  | `number[] \| undefined`,  spacebar and enter by default
enableA11yFocus?: | Can be used to move the screen reader focus within the keyboard using `ref.current.focus`.                                           | `boolean \| undefined`
screenAutoA11yFocus?: | Enables screen reader auto-focus functionality. | `boolean \| undefined`
`screenAutoA11yFocusDelay?:`   | **Android only:** Delay for screen reader autofocus. On Android, focus can only be applied after the component has rendered, which may take 300–500 milliseconds. | `number \| undefined`, default: 300
`exposeMethods?:` | List of exposed view methods  | `string[] \| undefined`, by default the following methods are exposed: `'blur', 'measure', 'measureInWindow', 'measureLayout', and 'setNativeProps'`.
orderId? | A unique ID used for link target identification. | `string`
orderBackward? | ID of the target for backward navigation with "Tab + Shift". | `string`
orderForward? | ID of the target for forward navigation with "Tab". | `string`
orderLeft? | ID of the target for navigation to the left. | `string`
orderRight? | ID of the target for navigation to the right. | `string`
orderUp? | ID of the target for navigation upward. | `string`
orderDown? | ID of the target for navigation downward. | `string`
lockFocus? | An array of directions to lock focus. | Array of 'left' \| 'right' \| 'up' \| 'down' \| 'forward' \| 'backward' \| 'first' \| 'last'
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
onBubbledContextMenuPress | Handler for bubbled long-press events triggered by the context menu command (iOS only) | () => void;
autoFocus?: | Indicates if the component should automatically gain focus | `boolean | undefined`
focusable?: | Indicates if the component can be focused by keyboard | `boolean | undefined`
tintColor?: | Color used for tinting the component | `string`
tintType?: | Tint behavior type | `'default' \| 'hover' \| 'background' \| 'none'`
FocusHoverComponent?: | Component displayed on focus | `\| ReactElement  \| FunctionComponent  \| (() => ReactElement);`
group?: | Indicates if the component is a focusable group | `boolean`
haloEffect?: | Enables halo effect on focus (iOS only) | `boolean`
triggerCodes?: | `onPress` and `onLongPress` trigger codes  | `number[] \| undefined`,  spacebar and enter by default
enableA11yFocus?: | Can be used to move the screen reader focus within the keyboard using `ref.current.focus`.                                           | `boolean \| undefined`
screenAutoA11yFocus?: | Enables screen reader auto-focus functionality. | `boolean \| undefined`
`screenAutoA11yFocusDelay?:`   | **Android only:** Delay for screen reader autofocus. On Android, focus can only be applied after the component has rendered, which may take 300–500 milliseconds. | `number \| undefined`, default: 300
`exposeMethods?:` | List of exposed view methods  | `string[] \| undefined`, by default the following methods are exposed: `'blur', 'measure', 'measureInWindow', 'measureLayout', and 'setNativeProps'`.
orderId? | A unique ID used for link target identification. | `string`
orderBackward? | ID of the target for backward navigation with "Tab + Shift". | `string`
orderForward? | ID of the target for forward navigation with "Tab". | `string`
orderLeft? | ID of the target for navigation to the left. | `string`
orderRight? | ID of the target for navigation to the right. | `string`
orderUp? | ID of the target for navigation upward. | `string`
orderDown? | ID of the target for navigation downward. | `string`
lockFocus? | An array of directions to lock focus. | Array of 'left' \| 'right' \| 'up' \| 'down' \| 'forward' \| 'backward' \| 'first' \| 'last'
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
onSubmitEditing?: | Extended `onSubmitEditing` for mulitline input | `(e: NativeSyntheticEvent<TextInputSubmitEditingEventData>) => void)`
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
onBubbledContextMenuPress | Handler for bubbled long-press events triggered by the context menu command (iOS only) | () => void;
haloEffect | Enables halo effect on focus (iOS only) | `boolean \| undefined`
autoFocus | Indicates if the component should automatically gain focus | `boolean \| undefined`
tintColor | Color used for tinting the component | `string`
ref->focus | Command to programmatically focus the component | () => void;
orderId? | A unique ID used for link target identification. | `string`
orderBackward? | ID of the target for backward navigation with "Tab + Shift". | `string`
orderForward? | ID of the target for forward navigation with "Tab". | `string`
orderLeft? | ID of the target for navigation to the left. | `string`
orderRight? | ID of the target for navigation to the right. | `string`
orderUp? | ID of the target for navigation upward. | `string`
orderDown? | ID of the target for navigation downward. | `string`
lockFocus? | An array of directions to lock focus. | Array of 'left' \| 'right' \| 'up' \| 'down' \| 'forward' \| 'backward' \| 'first' \| 'last'
...rest | Remaining View props | `View`

### KeyboardFocusGroup
The `KeyboardFocusGroup` is a View-based component developed based on the iOS API. It can be used for defining focus groups or setting the `tintColor` globally.

```tsx
  <KeyboardFocusGroup  
    tintColor="orange">
    <ScrollView
      contentContainerStyle={styles.contentContainer}
      style={styles.container}
    >
    ...
    </ScrollView>
  </KeyboardFocusGroup>
  <KeyboardFocusGroup 
    focusStyle={{ backgroundColor: 'green' }}
    onFocusChange={(e) => console.log('green', e)}
    groupIdentifier="green"
    tintColor="green"
  >
      <Button>
  </KeyboardFocusGroup>
  <KeyboardFocusGroup
    focusStyle={{ backgroundColor: 'yellow' }}
    onFocusChange={(e) => console.log('yellow', e)}
    groupIdentifier="yellow"
    tintColor="yellow"
  >
      <Button>
  </KeyboardFocusGroup>
```

Props | Description | Type
-- | -- | --
focusStyle? | Style applied to the inner component when it is focused | `FocusStyle`
onFocusChange?: | Handler called when the component is focused or blurred | `(isFocused: boolean) => void;`
onFocus?: | Handler called when the component is focused  | `() => void`
onBlur?: | Handler called when the component loses focus | `() => void`
groupIdentifier?: | Relates to iOS `focusGroupIdentifier`: the identifier of the focus group to which this view belongs| `string`

### Keyboard
Keyboard module to support soft keyboard dismissal.

```tsx
import { Keyboard } from 'react-native-external-keyboard';

...
  Keyboard.dismiss();
...
```

This is needed for hiding the soft keyboard using a hardware keyboard. Additionally, the soft keyboard can be hidden from the settings or by pressing `Alt + K`.

## Focus order features

## Link Focus Order

`Linking` components could be the most logical way to define focus order. By using properties such as `orderId` and `orderBackward`, `orderForward`, `orderLeft`, `orderRight`, `orderUp`, and `orderDown`, you can customize the focus order according to your needs.

```tsx
<View>
  <Pressable
    onPress={onPress}
    orderId="0_0"
    orderForward="0_2"
  >
    <Text>1</Text>
  </Pressable>
  <Pressable
    onPress={onPress}
    orderId="0_2"
    orderBackward="0_1"
  >
    <Text>3</Text>
  </Pressable>
  <Pressable
    onPress={onPress}
    orderId="0_1"
    orderForward="0_2"
    orderBackward="0_0"
  >
    <Text>2</Text>
  </Pressable>
</View>
```

You can find more examples here: [Focus Link Order](https://github.com/ArturKalach/react-native-external-keyboard/blob/release/0.6.0-rc/example/src/components/FocusOrderExample/FocusLinkOrder.tsx), [DPad Order](https://github.com/ArturKalach/react-native-external-keyboard/blob/release/0.6.0-rc/example/src/components/FocusOrderExample/FocusDPadOrder.tsx)

| Props | Description | Type |
| :-- | :-- | :-- |
| orderId? | A unique ID used for link target identification. | `string` |
| orderBackward? | ID of the target for backward navigation with "Tab + Shift". | `string` |
| orderForward? | ID of the target for forward navigation with "Tab". | `string` |
| orderLeft? | ID of the target for navigation to the left. | `string` |
| orderRight? | ID of the target for navigation to the right. | `string` |
| orderUp? | ID of the target for navigation upward. | `string` |
| orderDown? | ID of the target for navigation downward. | `string` |

## Indexes Focus Order

Linking is one of the best ways to set up focus order. However, there may be cases where you need to define the order of multiple elements, such as groups. As an alternative solution, you can use Indexes.

```tsx
<KeyboardOrderFocusGroup>
  <View>
    <Pressable
      onPress={onPress}
      orderIndex={0}
    >
      <Text>First</Text>
    </Pressable>
    <Pressable
      onPress={onPress}
      orderIndex={2}
    >
      <Text>Third</Text>
    </Pressable>
    <Pressable
      onPress={onPress}
      orderIndex={1}
    >
      <Text>Second</Text>
    </Pressable>
  </View>
</KeyboardOrderFocusGroup>
```
Indexing requres `orderGroup` param for proper order set,  you can use `KeyboardOrderFocusGroup` or provide `orderGroup` to the component.

```tsx
 <Pressable
      orderGroup="main"
      onPress={onPress}
      orderIndex={2}
    >
      <Text>Back</Text>
  </Pressable>
```

| Props | Description | Type |
| :-- | :-- | :-- |
| orderGroup? | The name of the group containing ordered elements. | `string` |
| orderIndex? | The order index of the element within the group. | `number` |


You can find more examples here: [Focus Order via indexes](https://github.com/ArturKalach/react-native-external-keyboard/blob/release/0.6.0-rc/example/src/components/FocusOrderExample/FocusOrder.tsx)

## Focus Lock

Finally, you can lock focus to specific directions. 

```tsx
 <Pressable
  lockFocus={['down', 'right']}
>
  <Text>Lock Example</Text>
</Pressable>
```


| Props | Description | Type |
| :-- | :-- | :-- |
| lockFocus? | An array of directions to lock focus. | Array of 'left' \| 'right' \| 'up' \| 'down' \| 'forward' \| 'backward' \| 'first' \| 'last' |

> [!NOTE]  
> `first` and `last` are specific to `iOS`. When focus is blocked for `forward` and `backward` on iOS, it checks for the `last` and `first` elements to focus.


# Migration 0.3.x to 0.4.0

## Module (A11yModule, KeyboardExtendedModule)

Functions in the `A11yModule` (`KeyboardExtendedModule`) have been deprecated. They appeared appropriate at the time, but with the new architecture and to improve usability, they have been replaced with `ref` actions.

Previous:
```jsx
import { KeyboardExtendedModule } from 'react-native-external-keyboard';

KeyboardExtendedModule.setKeyboardFocus(ref); //or A11yModule.setKeyboardFocus(ref);
```

Updated: 
```
import { KeyboardExtendedPressable, type KeyboardFocus } from 'react-native-external-keyboard';
...

const ref = useRef<KeyboardFocus>(null);

...

const onPressForFocus = () => {
  ref.current.focus()
}

<TouchableOpacity
  ref={ref}
>
  <Text>TouchableOpacity</Text>
</TouchableOpacity>

```

The specific method for iOS, `setPreferredKeyboardFocus`, has not been added so far because we now have the new feature `autoFocus`, which does not fit well with the new API and its approach. It is better to use `autoFocus` for focusing views on both Android and iOS.

If you truly need this method, please create a new issue, and we will consider how to return it.

## Pressable
<details>
  <summary>Pressable changes</summary>

Unfortunately, the previous version of Pressable had many issues. For iOS, we cloned the entire Pressable component from React Native's source code, while for Android, we simply wrapped the component.


This led to two main problems:

1. Difficulty in updating Pressable for iOS.
2. Challenges in controlling styles.

For these reasons, we replaced Pressable with `withKeyboardFocus(Pressable)`, as it was the only viable path forward to introduce new features.
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
- [ ] Refactor and Performance optimization
- [ ] Update `focusGroupIdentifier` and implement `KeyboardNavigationCluster` functionality
- [ ] Update `onPress` and `onLongPress` for `withKeyboardFocus`
- [x] Add functionality to control keyboard focus order.
- [ ] Verify and update `focusable` and `disabled` states for iOS and Android.
- [ ] Update `Readme.md`.
- [ ] Create the documentation.


## Contributing
Any type of contribution is highly appreciated. Feel free to create PRs, raise issues, or share ideas.

## Acknowledgements
It has been a long journey since the first release of the `react-native-external-keyboard` package. Many features have been added, and a lot of issues have been fixed.

With that, I would like to thank the contributors, those who created issues, and the followers, because achieving these results wouldn't have been possible without you.

Thanks to the initial authors: [Andrii Koval](https://github.com/ZioVio), [Michail Chavkin](https://github.com/mchavkin), [Dzmitry Khamitsevich](https://github.com/bulletxenus).

Thanks to the contributors: [João Mosmann](https://github.com/JoaoMosmann), [Stéphane](https://github.com/stephane-r).

Thanks to those who created issues:  [Stéphane](https://github.com/stephane-r), [proohit](https://github.com/proohit), [Rananjaya Bandara](https://github.com/Rananjaya), [SteveHoneckPGE](https://github.com/SteveHoneckPGE), [Wes](https://github.com/mrpoodestump)

I really appreciate your help; it has truly helped me move forward!

## License

MIT

---

Made with [create-react-native-library](https://github.com/callstack/react-native-builder-bob)
