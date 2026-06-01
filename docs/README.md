# react-native-external-keyboard — Documentation

Native-first React Native toolkit for physical keyboard support — focus management, key-press events, focus ordering, and focus locking on iOS and Android, for both the New Architecture (Fabric / bridgeless) and the Legacy Bridge.

---

## Getting started

→ [Installation and quick start](./getting-started/getting-started.md)

The fastest path is the `K` namespace — `K.Pressable`, `K.View`, and `K.Input` are drop-in, keyboard-focusable versions of `Pressable`, `View`, and `TextInput`. Use [`withKeyboardFocus`](./components/overview.md#withkeyboardfocus) to add focus to your own components.

---

## Guides

Task-focused walkthroughs of common scenarios.

Read them in order, or jump to the one you need.

| # | Guide | Covers |
| :-- | :-- | :-- |
| 1 | [Pressable focus handling](./guides/pressable-focus.md) | Focus/blur events, `focusStyle`, `containerFocusStyle`, `renderContent`, `renderFocusable` |
| 2 | [Native focus styling](./guides/focus-styling.md) | iOS halo (`haloEffect`, `tintColor`, `halo*`, `roundedHaloFix`) and Android `defaultFocusHighlightEnabled` |
| 3 | [Programmatic focus](./guides/programmatic-focus.md) | `ref.focus()`, `keyboardFocus()`, `screenReaderFocus()`, `autoFocus` |
| 4 | [Keyboard text input](./guides/text-input.md) | `KeyboardExtendedInput`, `focusType`, `blurType`, multiline submit |
| 5 | [Focus order](./guides/focus-order.md) | Link-based, index-based, and direction-lock ordering |

---

## Components

Concise descriptions, when-to-use guidance, and full props tables for every component.

→ [Component overview](./components/overview.md)

| Component | Description |
| :-- | :-- |
| [`withKeyboardFocus(Component)`](./components/overview.md#withkeyboardfocus) | HOC that adds keyboard focus to any `Pressable`/`Touchable`-like component |
| [`KeyboardExtendedView`](./components/overview.md#keyboardextendedview) | Focus-aware `View` for key handling and grouping |
| [`KeyboardExtendedInput`](./components/overview.md#keyboardextendedinput) | `TextInput` with keyboard focus support |
| [`KeyboardExtendedBaseView`](./components/overview.md#keyboardextendedbaseview) | Low-level focusable view (alias `ExternalKeyboardView`) |
| [`KeyboardFocusGroup`](./components/overview.md#keyboardfocusgroup) | iOS `focusGroupIdentifier` grouping + global `tintColor` |
| [`Focus.Frame` / `Focus.Trap`](./components/overview.md#focusframe--focustrap) | Focus confinement for modals and overlays |
| [`KeyboardOrderFocusGroup`](./components/overview.md#keyboardorderfocusgroup) | Namespacing + index-based focus ordering |

---

## API reference

Non-component surface: modules, the HOC, hooks, the imperative ref, and shared types.

→ [API overview](./api/overview.md)

| Item | Description |
| :-- | :-- |
| [`Keyboard`](./api/overview.md#keyboard-module) | Soft-keyboard dismissal from a hardware keyboard |
| [`withKeyboardFocus`](./api/overview.md#withkeyboardfocus-hoc) | HOC factory contract and render props |
| [`KeyboardFocus` (ref)](./api/overview.md#imperative-ref-keyboardfocus) | Imperative focus handle (`focus`, `keyboardFocus`, `screenReaderFocus`) |
| [Hooks](./api/overview.md#hooks) | `useIsViewFocused`, `useOrderFocusGroup` |
| [Focus-order props](./api/overview.md#focus-order-props) | `orderId`, `order*`, `orderIndex`, `orderGroup`, `lockFocus` |
| [Types](./api/overview.md#types) | `KeyPress`, `OnKeyPress`, `FocusStyle`, `LockFocusType`, … |

---

## Migration

Version-to-version upgrade notes, newest first.

→ [Migration guide](./migration/migration.md)

| Upgrade | Highlights |
| :-- | :-- |
| [0.9.1 → 1.0.0](./migration/migration.md#migrating-to-100-from-091) | Prop & type renames (`group`→`focusableWrapper`, `canBeFocused`→`focusable`); new ref methods + `K` namespace |
| [0.9.0 → 0.9.1](./migration/migration.md#migrating-to-091-from-090) | `disabled` now suppresses keyboard-triggered presses |
| [0.7.x → 0.8.0](./migration/migration.md#migrating-to-080-from-07x) | RN 0.83/0.84 type compatibility via the HOC |
| [0.3.x → 0.4.0](./migration/migration.md#migrating-to-040-from-03x) | Module functions → `ref` actions; `Pressable` → `withKeyboardFocus` |
