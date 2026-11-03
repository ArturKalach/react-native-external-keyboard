# Keyboard grouping — focus groups on iOS

With a physical keyboard on iOS, focusable views can be organized into **focus groups**. This
guide explains how grouping works, which behavior `react-native-external-keyboard` gives you by
default, and how to change it for the whole app, a part of it, or a single view.

> [!NOTE]
> Grouping and order are two separate things, set with separate props and components:
>
> | | Question it answers | View props | Scope component |
> | :-- | :-- | :-- | :-- |
> | **Focus groups** (this guide, iOS) | What is one Tab stop? | `groupIdentifier`, `uniqueGroupIdentifier` | `KeyboardGroupProvider`, `KeyboardFocusGroup` |
> | **Focus order** ([guide](./focus-order.md)) | In which order are views visited? | `orderGroup` + `orderIndex`, `orderId` + `order*` | `KeyboardOrderFocusGroup` |

- [How iOS keyboard navigation works](#how-ios-keyboard-navigation-works)
- [The setting: `uniqueGroupIdentifier`](#the-setting-uniquegroupidentifier)
- [Where to set it](#where-to-set-it)
- [Which option should I use?](#which-option-should-i-use)
- [Modals and portals](#modals-and-portals)

## How iOS keyboard navigation works

iOS has two levels of keyboard navigation:

- `Tab` and `Shift + Tab` move between **focus groups**.
- `Ctrl + Tab` and `Ctrl + Shift + Tab` move between the **elements** inside a group.

How views are split into groups therefore decides how the keyboard feels. If every view is its
own group, `Tab` stops at each element and the element-level shortcuts have nothing to move
through. If related views share a group, `Tab` jumps between regions and `Ctrl + Tab` moves
within one.

> [!IMPORTANT]
> **Breaking change in 0.14.0.** Until 0.13, every focusable view of this library became its own
> focus group. From 0.14 this is **off by default**, and iOS applies its own grouping. See the
> [migration notes](../migration/migration.md#migrating-to-0140-from-013x) for the reasoning.

## The setting: `uniqueGroupIdentifier`

The setting controls what happens to a view that has no `groupIdentifier`:

| Value | Result |
| :-- | :-- |
| `false` (**default**) | No group id is generated. The view is left to the system's own grouping. |
| `true` | The view gets its own generated, unique `focusGroupIdentifier`, so it is its own focus group (the 0.13 behavior). |

Two rules do not depend on the setting:

- A `groupIdentifier` always wins, whether the view sets it or inherits it from an enclosing
  `KeyboardGroupProvider` or `KeyboardFocusGroup`. The view joins that group, so
  `uniqueGroupIdentifier` has no effect inside a named group.
- The setting works on **iOS only**. Android has no `focusGroupIdentifier`, so the setting is
  accepted and ignored there.

`Focus.Guide` is a Tab stop too, so it follows the same setting and scopes as the views
around it (it has no grouping props of its own). With `uniqueGroupIdentifier` it is its own
stop, and inside a named group it joins that group.

Keyboard **order** follows the same split: `orderIndex` and `orderForward` / `orderBackward`
follow `Ctrl + Tab` by default and inside a named group, and plain `Tab` when the view is its own
group (`uniqueGroupIdentifier` without a `groupIdentifier`). See [Focus order](./focus-order.md).

## Where to set it

You can set the value at three levels. The most specific level wins:

```
view prop  >  KeyboardGroupProvider  >  Keyboard.configure  >  false
```

| Level | How | Reaches |
| :-- | :-- | :-- |
| Global | `Keyboard.configure({ ... })` | Every view, everywhere |
| Region (or the whole tree) | `<KeyboardGroupProvider>` | Everything inside |
| View | `uniqueGroupIdentifier` prop on `KeyboardExtendedView`, `Pressable`, `KeyboardExtendedInput`, `KeyboardExtendedBaseView` or a `withKeyboardFocus` component | That view |

### Global — `Keyboard.configure`

Call it once, before the first render, for example in `index.js`:

```ts
import { Keyboard } from 'react-native-external-keyboard';

Keyboard.configure({ uniqueGroupIdentifier: true });
```

This is a plain module setting, so it also reaches portals and extra React roots (see
[Modals and portals](#modals-and-portals)). It does not re-render views that are already
mounted, so set it at startup and do not change it later.

### Region — `KeyboardGroupProvider` and `KeyboardFocusGroup`

Both components configure a region:

| Prop | `KeyboardGroupProvider` | `KeyboardFocusGroup` | Meaning |
| :-- | :-- | :-- | :-- |
| `groupIdentifier` | Yes | Yes | Every focusable view inside that has no id of its own joins this group. |
| `uniqueGroupIdentifier` | Yes | No | Overrides the setting for everything inside. When unset, the value is inherited. |

`KeyboardFocusGroup` does not take `uniqueGroupIdentifier`: it is a group itself, and with its
`groupIdentifier` set the setting would have no effect. Its focus events also need a
`groupIdentifier`: they fire when the focused view's group id equals the group's, so a
`KeyboardFocusGroup` without one never reports focus.

They differ in what they render:

| | Renders a native view | Group focus events and styling |
| :-- | :-- | :-- |
| `KeyboardGroupProvider` | No (JS only, no layout) | No |
| `KeyboardFocusGroup` | Yes | Yes: `onFocusChange`, `onFocus` / `onBlur`, `tintColor`, `focusStyle` |

Use `KeyboardGroupProvider` when you only need grouping. Use `KeyboardFocusGroup` when you also
need to react to the group gaining or losing focus.

```tsx
import {
  KeyboardFocusGroup,
  KeyboardGroupProvider,
  Pressable,
} from 'react-native-external-keyboard';

// Grouping only: no extra native view
<KeyboardGroupProvider groupIdentifier="toolbar">
  <Pressable onPress={bold} />
  <Pressable onPress={italic} />
</KeyboardGroupProvider>

// Focus events or a tint are needed: use the native group
<KeyboardFocusGroup groupIdentifier="colors" onFocusChange={setColorsFocused}>
  {colors.map((c) => <Pressable key={c} onPress={() => pick(c)} />)}
</KeyboardFocusGroup>

// One region where every view is its own stop, even if the app default is off
<KeyboardGroupProvider uniqueGroupIdentifier>
  <List />
</KeyboardGroupProvider>
```

A `KeyboardGroupProvider` around the whole app sets the default for that React tree, and unlike
`Keyboard.configure` it can change at runtime:

```tsx
<KeyboardGroupProvider uniqueGroupIdentifier={legacyTabOrder}>
  <App />
</KeyboardGroupProvider>
```

### View

```tsx
<Pressable uniqueGroupIdentifier onPress={save} />      // this view is its own group
<Pressable groupIdentifier="dialog" onPress={cancel} /> // joins a named group
```

## Which option should I use?

| Situation | Use |
| :-- | :-- |
| New app that should follow iOS | Nothing. The default is correct. |
| Existing app that must behave exactly like 0.13 | `Keyboard.configure({ uniqueGroupIdentifier: true })` |
| Toolbar, grid or palette that should act as one unit | `KeyboardGroupProvider` or `KeyboardFocusGroup` with a `groupIdentifier` |
| One list where every row must be its own stop | A `KeyboardGroupProvider uniqueGroupIdentifier` around it |
| Content in a portal or a separate root | `Keyboard.configure`, because a provider will not reach it |

## Modals and portals

A provider applies to its React subtree. RN's own `Modal` renders its children inside that same
tree (`Libraries/Modal/Modal.js` in RN 0.76.5), so `KeyboardGroupProvider` and
`KeyboardFocusGroup` apply to modal content. The native iOS modal is a separate view
controller, but this does not matter, because the setting travels as a prop on each view.

A provider does **not** reach content that is mounted outside it:

- portal-based sheets, toasts or overlays whose host sits above or beside the provider;
- separate React roots, such as an extra `AppRegistry` surface or a native-embedded surface.

This is based on reading the code and has not been tested with those libraries. For such
content, set the value globally with `Keyboard.configure`, which does not depend on tree position.

## Related

- [Migration: 0.13 to 0.14](../migration/migration.md#migrating-to-0140-from-013x)
- [`KeyboardGroupProvider`](../components/overview.md#keyboardgroupprovider) and [`KeyboardFocusGroup`](../components/overview.md#keyboardfocusgroup)
- [Focus order](./focus-order.md)

---

← [Focus guide](./focus-guide.md) · [Component overview →](../components/overview.md)
