# Pressable focus handling

| iOS | Android |
| --- | --- |
| <img src="../images/programatic-focus-ios.gif" height="400" alt="Programmatic focus on iOS" /> | <img src="../images/programatic-focus-android.gif" height="400" alt="Programmatic focus on Android" /> |

This guide covers how a keyboard-focusable `Pressable`/`Touchable` reports focus and how to style it: the focus lifecycle events (`onFocus`, `onBlur`, `onFocusChange`), the two style hooks (`focusStyle`, `containerFocusStyle`), and the two render props (`renderContent`, `renderFocusable`).

Everything here applies to any component created with `withKeyboardFocus`, to the ready-made `K.Pressable`, and to `KeyboardExtendedView`.

For a plain `Pressable`, reach for `K.Pressable` — it's already wrapped, so there's nothing to set up:

```tsx
import { K } from 'react-native-external-keyboard';

// Use directly — equivalent to withKeyboardFocus(Pressable)
<K.Pressable onPress={onPress} focusStyle={{ backgroundColor: 'dodgerblue' }}>
  <Text>Item</Text>
</K.Pressable>
```

For your own touchables (a custom button, `TouchableOpacity`, …), wrap them with `withKeyboardFocus`:

```tsx
import { withKeyboardFocus } from 'react-native-external-keyboard';
import { Pressable, TouchableOpacity } from 'react-native';

const KeyboardPressable = withKeyboardFocus(Pressable); // same as K.Pressable
const KeyboardTouchable = withKeyboardFocus(TouchableOpacity);
```

The examples below use `KeyboardPressable`, but `K.Pressable` is interchangeable — they're the same component.

---

## Focus & blur events

A keyboard-focusable component fires events as physical-keyboard focus moves in and out of it. These are independent of press events — they fire on `Tab` / `Shift + Tab` / arrow navigation, not on activation.

| Event | Fires when | Signature |
| :-- | :-- | :-- |
| `onFocus` | The component gains keyboard focus. | `() => void` |
| `onBlur` | The component loses keyboard focus. | `() => void` |
| `onFocusChange` | On focus **and** blur. | `(isFocused: boolean, tag?: number) => void` |

```tsx
<KeyboardPressable
  onFocus={() => console.log('focused')}
  onBlur={() => console.log('blurred')}
  onFocusChange={(isFocused, tag) => console.log({ isFocused, tag })}
  onPress={onPress}
>
  <Text>Item</Text>
</KeyboardPressable>
```

`onFocusChange` is the convenient one for driving a single piece of state:

```tsx
const [focused, setFocused] = useState(false);

<KeyboardPressable onFocusChange={setFocused} onPress={onPress}>
  <Text>{focused ? 'Focused' : 'Not focused'}</Text>
</KeyboardPressable>
```

> [!NOTE]
> Focus events fire regardless of `disabled`. A `disabled` component can still be focused and reported via `onFocus` / `onBlur`; only the synthesized `onPress` is suppressed while disabled.

---

## Styling the focused state

There are two layers you can style, each with a static-or-callback `FocusStyle`:

| Prop | Applies to | Pair with |
| :-- | :-- | :-- |
| `focusStyle` | The **inner** component | `style` |
| `containerFocusStyle` | The **outer** container | `containerStyle` |

The container wraps the inner component; use `containerFocusStyle` for outlines/rings that should sit around the whole element, and `focusStyle` for changes to the pressable surface itself.

```tsx
<KeyboardPressable
  style={styles.button}
  focusStyle={{ backgroundColor: 'dodgerblue' }}
  containerStyle={styles.container}
  containerFocusStyle={{ borderColor: 'dodgerblue', borderWidth: 2 }}
  onPress={onPress}
>
  <Text>Styled on focus</Text>
</KeyboardPressable>
```

### Callback form

Both props accept a function receiving `{ focused }`, so you can compute the style:

```tsx
<KeyboardPressable
  focusStyle={({ focused }) => ({
    transform: [{ scale: focused ? 1.05 : 1 }],
  })}
  onPress={onPress}
>
  <Text>Scales on focus</Text>
</KeyboardPressable>
```

---

## Render props: `renderContent` vs `renderFocusable`

When you need the `focused` flag **inside** the children (not just as a style), use a render prop. Which one depends on the wrapped component.

### `renderContent` — components with a render-prop `children`

`Pressable` passes its own `{ pressed }` state to a `children` function. `renderContent` merges that state with `{ focused }`, so you can react to both at once:

```tsx
const KeyboardPressable = withKeyboardFocus(Pressable);

<KeyboardPressable
  onPress={onPress}
  renderContent={({ pressed, focused }) => (
    <View
      style={[
        styles.button,
        pressed && styles.pressed,
        focused && styles.focused,
      ]}
    >
      <Text>{pressed ? 'Pressed' : focused ? 'Focused' : 'Default'}</Text>
    </View>
  )}
/>
```

### `renderFocusable` — any other component

`TouchableOpacity` and most components do not expose a render-prop `children`, so `renderContent` isn't available. `renderFocusable` replaces `children` and receives only `{ focused }`:

```tsx
const KeyboardTouchable = withKeyboardFocus(TouchableOpacity);

<KeyboardTouchable
  onPress={onPress}
  renderFocusable={({ focused }) => (
    <View style={[styles.button, focused && styles.focused]}>
      <Text>{focused ? 'Focused' : 'Default'}</Text>
    </View>
  )}
/>
```

### Which should I use?

| Situation | Use |
| :-- | :-- |
| Only need a style change on focus | `focusStyle` / `containerFocusStyle` |
| Need `focused` inside the rendered content | `renderFocusable` |
| Wrapped `Pressable` and need `pressed` + `focused` together | `renderContent` |

---

## Related

- [Native focus styling](./focus-styling.md) — halo, tint, Android highlight
- [Programmatic focus](./programmatic-focus.md) — focus from a `ref`
- [Component overview → withKeyboardFocus](../components/overview.md#withkeyboardfocus) — full props table

---

← [Getting started](../getting-started/getting-started.md) · [Native focus styling →](./focus-styling.md)
