# Migration Guide

Migration notes are listed newest first. Each section only covers changes that need action — additive features are documented in the [component overview](../components/overview.md) and [API reference](../api/overview.md).

- [1.0.x → 1.1.0](#migrating-to-110-from-10x)
- [0.9.1 → 1.0.0](#migrating-to-100-from-091)
- [0.9.0 → 0.9.1](#migrating-to-091-from-090)
- [0.7.x → 0.8.0](#migrating-to-080-from-07x)
- [0.3.x → 0.4.0](#migrating-to-040-from-03x)

---

## Migrating to 1.1.0 from 1.0.x

1.1.0 is additive — no renamed or removed props, and no new required config. There are two under-the-hood behavior fixes worth checking, plus a set of new APIs for styling and reacting to focus/press. Full guide: [Pressable focus handling](../guides/pressable-focus.md).

### Android: keyboard press now auto-tracked for function styles

This is a **behavioral fix**, not an API change. Before 1.1.0, physical-keyboard activation (Enter / Space / D-pad) on Android only fed into a function `style`/`containerStyle`'s `pressed` value when you explicitly set `androidKeyboardPressState`. In 1.1.0, it's auto-enabled whenever a pressed-reactive style exists (a function `style`, `containerStyle`, `renderContent`, or function `children`) — so keyboard press styles the same as touch by default, with no config.

```tsx
// 1.0.x — pressed stayed false on keyboard activation unless you opted in
<KeyboardPressable androidKeyboardPressState style={({ pressed }) => ...}>…</KeyboardPressable>

// 1.1.0 — keyboard press is picked up automatically
<KeyboardPressable style={({ pressed }) => ...}>…</KeyboardPressable>
```

> [!NOTE]
> If you relied on the old default (keyboard press *not* reflected in a function style), pass `androidKeyboardPressState={false}` explicitly to restore it.

### iOS: disabled halo no longer reappears on rounded views

Also a **behavioral fix**. The bug `roundedHaloFix` used to work around is now fixed at the source: a disabled halo (`haloEffect={false}`) always resolves to a suppressed effect and can no longer reappear from a view's `borderRadius` (`layer.cornerRadius`). `roundedHaloFix` is now a true no-op and will be removed in a future major — delete it from your code. [Details](../guides/focus-styling.md#roundedhalofix-deprecated-no-op).

### Deprecated: `withPressedStyle`

| Prop | Status | Notes |
| :-- | :-- | :-- |
| `withPressedStyle` | Deprecated, still works | No longer needed — the pressed-style handler is now enabled automatically whenever `style`/`containerStyle` is a function. Pass an explicit `false` only to force a static style on a component that can't take a function `style`. |

### New in 1.1.0

These are additive — no migration required. Adopt them only if you need the functionality.

| Addition | Description |
| :-- | :-- |
| `style` / `containerStyle` receive `{ focused, pressed }` | Both callbacks now share one `InteractionState` shape, so `style={({ focused, pressed }) => …}` works the same on either prop. Existing callbacks that only destructure `pressed` keep working unchanged. |
| `containerStyle` accepts a function | Previously static-only; it now takes the same `({ focused, pressed }) => style` callback as `style`, for styling the outer container/ring. [Details](../guides/pressable-focus.md#styling-on-focus--press). |
| `useIsViewPressed` | Reads the press state (touch **or** physical keyboard) of the nearest `withKeyboardFocus`-wrapped ancestor without re-rendering it — the press-side counterpart to `useIsViewFocused`. [Details](../guides/pressable-focus.md#reacting-without-re-rendering--useisviewfocused--useisviewpressed). |
| `InteractionState`, `InteractiveStyleProp`, `ContainerStyle`, `ContainerStyleStateType` | New exported types behind the function-form `style` / `containerStyle`. [Details](../api/overview.md#interactionstate). |

```tsx
// Zero-re-render context leaf, new in 1.1.0
import { useIsViewFocused, useIsViewPressed } from 'react-native-external-keyboard';

const Label = () => {
  const focused = useIsViewFocused();
  const pressed = useIsViewPressed();
  return <Text style={focused && styles.focused}>{pressed ? 'Pressed' : 'Idle'}</Text>;
};
```

---

## Migrating to 1.0.0 from 0.9.1

1.0.0 is a pre-release refactor that tidies up the public API. Runtime behavior is largely unchanged — the work is renaming a few props and exported types and dropping some that were redundant. The component names and their aliases (`ExternalKeyboardView`, `KeyboardExtendedView`, `KeyboardExtendedPressable`, `TextInput`, …) are all unchanged.

### Renamed component props

| 0.9.1 | 1.0.0 | Notes |
| :-- | :-- | :-- |
| `group` | `focusableWrapper` | Same native behavior; treats the view as a transparent focus wrapper rather than a focusable target. |
| `canBeFocused` | `focusable` | `canBeFocused` was already deprecated; it is now removed. `focusable` maps to the same native prop. |
| `viewRef` | `componentRef` | *(`withKeyboardFocus` components)* Ref to the wrapped component instance. The `KeyboardFocus` `ref` already proxies standard `View` methods (`measure`, `setNativeProps`, …) to the native view, so use `componentRef` only when you need the wrapped component itself. |

```tsx
// Before (0.9.1)
<KeyboardExtendedView group canBeFocused={isEnabled}>…</KeyboardExtendedView>
<KeyboardPressable viewRef={viewRef} onPress={onPress}>…</KeyboardPressable>

// After (1.0.0)
<KeyboardExtendedView focusableWrapper focusable={isEnabled}>…</KeyboardExtendedView>
<KeyboardPressable componentRef={componentRef} onPress={onPress}>…</KeyboardPressable>
```

### Removed component props

| Removed prop | Replacement |
| :-- | :-- |
| `enableA11yFocus` | Use `screenAutoA11yFocus` to auto-move screen-reader focus, or the imperative `ref.current?.screenReaderFocus()`. |
| `ignoreGroupFocusHint` | Removed — the iOS focus-hint workaround it controlled is gone. Delete the prop. |
| `FocusHoverComponent` | Removed — render focus-dependent content with the `renderContent` / `renderFocusable` render props, or style it with `focusStyle` / `containerFocusStyle`. |
| `exposeMethods` | Removed — the `KeyboardFocus` `ref` is now a proxy that forwards any non-focus property to the underlying native view automatically, so no allowlist is needed. Call `ref.current?.measure(...)`, `ref.current?.setNativeProps(...)`, etc. directly. |

```tsx
// Before (0.9.1)
<KeyboardPressable
  tintType="background"
  FocusHoverComponent={Highlight}
  exposeMethods={['measure', 'setNativeProps']}
  onPress={onPress}
>…</KeyboardPressable>

// After (1.0.0) — tint via tintColor, focus visuals via focusStyle/render props,
// native methods reachable straight off the ref
<KeyboardPressable
  tintColor="dodgerblue"
  focusStyle={{ backgroundColor: 'dodgerblue' }}
  onPress={onPress}
>…</KeyboardPressable>
```

### Changed component props

| Prop | 0.9.1 | 1.0.0 | Notes |
| :-- | :-- | :-- | :-- |
| `tintType` | `'default' \| 'hover' \| 'background' \| 'none'` | `'default' \| 'none'` | The `'hover'` and `'background'` values are gone — tinting color is controlled via `tintColor`. `'none'` is retained as a cross-platform shortcut to disable the native focus indicator (iOS halo + Android highlight); `'default'` keeps it. [Details](../guides/focus-styling.md#turning-off-all-native-indicators). |

```tsx
// Before (0.9.1) — 'background'/'hover' tinted the view
<KeyboardPressable tintType="background" onPress={onPress}>…</KeyboardPressable>

// After (1.0.0) — color via tintColor / focusStyle; tintType="none" only disables the indicator
<KeyboardPressable tintColor="dodgerblue" onPress={onPress}>…</KeyboardPressable>
<KeyboardPressable tintType="none" focusStyle={{ backgroundColor: 'dodgerblue' }} onPress={onPress}>…</KeyboardPressable>
```

### Renamed exported types

The HOC and view types were renamed for consistency. Update your type imports:

| 0.9.1 | 1.0.0 |
| :-- | :-- |
| `KeyboardExtendedViewType` | `BaseKeyboardViewType` |
| `WithKeyboardFocus` | `KeyboardFocusableComponent` |
| `WithKeyboardFocusDeclaration` | `KeyboardFocusableComponentDeclaration` |
| `WithKeyboardPropsTypeDeclaration` | Removed — use `WithKeyboardFocusProps` / `WithKeyboardFocusPropsWithRef`. |
| `TintType` | Removed as a named export — the `tintType` prop still exists but is typed inline as `'default' \| 'none'`, so import it from the prop types if you need it rather than the standalone `TintType`. |

```tsx
// Before (0.9.1)
import type { WithKeyboardFocus, KeyboardExtendedViewType } from 'react-native-external-keyboard';

// After (1.0.0)
import type { KeyboardFocusableComponent, BaseKeyboardViewType } from 'react-native-external-keyboard';
```

### New in 1.0.0

These are additive — no migration required. Adopt them only if you need the functionality.

| Addition | Description |
| :-- | :-- |
| `ref.current?.keyboardFocus()` | Imperative handle now exposes `keyboardFocus()` (physical-keyboard focus only) and `screenReaderFocus()` (VoiceOver / TalkBack focus only) alongside `focus()`, which now moves both. |
| `K` namespace | `K.View`, `K.Input`, `K.Pressable` shorthands for the keyboard-extended components. |
| `roundedHaloFix` prop | *(iOS, since deprecated)* Kept a disabled halo (`haloEffect={false}`) from reappearing on rounded (`borderRadius`) views. The underlying bug is fixed at the source in a later release, so the prop is now a no-op. [Details](../guides/focus-styling.md#roundedhalofix-deprecated-no-op). |
| `LockComponentType` | Now exported (enum used by `Focus.Frame` / `Focus.Trap`). |

> [!NOTE]
> `ref.current?.focus()` still works for existing calls — it continues to move physical-keyboard focus, and now also moves screen-reader focus. Use `keyboardFocus()` if you want the previous keyboard-only behavior.

---

## Migrating to 0.9.1 from 0.9.0

### `disabled` now suppresses keyboard-triggered presses

This is a **behavioral fix**, not an API change — there is nothing to rename. In 0.9.0, a focusable component that was `disabled` would still fire `onPress`, `onPressIn`, and `onPressOut` when activated from a hardware keyboard (Space / Enter or any `triggerCodes`). In 0.9.1, `disabled` is respected: keyboard activation no longer synthesizes those press events.

```tsx
const KeyboardPressable = withKeyboardFocus(Pressable);

// 0.9.0: pressing Space/Enter still called onPress while disabled.
// 0.9.1: onPress is suppressed while disabled — matching touch behavior.
<KeyboardPressable disabled onPress={onPress}>
  <Text>Submit</Text>
</KeyboardPressable>
```

Applies to `withKeyboardFocus`-wrapped components and `KeyboardExtendedView` (`KeyboardFocusView`), which read `disabled` from the wrapped component's props.

> [!NOTE]
> Only the synthesized press is gated. The raw key handlers and focus lifecycle still fire while `disabled`: `onKeyDownPress`, `onKeyUpPress`, `onFocus`, `onBlur`, and `onFocusChange`. If you relied on `onPress` firing on a disabled element via the keyboard, move that logic into `onKeyUpPress` / `onKeyDownPress` and check the state yourself.

---

## Migrating to 0.8.0 from 0.7.x

React and React Native were updated in `react-native-external-keyboard@0.8.0`.

### `Pressable` / `KeyboardExtendedPressable` type incompatibility

The newer React Native versions (0.83.x and 0.84.x) ship different types than previous versions. Because the bundled `Pressable` and `KeyboardExtendedPressable` carry static TypeScript declarations based on the `react-native@0.83.4` dependency, their props can be incompatible with your local RN types, surfacing as a TypeScript error at the call site.

Resolve it by going through the HOC, which provides dynamic typing:

```tsx
import { withKeyboardFocus } from 'react-native-external-keyboard';
import { Pressable, type PressableProps } from 'react-native';

const KeyboardPressable = withKeyboardFocus(Pressable);

export const K = (props: PressableProps) => {
  return <KeyboardPressable {...props} />;
};
```

---

## Migrating to 0.4.0 from 0.3.x

### Module functions replaced by `ref` actions

Functions on `A11yModule` / `KeyboardExtendedModule` were deprecated in favor of imperative `ref` actions, which fit the New Architecture better.

```tsx
// Before (0.3.x)
import { KeyboardExtendedModule } from 'react-native-external-keyboard';
KeyboardExtendedModule.setKeyboardFocus(ref); // or A11yModule.setKeyboardFocus(ref)
```

```tsx
// After (0.4.0)
import { useRef } from 'react';
import { type KeyboardFocus } from 'react-native-external-keyboard';

const ref = useRef<KeyboardFocus>(null);

const onPressForFocus = () => {
  ref.current?.focus();
};

<TouchableOpacity ref={ref}>
  <Text>TouchableOpacity</Text>
</TouchableOpacity>
```

The iOS-specific `setPreferredKeyboardFocus` was **not** carried over. Prefer the `autoFocus` prop, which focuses views on both Android and iOS. If you genuinely need the old method, open an issue.

### `Pressable` replaced by `withKeyboardFocus(Pressable)`

The previous `Pressable` cloned React Native's iOS `Pressable` source and wrapped the Android one, which made it hard to update and to control styles. It was replaced by `withKeyboardFocus(Pressable)` — the path that enabled the current feature set.

```tsx
import { withKeyboardFocus } from 'react-native-external-keyboard';
import { Pressable } from 'react-native';

const KeyboardPressable = withKeyboardFocus(Pressable);
```

### Component aliases

For compatibility with `0.2.x`, the old names are kept as aliases and will be maintained in future releases:

| Old name | Current name |
| :-- | :-- |
| `A11yModule` | `KeyboardExtendedModule` |
| `Pressable` | `KeyboardExtendedPressable` |
| `KeyboardFocusView` | `KeyboardExtendedView` |
| `ExternalKeyboardView` | `KeyboardExtendedBaseView` |

---

← [API reference](../api/overview.md) · [Docs home](../README.md)
