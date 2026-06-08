# Migration Guide

Migration notes are listed newest first. Each section only covers changes that need action — additive features are documented in the [component overview](../components/overview.md) and [API reference](../api/overview.md).

- [0.9.1 → 1.0.0](#migrating-to-100-from-091)
- [0.9.0 → 0.9.1](#migrating-to-091-from-090)
- [0.7.x → 0.8.0](#migrating-to-080-from-07x)
- [0.3.x → 0.4.0](#migrating-to-040-from-03x)

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
| `roundedHaloFix` prop | *(iOS)* Keeps a disabled halo (`haloEffect={false}`) from reappearing on rounded (`borderRadius`) views. [Details](../guides/focus-styling.md#roundedhalofix). |
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
