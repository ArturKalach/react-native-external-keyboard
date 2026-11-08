# API reference

The non-component surface of `react-native-external-keyboard`: the `Keyboard` module, the `withKeyboardFocus` HOC contract, the imperative ref, hooks, focus-order props, and shared types.

- [`Keyboard` module](#keyboard-module)
- [`withKeyboardFocus` HOC](#withkeyboardfocus-hoc)
- [Default key behavior](#default-key-behavior)
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
| `Keyboard.configure(config)` | iOS (no-op settings on Android) | Sets app-wide defaults. Call once at startup, before the first render. |

### `Keyboard.configure`

```ts
import { Keyboard } from 'react-native-external-keyboard';

Keyboard.configure({ uniqueGroupIdentifier: true });
```

| Option | Type | Default | Description |
| :-- | :-- | :-- | :-- |
| `uniqueGroupIdentifier` | `boolean` | `false` | (iOS) Give every focusable view without a `groupIdentifier` its own generated focus group (the pre-0.14 behavior). Overridden by `K.GroupIdentifierProvider` and the view prop. See [Focus groups](../guides/keyboard-grouping.md#app-wide-default). |

It is a plain module setting (type `ExternalKeyboardConfig`), so it also reaches portals and separate React roots. It does not re-render mounted views.

### Platform behavior

`Keyboard` is a thin namespace whose `dismiss()` is resolved per platform:

| Platform | What `dismiss()` does |
| :-- | :-- |
| iOS / default | Calls React Native's own `Keyboard.dismiss()`. |
| Android | Calls React Native's `Keyboard.dismiss()` **and** the library's native `ExternalKeyboard.dismissKeyboard()`. The extra native call is needed because, with a hardware keyboard attached, Android's framework dismiss alone does not always hide the soft keyboard. |

The Android native method is a TurboModule (`ExternalKeyboardModule`) with `dismissKeyboard(): Promise<boolean>`, also reached through the Legacy Bridge when the New Architecture is off. It is an internal detail. `Keyboard.dismiss()` is the cross-platform entry point.

> The soft keyboard can also be hidden by the user from system settings or by pressing `Alt + K`.

---

## withKeyboardFocus HOC

```tsx
function withKeyboardFocus<C>(Component: C): KeyboardFocusableComponent<C>;
```

Wraps any `Pressable`/`Touchable`-like component and returns a new component that:

- forwards focus/blur via `onFocus`, `onBlur`, `onFocusChange`;
- applies `style` / `containerStyle`, static or as a callback that receives `{ focused, pressed }` ([`InteractionState`](#interactionstate)), and the focus-only `focusStyle` / `containerFocusStyle`;
- supports `autoFocus`, `triggerCodes`, and the `KeyboardFocus` ref;
- exposes the wrapped component's render state through `renderContent` / `renderFocusable`;
- exposes focus/press to descendants without re-rendering the host via `useIsViewFocused` / `useIsViewPressed`.

See the [withKeyboardFocus component docs](../components/overview.md#withkeyboardfocus) for the full props table and `renderContent` / `renderFocusable` examples.

### Render props

| Prop | Receives | Available when |
| :-- | :-- | :-- |
| `renderContent` | the component's own render state merged with `{ focused }` | the wrapped component's `children` is a render function (e.g. `Pressable`) |
| `renderFocusable` | `{ focused }` only | always — for components without a render-prop `children` (e.g. `TouchableOpacity`) |

---

## Default key behavior

Keyboard behavior of a focused component:

| Action | iOS | Android |
| :-- | :-- | :-- |
| Move focus | `Ctrl + Tab` / `Ctrl + Shift + Tab`, arrow keys | `Tab` / `Shift + Tab`, arrow keys, D-pad |
| Move across focus groups | `Tab` / `Shift + Tab` | — |
| `onPress` | `Space` or `Enter` | `Space`, `Enter`, or D-pad center |
| `onLongPress` | "Open context menu" command (default `Tab + M`) | Holding a press key |

`onPress` fires on key release. The `triggerCodes` prop replaces the press keys with other key codes.

> [!NOTE]
> iOS has no long press for a held key: *Full Keyboard Access* handles keys itself. For this reason, `onLongPress` on iOS is bound to the context menu command, which is remappable in **Settings → Accessibility → Keyboards → Full Keyboard Access → Commands**.

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
| `useIsViewFocused` | `() => boolean` | Returns whether the nearest keyboard-focusable ancestor is currently focused. Read it from a descendant to react to focus state without re-rendering the host. |
| `useIsViewPressed` | `() => boolean` | Returns whether the nearest `withKeyboardFocus`-wrapped ancestor (`K.Pressable` / `withKeyboardFocus(X)`) is currently pressed — touch **or** physical keyboard. Read it from a descendant to react to press state without re-rendering the host. Not available under `K.View`, which has no press state. |
| `useOrderFocusGroup` | `() => OrderFocusGroupContext` | Returns the current focus-order group context (its `groupId` / namespace). Provided by `K.Order`. |

Related context export: `OrderFocusGroupContext`, the context provided by `K.Order`.

---

## Focus-order props

Links between views (`orderId`, `order*`, `orderPrefix`), index order (`orderGroup`, `orderIndex`), and locked directions (`lockFocus`) are props of every keyboard-focusable component. The full table is in [Focus order → Props](../guides/focus-order.md#props).

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

### `InteractionState`

The state passed to a function-form `style` / `containerStyle` on a `withKeyboardFocus`-wrapped component (`K.Pressable`, `withKeyboardFocus(X)`) — one consistent shape for both keyboard focus and press:

```ts
type InteractionState = {
  readonly focused: boolean;
  readonly pressed: boolean;
};
```

### `InteractiveStyleProp` / `ContainerStyle`

The types behind `style` and `containerStyle` on a `withKeyboardFocus`-wrapped component: a static style/array, or a callback receiving `InteractionState`.

```ts
type InteractiveStyleProp =
  | StyleProp<ViewStyle>
  | ((state: InteractionState) => StyleProp<ViewStyle>);

type ContainerStyle<ViewStyleType> =
  | ViewStyleType
  | ViewProps['style']
  | ((state: InteractionState) => ViewProps['style']);
```

See [Focus styles and events](../guides/pressable-focus.md#how-it-works) for usage.

### `FocusStyle`

The pre-unification, focus-only style prop (`focusStyle` / `containerFocusStyle`) — either a static style or a callback receiving `{ focused }` only (no `pressed`). Still fully supported, not deprecated.

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

The matching enum `LockFocusEnum` is also defined. <!-- TODO: confirm — `LockFocusEnum`, `LockFocusType`, `FocusStyle`, `InteractionState`, `InteractiveStyleProp`, `ContainerStyle` are exported from src/types but not re-exported from src/index.tsx -->

### Other exported types

<!-- TODO: confirm — of this table, src/index.tsx re-exports only `KeyboardFocus`, `BaseKeyboardViewType`, `KeyboardInputProps`, `KeyboardFocusLockProps`, `LockComponentType`, `WithKeyboardFocusProps`, `KeyboardFocusableComponent`; the rest are internal -->

| Type | Description |
| :-- | :-- |
| `KeyboardFocus` | Imperative ref handle (`focus`, `keyboardFocus`, `screenReaderFocus`). |
| `BaseKeyboardViewType` | `View` augmented with the `KeyboardFocus` handle. |
| `BaseKeyboardViewProps` / `BaseFocusViewProps` | Props for `K.BaseView`. |
| `KeyboardFocusViewProps` / `FocusViewProps` | Props for `K.View`. |
| `KeyboardInputProps` | Props for `K.Input`. |
| `KeyboardFocusLockProps`, `LockComponentType` | Props/enum for `Focus.Frame` / `Focus.Trap`. |
| `WithKeyboardFocusProps`, `KeyboardFocusableComponent` | The `withKeyboardFocus` HOC contract. |
| `InteractionState`, `InteractiveStyleProp`, `ContainerStyle` | Types behind the function-form `style` / `containerStyle`. |
| `KeyboardFocusEvent`, `NativeFocusChangeHandler` | Raw native focus-change event + handler. |

---

← [Component overview](../components/overview.md) · [Migration guide →](../migration/migration.md)
