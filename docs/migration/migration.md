# Migration Guide

Migration notes are listed newest first. Each section only covers changes that need action — additive features are documented in the [component overview](../components/overview.md) and [API reference](../api/overview.md).

- [0.13.x → 0.14.0](#migrating-to-0140-from-013x)
- [0.9.1 → 1.0.0](#migrating-to-100-from-091)
- [0.9.0 → 0.9.1](#migrating-to-091-from-090)
- [0.7.x → 0.8.0](#migrating-to-080-from-07x)
- [0.3.x → 0.4.0](#migrating-to-040-from-03x)

---

## Migrating to 0.14.0 from 0.13.x

0.14.0 includes a **breaking change** to iOS keyboard navigation: focusable views no longer
generate a unique keyboard focus group for each component by default. It also extends the `K`
namespace to every component ([New `K` namespace entries](#new-k-namespace-entries)), with no
action needed.

### Why it changed

iOS has two levels of keyboard navigation. `Tab` and `Shift + Tab` move between focus groups,
while `Ctrl + Tab` and `Ctrl + Shift + Tab` move between the elements inside a group.

Until 0.13, every focusable view of this library was placed in its own generated group. As a
result, `Tab` stopped at every single element, and the element-level shortcuts had nothing to
move through. This is different from how the rest of iOS works, and an app that behaves
differently from the system can confuse keyboard users.

It could also limit system features that depend on the native grouping, such as automatic
scrolling to the next focused component.

0.14.0 follows the system behavior: views are no longer split into separate groups, so `Tab`
moves between groups and `Ctrl + Tab` moves between elements, as users expect.

### What changed

The old behavior is still available as the opt-in `uniqueGroupIdentifier` setting.

| | 0.13 | 0.14 |
| :-- | :-- | :-- |
| View without a `groupIdentifier` | Gets its own generated, unique `focusGroupIdentifier` | No id is generated; iOS applies its own grouping |
| `uniqueGroupIdentifier` | Did not exist | New setting, default `false` |
| Explicit `groupIdentifier` | Joins that group | Unchanged |
| `orderIndex`, `orderForward` / `orderBackward` | Followed by `Tab` | Followed by `Ctrl + Tab`; `Tab` moves to the next group. With `uniqueGroupIdentifier`, followed by `Tab` as in 0.13 |
| Android | n/a | Unchanged (the setting is ignored) |

`K.FocusGroup`'s `orderGroup` is now applied in JS: views inside it that have no
`orderGroup` of their own inherit it as their keyboard order group (natively the prop was
already a no-op).

### Who is affected

iOS apps that use a hardware keyboard or Full Keyboard Access and relied on every focusable view
being its own stop. Their Tab behavior can change.

Apps without keyboard support, and all Android apps, see no difference.

### How to migrate

Choose one of the two options.

#### Option 1: Keep the 0.13 behavior

Add one line at startup:

```ts
// index.js — before the first render
import { Keyboard } from 'react-native-external-keyboard';

Keyboard.configure({ uniqueGroupIdentifier: true });
```

#### Option 2: Adopt the new default

1. Do nothing in code.
2. Test your screens on a device with Full Keyboard Access turned on.
3. Fix the screens where Tab order is wrong:
   - To make a region act as **one unit**, give it a `groupIdentifier`
     (`K.GroupIdentifierProvider` or `K.FocusGroup`).
   - To keep **one stop per view** in a region, wrap it in a `K.GroupIdentifierProvider` with
     `uniqueGroupIdentifier`:

```tsx
<K.GroupIdentifierProvider uniqueGroupIdentifier>
  <List />
</K.GroupIdentifierProvider>
```

### APIs for the new grouping setting

| API | Purpose |
| :-- | :-- |
| `Keyboard.configure({ uniqueGroupIdentifier })` | App-wide default; also covers portals and extra roots |
| `K.GroupIdentifierProvider` | Region- or tree-scoped group id / setting without a native view |
| `uniqueGroupIdentifier` prop | On `K.Pressable`, `K.View`, `K.Input`, `K.BaseView`, and `withKeyboardFocus` components |

A view's own prop wins over the nearest provider, and a provider wins over `Keyboard.configure`.
A `groupIdentifier`, set on the view or inherited from an enclosing group, always wins over
`uniqueGroupIdentifier`.

> [!NOTE]
> The default is `false` in every layer (JS, codegen and native), so rendering the native
> components directly behaves like the new default too.

Full explanation and examples: [Focus groups](../guides/keyboard-grouping.md).

### New `K` namespace entries

Until 0.13, the `K` namespace held `K.Pressable`, `K.View`, and `K.Input`. From 0.14 it holds every
component, and the docs use the `K` names. Root exports and older aliases keep working, so no
change is needed.

Existing components with a new `K` name:

| `K` name | Same component as |
| :-- | :-- |
| `K.BaseView` | `BaseKeyboardView`, `ExternalKeyboardView`, `KeyboardExtendedBaseView` |
| `K.Order` | `KeyboardOrderFocusGroup` |
| `K.FocusGroup` | `KeyboardFocusGroup` |

New components, with a `K` name and a root export:

| `K` name | Root export | Purpose |
| :-- | :-- | :-- |
| `K.GroupIdentifierProvider` | `KeyboardGroupProvider` | iOS focus group scope without a native view |
| `K.Guide` | `KeyboardFocusGuide` | Focus redirection from an area to a chosen view |

```tsx
// 0.13
import { KeyboardOrderFocusGroup, KeyboardFocusGroup } from 'react-native-external-keyboard';

// 0.14, same components
import { K } from 'react-native-external-keyboard';
// K.Order, K.FocusGroup
```

The full list of `K` names, root exports, and aliases is in [Getting started → Aliases](../getting-started/getting-started.md#aliases).

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
| `tintType` | `'default' \| 'hover' \| 'background' \| 'none'` | `'default' \| 'none'` | The `'hover'` and `'background'` values are gone — tinting color is controlled via `tintColor`. `'none'` is retained as a cross-platform shortcut to disable the native focus indicator (iOS halo + Android highlight); `'default'` keeps it. [Details](../guides/focus-styling.md#turning-the-indicator-off). |

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
| `roundedHaloFix` prop | *(iOS, since deprecated)* Kept a disabled halo (`haloEffect={false}`) from reappearing on rounded (`borderRadius`) views. The underlying bug is fixed at the source in a later release, so the prop is now a no-op. [Details](../guides/focus-styling.md#props). |
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

For compatibility with `0.2.x`, the old names are kept as aliases. The current names and aliases are listed in [Getting started → Aliases](../getting-started/getting-started.md#aliases). <!-- TODO: confirm — `A11yModule` and `KeyboardExtendedModule` are not exported from src/index.tsx; the module is `Keyboard` -->

| Old name | Current name |
| :-- | :-- |
| `A11yModule` | `KeyboardExtendedModule` |
| `Pressable` | `KeyboardExtendedPressable` |
| `KeyboardFocusView` | `KeyboardExtendedView` |
| `ExternalKeyboardView` | `KeyboardExtendedBaseView` |

---

← [API reference](../api/overview.md) · [Docs home](../README.md)
