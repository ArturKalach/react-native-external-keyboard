# Focus groups

On iOS, a physical keyboard moves between focus groups with `Tab` and between the elements of one group with `Ctrl + Tab`. This guide covers how views join groups: the `groupIdentifier` and `uniqueGroupIdentifier` props, `K.GroupIdentifierProvider`, `K.FocusGroup`, and `Keyboard.configure`. Android has no `focusGroupIdentifier`, so these settings have no effect there.

## How it works

### Tab stops on iOS

iOS keyboard navigation has two levels. `Tab` / `Shift + Tab` moves between focus groups, and `Ctrl + Tab` / `Ctrl + Shift + Tab` moves between the elements inside a group. For this reason, the split into groups decides what one `Tab` stop is. Related views that share a `groupIdentifier` form one stop:

```tsx
<K.GroupIdentifierProvider groupIdentifier="toolbar">
  {/* One Tab stop. Ctrl + Tab moves between Bold and Italic. */}
  <K.Pressable onPress={onPress}>
    <Text>Bold</Text>
  </K.Pressable>
  <K.Pressable onPress={onPress}>
    <Text>Italic</Text>
  </K.Pressable>
</K.GroupIdentifierProvider>
```

Focus groups are separate from [focus order](./focus-order.md). Groups decide what one `Tab` stop is, and order decides the sequence in which views are visited.

### Views without a group

A view without a `groupIdentifier` follows the `uniqueGroupIdentifier` setting:

| Value | Result |
| :-- | :-- |
| `false` (default) | No group id. The view follows the system's own grouping. |
| `true` | A generated, unique `focusGroupIdentifier`, so the view is its own `Tab` stop. |

```tsx
<K.Pressable uniqueGroupIdentifier onPress={onPress}>
  <Text>Own Tab stop</Text>
</K.Pressable>
```

A `groupIdentifier` always takes precedence, whether set on the view or inherited from an enclosing `K.GroupIdentifierProvider` or `K.FocusGroup`. For this reason, `uniqueGroupIdentifier` has no effect inside a named group.

Until 0.13, every focusable view of this library was its own focus group. Since 0.14 the default is `false`, so iOS applies its own grouping ([migration notes](../migration/migration.md#migrating-to-0140-from-013x)).

The setting also decides which key follows [focus order](./focus-order.md#order-keys-on-ios). `K.Guide` is a `Tab` stop too and follows the same setting and scopes as the views around it.

### Setting levels

The setting has three levels, and the most specific one wins:

```
view prop  >  K.GroupIdentifierProvider  >  Keyboard.configure  >  false
```

| Level | API | Reach |
| :-- | :-- | :-- |
| App | `Keyboard.configure` | Every view, portals and separate React roots included |
| Region | `K.GroupIdentifierProvider`, `K.FocusGroup` | The React subtree inside |
| View | `groupIdentifier`, `uniqueGroupIdentifier` props | The view itself |

### App-wide default

`Keyboard.configure` is a plain module setting rather than a React context. For this reason, it reaches content outside any provider, but it does not re-render mounted views and belongs at startup, before the first render:

```ts
// index.js
import { Keyboard } from 'react-native-external-keyboard';

Keyboard.configure({ uniqueGroupIdentifier: true });
```

### Region scope

`K.GroupIdentifierProvider` sets `groupIdentifier` or `uniqueGroupIdentifier` for the views inside it. It renders no native view and affects no layout. An unset prop inherits the parent scope:

```tsx
<K.GroupIdentifierProvider uniqueGroupIdentifier>
  {/* Every row is its own Tab stop, whatever the app default */}
  <List />
</K.GroupIdentifierProvider>
```

Unlike `Keyboard.configure`, a provider can change at runtime. A provider around the whole app therefore sets a switchable default for that React tree:

```tsx
<K.GroupIdentifierProvider uniqueGroupIdentifier={separateTabStops}>
  <App />
</K.GroupIdentifierProvider>
```

### Group focus events

`K.FocusGroup` is a native view that defines a group and reports when focus enters or leaves it. Its `groupIdentifier` is shared with the views inside, like a provider's, and its focus events need that `groupIdentifier`, because they fire when the focused view's group id equals the group's:

```tsx
<K.FocusGroup groupIdentifier="colors" tintColor="green" onFocusChange={onFocusChange}>
  {colors.map((color) => (
    <K.Pressable key={color} onPress={onPress}>
      <Text>{color}</Text>
    </K.Pressable>
  ))}
</K.FocusGroup>
```

| Component | Native view | Group focus events and styling |
| :-- | :-- | :-- |
| `K.GroupIdentifierProvider` | No | No |
| `K.FocusGroup` | Yes | `onFocus`, `onBlur`, `onFocusChange`, `tintColor`, `focusStyle` |

`K.FocusGroup` has no `uniqueGroupIdentifier` prop. It is a named group itself, so the setting would have no effect inside it.

### Modals and portals

A provider applies to its React subtree. React Native's own `Modal` renders its children inside that same tree (`Libraries/Modal/Modal.js` in RN 0.76.5), so a provider around a `Modal` applies to its content. The native iOS modal is a separate view controller, which does not matter, because the setting travels as a prop on each view.

A provider does not reach content mounted outside it, such as portal-based sheets, toasts, or overlays whose host sits above or beside the provider, or separate React roots. `Keyboard.configure` does not depend on tree position, so it covers that content. <!-- TODO: confirm — based on reading the code, not tested with portal libraries -->

---

## Quick decision guide

| Need | API |
| :-- | :-- |
| Native iOS grouping | Nothing, it is the default |
| One `Tab` stop for a toolbar, grid, or palette | `K.GroupIdentifierProvider` with `groupIdentifier` |
| One `Tab` stop with group focus events or a tint | `K.FocusGroup` with `groupIdentifier` |
| Own `Tab` stop for every view in one region | `K.GroupIdentifierProvider uniqueGroupIdentifier` |
| Own `Tab` stop for every view in the app, as in 0.13 | `Keyboard.configure({ uniqueGroupIdentifier: true })` |
| Content in a portal or a separate React root | `Keyboard.configure`, a provider does not reach it |

---

## Props

All grouping props are iOS only.

View props of `K.Pressable`, `K.View`, `K.Input`, `K.BaseView`, and `withKeyboardFocus` components:

| Prop | Type | Default | Description |
| :-- | :-- | :-- | :-- |
| `groupIdentifier` | `string` | inherited | `focusGroupIdentifier` of the view. When unset, inherited from an enclosing `K.GroupIdentifierProvider` or `K.FocusGroup`. |
| `uniqueGroupIdentifier` | `boolean` | inherited, then `false` | Own generated focus group for a view without a `groupIdentifier`. When unset, inherited from `K.GroupIdentifierProvider`, then `Keyboard.configure`. |

`K.GroupIdentifierProvider` props:

| Prop | Type | Default | Description |
| :-- | :-- | :-- | :-- |
| `groupIdentifier` | `string` | parent scope | `focusGroupIdentifier` for every view inside without its own. |
| `uniqueGroupIdentifier` | `boolean` | parent scope | `uniqueGroupIdentifier` for every view inside without its own. |
| `children` | `ReactNode` | — | Content. |

`Keyboard.configure` options (type `ExternalKeyboardConfig`):

| Option | Type | Default | Description |
| :-- | :-- | :-- | :-- |
| `uniqueGroupIdentifier` | `boolean` | `false` | App-wide default of `uniqueGroupIdentifier`. |

`K.FocusGroup` props are listed in the [component overview](../components/overview.md#kfocusgroup).

---

## Related

- [Focus order](./focus-order.md): order of views inside and across groups
- [Component overview → K.GroupIdentifierProvider](../components/overview.md#kgroupidentifierprovider) and [K.FocusGroup](../components/overview.md#kfocusgroup)
- [Migration: 0.13 to 0.14](../migration/migration.md#migrating-to-0140-from-013x): reasons for the new default

---

← [Focus lock](./focus-lock.md) · [Native focus services →](./native-focus-services.md)
