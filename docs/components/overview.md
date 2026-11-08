# Component overview

Every keyboard-focusable component shares one set of [common focus props](#common-focus-props): focus events, key events, native focus indicators, focus order, and locked directions. The components differ in what they wrap and what they add on top. Each one is listed under its `K` name, and its root export and older aliases are in [Getting started → Aliases](../getting-started/getting-started.md#aliases).

| Component | Wraps | Use for |
| :-- | :-- | :-- |
| [`withKeyboardFocus(C)`](#withkeyboardfocus) | Any `Pressable`- or `Touchable`-like component | Keyboard focus on an existing touchable, such as `TouchableOpacity` or a third-party button |
| [`K.View`](#kview) | `View` | Key handling and focusable containers that are not buttons |
| [`K.Input`](#kinput) | `TextInput` | Text fields in keyboard navigation |
| [`K.BaseView`](#kbaseview) | Native focus view | A focusable view configured by props only |
| [`K.FocusGroup`](#kfocusgroup) | `View` | iOS focus group with focus events or a shared `tintColor` |
| [`K.GroupIdentifierProvider`](#kgroupidentifierprovider) | Context | iOS focus group scope without a native view |
| [`Focus.Frame` / `Focus.Trap`](#focusframe--focustrap) | `View` | Focus containment for modals, sheets, and overlays |
| [`K.Guide`](#kguide) | `View` | Focus redirection from an area to a chosen view |
| [`K.Order`](#korder) | Context | `orderId` namespace and index-based order |

---

## Common focus props

Props of `withKeyboardFocus` components (`K.Pressable` included), `K.View`, and `K.BaseView`:

| Prop | Platform | Type | Default | Description |
| :-- | :-- | :-- | :-- | :-- |
| `focusable` | Both | `boolean` | `true` | Keyboard focus on the component. |
| `autoFocus` | Both | `boolean` | — | Keyboard focus on mount. |
| `onFocus` | Both | `() => void` | — | Called when the component gains keyboard focus. |
| `onBlur` | Both | `() => void` | — | Called when the component loses keyboard focus. |
| `onFocusChange` | Both | [`OnFocusChangeFn`](../api/overview.md#onfocuschangefn) | — | Called on focus and blur. |
| `onKeyDownPress` | Both | `(e: OnKeyPress) => void` | — | Key-down handler. See [`KeyPress`](../api/overview.md#keypress). |
| `onKeyUpPress` | Both | `(e: OnKeyPress) => void` | — | Key-up handler. |
| `haloEffect`, `tintColor`, `haloCornerRadius`, `haloExpendX`, `haloExpendY`, `defaultFocusHighlightEnabled`, `tintType` | | | | Native focus indicator props. See [Native focus indicators](../guides/focus-styling.md#props). |
| `roundedHaloFix` | iOS | `boolean` | — | Deprecated, no effect. |
| `groupIdentifier`, `uniqueGroupIdentifier` | iOS | | | Focus group props. See [Focus groups](../guides/keyboard-grouping.md#props). |
| `orderId`, `order*`, `orderPrefix`, `orderGroup`, `orderIndex`, `lockFocus` | | | | Focus order props. See [Focus order](../guides/focus-order.md#props). |
| `screenAutoA11yFocus` | Both | `boolean` | — | Screen reader focus on this element on mount. <!-- TODO: confirm — exact trigger not verified in native code --> |
| `screenAutoA11yFocusDelay` | Android | `number` | `300` | Delay before `screenAutoA11yFocus`, in milliseconds. Rendering can take 300–500 ms. |
| `onContextMenuPress` | iOS | `() => void` | — | Called on the "Open context menu" command (default `Tab + M`). |
| `onBubbledContextMenuPress` | iOS | `() => void` | — | Called on the context menu command from descendants. |

---

## withKeyboardFocus

`withKeyboardFocus` wraps a `Pressable`- or `Touchable`-like component in a keyboard focus view. The result has focus and blur events, focus-aware styles, `autoFocus`, and the [`ref` focus methods](../api/overview.md#imperative-ref-keyboardfocus). `K.Pressable` is `withKeyboardFocus(Pressable)`, so the HOC is for other components, such as `TouchableOpacity` or a third-party button:

```tsx
import { withKeyboardFocus } from 'react-native-external-keyboard';
import { TouchableOpacity } from 'react-native';

const KeyboardTouchable = withKeyboardFocus(TouchableOpacity);
```

Styles, render props, and hooks are covered in [Focus styles and events](../guides/pressable-focus.md).

### Props

The [common focus props](#common-focus-props), the wrapped component's own props, and:

| Prop | Platform | Type | Default | Description |
| :-- | :-- | :-- | :-- | :-- |
| `onPress` | Both | `(e: GestureResponderEvent) => void` | — | Touch press or keyboard activation. |
| `onLongPress` | Both | `(e: GestureResponderEvent) => void` | — | Long press. On iOS, the context menu command (`Tab + M`). |
| `onPressIn` | Both | `(e: GestureResponderEvent) => void` | — | Touch or keyboard press-in. |
| `onPressOut` | Both | `(e: GestureResponderEvent) => void` | — | Touch or keyboard press-out. |
| `style` | Both | [`InteractiveStyleProp`](../api/overview.md#interactivestyleprop--containerstyle) | — | Style of the inner component. A static style, or a callback that receives `{ focused, pressed }`. |
| `containerStyle` | Both | [`ContainerStyle`](../api/overview.md#interactivestyleprop--containerstyle) | — | Style of the native container. A static style, or a callback that receives `{ focused, pressed }`. |
| `focusStyle` | Both | [`FocusStyle`](../api/overview.md#focusstyle) | — | Style of the inner component while focused. |
| `containerFocusStyle` | Both | [`FocusStyle`](../api/overview.md#focusstyle) | — | Style of the native container while focused. |
| `renderContent` | Both | `(state) => ReactNode` | — | Children from the wrapped component's render state and `focused`, for components with function `children`, such as `Pressable`. |
| `renderFocusable` | Both | `(state: { focused: boolean }) => ReactNode` | — | Children from `{ focused }`, for any component, such as `TouchableOpacity`. |
| `triggerCodes` | Both | `number[]` | `Space`, `Enter` | Key codes that fire `onPress` and `onLongPress`. |
| `androidKeyboardPressState` | Android | `boolean` | auto | Keyboard press (`Enter`, `Space`, D-pad center) reported as `pressed`, because it does not pass through the touch responder. On by default whenever a style or render prop reads `pressed`. |
| `withPressedStyle` | Both | `boolean` | auto | Deprecated. Press tracking turns on by itself when `style` is a function. `false` forces it off for a component that cannot take a function `style`. |
| `ref` | Both | `Ref<KeyboardFocus>` | — | [`ref` focus methods](../api/overview.md#imperative-ref-keyboardfocus). |
| `componentRef` | Both | `RefObject` | — | Instance of the wrapped component. |

---

## K.View

`K.View` is a focus-aware `View`. It fits key handling and focus containers rather than single buttons, which `K.Pressable` covers:

```tsx
<K.View onKeyDownPress={onKeyDownPress}>
  <Text>Parent</Text>
  <K.View>
    <Text>Child 1</Text>
  </K.View>
  <K.View>
    <Text>Child 2</Text>
  </K.View>
</K.View>
```

### Props

The [common focus props](#common-focus-props), the standard `View` props, and:

| Prop | Type | Description |
| :-- | :-- | :-- |
| `style` | `StyleProp<ViewStyle>` | Style of the inner view. |
| `focusStyle` | [`FocusStyle`](../api/overview.md#focusstyle) | Style of the inner view while focused. |
| `containerStyle` | `StyleProp<ViewStyle>` | Style of the native container. |
| `containerFocusStyle` | [`FocusStyle`](../api/overview.md#focusstyle) | Style of the native container while focused. |

---

## K.Input

`K.Input` is a `TextInput` with keyboard focus support. It joins `Tab` and arrow-key navigation and controls when editing starts and stops on keyboard focus:

```tsx
<K.Input focusType="auto" value={text} onChangeText={setText} />
```

Props and behavior are covered in [Text input](../guides/text-input.md#props).

---

## K.BaseView

`K.BaseView` is the lowest-level focusable view and the base of `K.View` and `K.Input`. It renders the same single native view as `K.View`, without the JS layer on top: no `focusStyle`, no `onPress` / `onLongPress` from `Space` / `Enter`, and no `useIsViewFocused` context. For this reason, it fits views configured by props only, such as `focusable={false}`, `lockFocus`, order props, or key events:

```tsx
<K.BaseView focusable={false} lockFocus={['down']}>
  <List />
</K.BaseView>
```

### Props

The [common focus props](#common-focus-props), the standard `View` props, and:

| Prop | Type | Description |
| :-- | :-- | :-- |
| `focusableWrapper` | `boolean` | Transparent focus wrapper instead of a focus target. |
| `enableContextMenu` | `boolean` | Context menu interaction on the view. |
| `ref` | `Ref<KeyboardFocus>` | [`ref` focus methods](../api/overview.md#imperative-ref-keyboardfocus). |

---

## K.FocusGroup

`K.FocusGroup` is a native `View` that defines an iOS focus group (`focusGroupIdentifier`) and reports when focus enters or leaves it. It also sets a `tintColor` for the focused views inside:

```tsx
<K.FocusGroup
  groupIdentifier="green"
  tintColor="green"
  focusStyle={styles.focusedGroup}
  onFocusChange={onFocusChange}
>
  <K.Pressable onPress={onPress}>
    <Text>Confirm</Text>
  </K.Pressable>
</K.FocusGroup>
```

Grouping and group focus events are covered in [Focus groups](../guides/keyboard-grouping.md#group-focus-events).

### Props

| Prop | Platform | Type | Description |
| :-- | :-- | :-- | :-- |
| `groupIdentifier` | iOS | `string` | `focusGroupIdentifier` of the group, shared with views inside that have none of their own. The group focus events need it. |
| `orderGroup` | Both | `string` | Index group and `orderId` namespace for the views inside, like `K.Order` `groupId`. |
| `tintColor` | iOS | `ColorValue` | Halo color of focused views inside. |
| `focusStyle` | Both | [`FocusStyle`](../api/overview.md#focusstyle) | Style of the group while focused. |
| `onFocus` | Both | `() => void` | Called when the group gains focus. |
| `onBlur` | Both | `() => void` | Called when the group loses focus. |
| `onFocusChange` | Both | `(isFocused: boolean) => void` | Called on focus and blur. |
| `...ViewProps` | Both | | Standard `View` props. |

---

## K.GroupIdentifierProvider

`K.GroupIdentifierProvider` is an iOS focus group scope in JS only, with no native view and no layout. It sets the focus group of the views inside, and with it what one `Tab` stop is. Group focus events and a `tintColor` come from `K.FocusGroup` instead:

```tsx
<K.GroupIdentifierProvider groupIdentifier="toolbar">
  <K.Pressable onPress={onPress}>
    <Text>Bold</Text>
  </K.Pressable>
  <K.Pressable onPress={onPress}>
    <Text>Italic</Text>
  </K.Pressable>
</K.GroupIdentifierProvider>
```

Props and setting levels are covered in [Focus groups](../guides/keyboard-grouping.md#props).

---

## Focus.Frame / Focus.Trap

`Focus.Frame` and `Focus.Trap` keep focus inside a region, such as a modal, a bottom sheet, or an overlay. `Focus.Frame` sits at the root of a screen and is the scope of the trap. `Focus.Trap` wraps the content that holds focus and must be inside a `Focus.Frame`:

```tsx
import { Focus } from 'react-native-external-keyboard';

<Focus.Frame>
  {/* … screen content … */}
  <Focus.Trap forceLock>
    <Text accessibilityRole="header">Locked area</Text>
    <K.Pressable onPress={onPress}>
      <Text>Confirm</Text>
    </K.Pressable>
  </Focus.Trap>
</Focus.Frame>
```

Platform behavior, the strict iOS lock, and props are covered in [Focus lock](../guides/focus-lock.md#props).

---

## K.Guide

`K.Guide` is an area that passes focus on: focus that moves into it goes to the view whose `orderId` is set in `to`. It is the React Native counterpart of iOS `UIFocusGuide` and also works on Android:

```tsx
<K.Order groupId="checkout">
  <K.Pressable orderId="pay" onPress={onPress}>
    <Text>Pay</Text>
  </K.Pressable>
  {/* Down from the views above this area lands on "Pay" */}
  <K.Guide to="pay" style={styles.guide} />
</K.Order>
```

A guide needs a non-zero size. Behavior, limitations, and props are covered in [Focus guide](../guides/focus-guide.md#props).

---

## K.Order

`K.Order` is a context provider for focus order. It gives every `orderId` inside a namespace, so repeated content has no duplicate ids, and it sets the group of index-based order:

```tsx
<K.Order>
  <K.Pressable orderIndex={0} onPress={onPress}>
    <Text>First</Text>
  </K.Pressable>
  <K.Pressable orderIndex={2} onPress={onPress}>
    <Text>Third</Text>
  </K.Pressable>
  <K.Pressable orderIndex={1} onPress={onPress}>
    <Text>Second</Text>
  </K.Pressable>
</K.Order>
```

Props and the ordering systems are covered in [Focus order](../guides/focus-order.md#props).

---

← [Native focus services](../guides/native-focus-services.md) · [API reference →](../api/overview.md)
