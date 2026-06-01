# Programmatic focus

Sometimes focus needs to move in response to app logic — after opening a panel, submitting a form, or restoring a previous position. Every keyboard-focusable component exposes an imperative handle through `ref` for exactly this.

```tsx
import { useRef } from 'react';
import {
  withKeyboardFocus,
  type KeyboardFocus,
} from 'react-native-external-keyboard';

const KeyboardPressable = withKeyboardFocus(Pressable);

function Example() {
  const ref = useRef<KeyboardFocus>(null);

  return (
    <>
      <Button title="Focus the item" onPress={() => ref.current?.focus()} />
      <KeyboardPressable ref={ref} onPress={onPress}>
        <Text>Target</Text>
      </KeyboardPressable>
    </>
  );
}
```

---

## The `KeyboardFocus` handle

| Method | Moves | Use when |
| :-- | :-- | :-- |
| `focus()` | physical-keyboard **and** screen-reader focus | You want the element focused for both hardware-keyboard and VoiceOver/TalkBack users (the common case). |
| `keyboardFocus()` | physical-keyboard focus only | You only want to move the hardware-keyboard focus ring, without touching screen-reader focus. |
| `screenReaderFocus()` | screen-reader focus only | You want to move VoiceOver / TalkBack focus only. |

```tsx
ref.current?.focus();             // keyboard + screen reader
ref.current?.keyboardFocus();     // keyboard only
ref.current?.screenReaderFocus(); // screen reader only
```

> [!NOTE]
> `focus()` is **not** an alias of `keyboardFocus()` — it invokes both `keyboardFocus()` and `screenReaderFocus()`. Reach for `keyboardFocus()` when you specifically want to leave screen-reader focus where it is.

---

## Choosing between `autoFocus` and a ref

For "focus this on mount", prefer the [`autoFocus`](../components/overview.md#common-focus-props) prop — it's declarative and works on both platforms:

```tsx
<KeyboardPressable autoFocus onPress={onPress}>
  <Text>Focused on mount</Text>
</KeyboardPressable>
```

Use the imperative `ref` when the focus move is driven by an event that happens *after* mount (a press, a navigation, a state change):

```tsx
const ref = useRef<KeyboardFocus>(null);

const onOpenPanel = () => {
  setPanelOpen(true);
  ref.current?.focus(); // move focus into the panel
};
```

---

## Calling native view methods

The handle is a proxy. Beyond `focus` / `keyboardFocus` / `screenReaderFocus`, any other property falls through to the underlying native focusable view — so the standard `View` methods work off the same ref, with no extra setup:

```tsx
ref.current?.measure((x, y, width, height) => {
  /* … */
});
ref.current?.setNativeProps({ /* … */ });
```

### Reaching the wrapped component instance

That ref points at the focusable view. When you need the **wrapped** component itself (the `Pressable`, `TextInput`, etc. — for example to call a method it defines), pass a separate `componentRef`:

```tsx
const componentRef = useRef<View>(null);

<KeyboardPressable componentRef={componentRef} onPress={onPress}>
  <Text>Item</Text>
</KeyboardPressable>
```

---

## Related

- [Pressable focus handling](./pressable-focus.md) — focus/blur events and styling
- [API reference → Imperative ref](../api/overview.md#imperative-ref-keyboardfocus)

---

← [Native focus styling](./focus-styling.md) · [Keyboard text input →](./text-input.md)
