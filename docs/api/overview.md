# API reference

The non-component surface of `react-native-external-keyboard`: the `Keyboard` module, the `withKeyboardFocus` HOC contract, the imperative ref, hooks, focus-order props, and shared types.

- [`Keyboard` module](#keyboard-module)
- [`withKeyboardFocus` HOC](#withkeyboardfocus-hoc)
- [Imperative ref: `KeyboardFocus`](#imperative-ref-keyboardfocus)
- [Hooks](#hooks)
- [Focus-order props](#focus-order-props)
- [Types](#types)

---

## Keyboard module

Dismisses the soft (on-screen) keyboard — useful when typing on a hardware keyboard and the soft keyboard is still showing.

```tsx
import { Keyboard } from 'react-native-external-keyboard';

Keyboard.dismiss();
```

| Function | Platform | Description |
| :-- | :-- | :-- |
| `Keyboard.dismiss()` | iOS / Android | Hides the soft keyboard. |

### Platform behavior

`Keyboard` is a thin namespace whose `dismiss()` is resolved per platform:

| Platform | What `dismiss()` does |
| :-- | :-- |
| iOS / default | Calls React Native's own `Keyboard.dismiss()`. |
| Android | Calls React Native's `Keyboard.dismiss()` **and** the library's native `ExternalKeyboard.dismissKeyboard()`. The extra native call is needed because, with a hardware keyboard attached, Android's framework dismiss alone does not always hide the soft keyboard. |

The Android native method is a TurboModule (`ExternalKeyboardModule`) exposing `dismissKeyboard(): Promise<boolean>`, and is also reached through the Legacy Bridge when the New Architecture is off. It is an internal detail — call `Keyboard.dismiss()` rather than the native module directly so your code stays cross-platform.

> The soft keyboard can also be hidden by the user from system settings or by pressing `Alt + K`.

---

## withKeyboardFocus HOC

```tsx
function withKeyboardFocus<C>(Component: C): KeyboardFocusableComponent<C>;
```

Wraps any `Pressable`/`Touchable`-like component and returns a new component that:

- forwards focus/blur via `onFocus`, `onBlur`, `onFocusChange`;
- applies `focusStyle` / `containerFocusStyle` based on focus state;
- supports `autoFocus`, `triggerCodes`, and the `KeyboardFocus` ref;
- exposes the wrapped component's render state through `renderContent` / `renderFocusable`.

See the [withKeyboardFocus component docs](../components/overview.md#withkeyboardfocus) for the full props table and `renderContent` / `renderFocusable` examples.

### Render props

| Prop | Receives | Available when |
| :-- | :-- | :-- |
| `renderContent` | the component's own render state merged with `{ focused }` | the wrapped component's `children` is a render function (e.g. `Pressable`) |
| `renderFocusable` | `{ focused }` only | always — for components without a render-prop `children` (e.g. `TouchableOpacity`) |

---

## Imperative ref: `KeyboardFocus`

Keyboard-focusable components expose an imperative handle through `ref`.

```tsx
import { useRef } from 'react';
import { withKeyboardFocus, type KeyboardFocus } from 'react-native-external-keyboard';

const KeyboardPressable = withKeyboardFocus(Pressable);

function Example() {
  const ref = useRef<KeyboardFocus>(null);
  return (
    <>
      <Button title="Focus" onPress={() => ref.current?.focus()} />
      <KeyboardPressable ref={ref} onPress={onPress}>
        <Text>Target</Text>
      </KeyboardPressable>
    </>
  );
}
```

| Method | Description |
| :-- | :-- |
| `focus()` | Moves **both** physical-keyboard and screen-reader focus to this element (calls `keyboardFocus()` and `screenReaderFocus()`). |
| `keyboardFocus()` | Moves physical-keyboard focus only. |
| `screenReaderFocus()` | Moves screen-reader (VoiceOver / TalkBack) focus only. |

See the [Programmatic focus guide](../guides/programmatic-focus.md) for when to use each.

The handle is a proxy: any property other than the three methods above falls through to the underlying native view, so standard `View` methods (`measure`, `setNativeProps`, `blur`, …) work off the same ref. To reach the wrapped component instance itself, use the `componentRef` prop.

---

## Hooks

| Hook | Signature | Description |
| :-- | :-- | :-- |
| `useIsViewFocused` | `() => boolean` | Returns whether the nearest keyboard-focusable ancestor is currently focused. Read it from a descendant to react to focus state. |
| `useOrderFocusGroup` | `() => OrderFocusGroupContext` | Returns the current focus-order group context (its `groupId` / namespace). Provided by `KeyboardOrderFocusGroup`. |

Related context exports: `KeyboardOrderFocusGroup`, `OrderFocusGroupContext`.

---

## Focus-order props

These props appear on every focusable component. There are three independent ordering systems; they can be combined.

### 1. Link-based ordering

Name a target element's `orderId` for each direction.

```tsx
<Pressable orderId="0_0" orderForward="0_1"><Text>1</Text></Pressable>
<Pressable orderId="0_1" orderBackward="0_0" orderForward="0_2"><Text>2</Text></Pressable>
<Pressable orderId="0_2" orderBackward="0_1"><Text>3</Text></Pressable>
```

| Prop | Type | Description |
| :-- | :-- | :-- |
| `orderId` | `string` | Unique ID used as the link target for other elements. |
| `orderForward` | `string` | Target focused on forward navigation (`Tab`). |
| `orderBackward` | `string` | Target focused on backward navigation (`Shift + Tab`). |
| `orderLeft` | `string` | Target focused when navigating left. |
| `orderRight` | `string` | Target focused when navigating right. |
| `orderUp` | `string` | Target focused when navigating up. |
| `orderDown` | `string` | Target focused when navigating down. |
| `orderFirst` | `string \| null` | *(iOS)* Target when jumping to the first element. `null` clears the link. |
| `orderLast` | `string \| null` | *(iOS)* Target when jumping to the last element. `null` clears the link. |
| `orderPrefix` | `string` | Prefix prepended to this element's `orderId` and all `order*` targets, to keep IDs unique. |

> [!IMPORTANT]
> `orderId` values are **global**. In repeated content (a list rendering the same row), duplicate IDs cause incorrect focus jumps. Namespace them with `orderPrefix` or wrap the subtree in [`KeyboardOrderFocusGroup`](../components/overview.md#keyboardorderfocusgroup). Using a link prop with no prefix logs a console warning.

### 2. Index-based ordering

Within a named group, elements are focused in ascending `orderIndex`. Provide the group via `KeyboardOrderFocusGroup` or the `orderGroup` prop.

| Prop | Type | Description |
| :-- | :-- | :-- |
| `orderGroup` | `string` | Name of the group containing ordered elements. |
| `orderIndex` | `number` | Position within the group; lower indices are focused first. |

### 3. Direction locking

| Prop | Type | Description |
| :-- | :-- | :-- |
| `lockFocus` | [`LockFocusType[]`](#lockfocustype) | Directions in which focus movement is blocked. |

```tsx
<Pressable lockFocus={['down', 'right']}>
  <Text>Lock Example</Text>
</Pressable>
```

> [!NOTE]
> `first` and `last` are iOS-specific. When `forward` / `backward` are blocked on iOS, the system falls back to the `first` / `last` elements.

---

## Types

### `KeyPress`

Payload of `onKeyDownPress` / `onKeyUpPress`, delivered as `OnKeyPress` (`NativeSyntheticEvent<KeyPress>` — read it via `e.nativeEvent`).

| Field | Type | Description |
| :-- | :-- | :-- |
| `keyCode` | `number` | Platform key code. |
| `unicode` | `number` | Unicode code point of the key. |
| `unicodeChar` | `string` | Character produced by the key. |
| `isLongPress` | `boolean` | Whether this is a long press. |
| `isAltPressed` | `boolean` | `Alt` modifier held. |
| `isShiftPressed` | `boolean` | `Shift` modifier held. |
| `isCtrlPressed` | `boolean` | `Ctrl` modifier held. |
| `isCapsLockOn` | `boolean` | Caps Lock active. |
| `hasNoModifiers` | `boolean` | No modifier keys held. |

```tsx
import type { OnKeyPress } from 'react-native-external-keyboard';

const onKeyDownPress = (e: OnKeyPress) => {
  const { unicodeChar, isCtrlPressed } = e.nativeEvent;
};
```

### `OnKeyPress` / `OnKeyPressFn`

```ts
type OnKeyPress = NativeSyntheticEvent<KeyPress>;
type OnKeyPressFn = (e: OnKeyPress) => void;
```

### `OnFocusChangeFn`

```ts
type OnFocusChangeFn = (isFocused: boolean, tag?: number) => void;
```

`isFocused` is `true` on focus, `false` on blur; `tag` is the native view tag when available.

### `FocusStyle`

A style applied based on focus state — either a static style or a callback.

```ts
type FocusStyle =
  | StyleProp<ViewStyle>
  | ((state: { readonly focused: boolean }) => StyleProp<ViewStyle>)
  | undefined;
```

### `LockFocusType`

String-literal union for `lockFocus`:

```ts
type LockFocusType =
  | 'up' | 'down' | 'left' | 'right'
  | 'forward' | 'backward'
  | 'first' | 'last';
```

- `up` / `down` / `left` / `right` — block directional (arrow / DPad) movement.
- `forward` / `backward` — block `Tab` and `Shift + Tab`.
- `first` / `last` — *(iOS)* block jumping to the first / last focusable element.

The matching enum `LockFocusEnum` is also exported.

### Other exported types

| Type | Description |
| :-- | :-- |
| `KeyboardFocus` | Imperative ref handle (`focus`, `keyboardFocus`, `screenReaderFocus`). |
| `BaseKeyboardViewType` | `View` augmented with the `KeyboardFocus` handle. |
| `BaseKeyboardViewProps` / `BaseFocusViewProps` | Props for `BaseKeyboardView`. |
| `KeyboardFocusViewProps` / `FocusViewProps` | Props for `KeyboardFocusView`. |
| `KeyboardInputProps` | Props for `KeyboardExtendedInput`. |
| `KeyboardFocusLockProps`, `LockComponentType` | Props/enum for `Focus.Frame` / `Focus.Trap`. |
| `WithKeyboardFocusProps`, `KeyboardFocusableComponent` | The `withKeyboardFocus` HOC contract. |
| `KeyboardFocusEvent`, `NativeFocusChangeHandler` | Raw native focus-change event + handler. |

---

← [Component overview](../components/overview.md) · [Migration guide →](../migration/migration.md)
