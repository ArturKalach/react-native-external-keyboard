# Component overview

Every focusable component shares the same set of **common focus props** (focus events, halo styling, focus ordering, locking). The components differ in what they wrap and the defaults they bring.

| Component | Wraps | Use it when |
| :-- | :-- | :-- |
| [`withKeyboardFocus(C)`](#withkeyboardfocus) | any `Pressable`/`Touchable` | You already have a touchable and want to add keyboard focus to it |
| [`KeyboardExtendedView`](#keyboardextendedview) | `View` | You need key handling or a focus container, not a button |
| [`KeyboardExtendedInput`](#keyboardextendedinput) | `TextInput` | A text field needs keyboard-driven focus behavior |
| [`KeyboardExtendedBaseView`](#keyboardextendedbaseview) | native focus view | You want the lowest-level focusable primitive |
| [`KeyboardFocusGroup`](#keyboardfocusgroup) | `View` | iOS focus grouping or a shared `tintColor` |
| [`Focus.Frame` / `Focus.Trap`](#focusframe--focustrap) | `View` | Confine focus inside a modal/overlay |
| [`KeyboardOrderFocusGroup`](#keyboardorderfocusgroup) | context | Namespace `orderId`s or order by index |

---

## Common focus props

Shared by `withKeyboardFocus`-wrapped components, `KeyboardExtendedView`, and `KeyboardExtendedBaseView`.

| Prop | Type | Default | Description |
| :-- | :-- | :-- | :-- |
| `focusable` | `boolean` | `true` | Whether the component can receive keyboard focus. |
| `autoFocus` | `boolean` | — | Automatically take keyboard focus on mount. |
| `onFocus` | `() => void` | — | Called when the component gains focus. |
| `onBlur` | `() => void` | — | Called when the component loses focus. |
| `onFocusChange` | `(isFocused: boolean, tag?: number) => void` | — | Called on focus or blur. |
| `onKeyDownPress` | `(e: OnKeyPress) => void` | — | Physical key-down handler. See [`KeyPress`](../api/overview.md#keypress). |
| `onKeyUpPress` | `(e: OnKeyPress) => void` | — | Physical key-up handler. |
| `tintColor` | `string` | — | Color used to tint the component on focus. |
| `haloEffect` | `boolean` | — | *(iOS)* Draw the focus halo ring on focus. |
| `haloCornerRadius` | `number` | — | *(iOS)* Corner radius of the halo ring, in points. |
| `haloExpendX` | `number` | — | *(iOS)* Horizontal expansion of the halo beyond the view bounds. |
| `haloExpendY` | `number` | — | *(iOS)* Vertical expansion of the halo beyond the view bounds. |
| `roundedHaloFix` | `boolean` | — | *(iOS)* When `haloEffect={false}`, keeps the disabled halo from reappearing on rounded (`borderRadius`) views. [Why & alternative](../guides/focus-styling.md#roundedhalofix). |
| `defaultFocusHighlightEnabled` | `boolean` | `true` | *(Android)* Enables Android's default focus highlight. |
| `screenAutoA11yFocus` | `boolean` | — | Move screen-reader focus to this element automatically. |
| `screenAutoA11yFocusDelay` | `number` | `300` | *(Android)* Delay (ms) before screen-reader auto-focus; render may take 300–500 ms. |
| `onContextMenuPress` | `() => void` | — | *(iOS)* Long-press via the context-menu command (`Tab + M`). |
| `onBubbledContextMenuPress` | `() => void` | — | *(iOS)* Bubbling variant of `onContextMenuPress` from descendants. |
| [Focus-order props](../api/overview.md#focus-order-props) | — | — | `orderId`, `order*`, `orderIndex`, `orderGroup`, `orderPrefix`. |
| `lockFocus` | [`LockFocusType[]`](../api/overview.md#lockfocustype) | — | Directions in which focus movement is locked. |

---

## withKeyboardFocus

HOC that wraps any `Pressable`/`Touchable`-like component in a `KeyboardFocusView`, adding focus/blur events, focus styling, `autoFocus`, and an imperative focus `ref`. Reach for it when you need focus on a component the [`K` namespace](../getting-started/getting-started.md#quick-start) doesn't cover — `TouchableOpacity`, a custom button, a third-party component.

```tsx
import { withKeyboardFocus } from 'react-native-external-keyboard';

const KeyboardPressable = withKeyboardFocus(Pressable);
const KeyboardTouchable = withKeyboardFocus(TouchableOpacity);
```

> [!TIP]
> For a plain `Pressable` you don't need the HOC — `K.Pressable` (exported as `Pressable` / `KeyboardExtendedPressable`) is already wrapped and ready to use.

### Props

In addition to the [common focus props](#common-focus-props) and the wrapped component's own props:

| Prop | Type | Default | Description |
| :-- | :-- | :-- | :-- |
| `onPress` | `(e: GestureResponderEvent) => void` | — | Press / keyboard-activated press. |
| `onLongPress` | `(e: GestureResponderEvent) => void` | — | Long press (`Tab + M` on iOS). |
| `onPressIn` | `(e: GestureResponderEvent) => void` | — | Press-in / keyboard press-in. |
| `onPressOut` | `(e: GestureResponderEvent) => void` | — | Press-out / keyboard press-out. |
| `style` | `StyleProp<ViewStyle>` | — | Styles the inner component. |
| `focusStyle` | [`FocusStyle`](../api/overview.md#focusstyle) | — | Style applied to the inner component when focused. |
| `containerStyle` | `StyleProp<ViewStyle>` | — | Style for the container. |
| `containerFocusStyle` | [`FocusStyle`](../api/overview.md#focusstyle) | — | Style applied to the container when focused. |
| `withPressedStyle` | `boolean` | `false` | Enable the pressed-style handler for custom components (always on for `Pressable`). |
| `renderContent` | `(state: ComponentRenderState & { focused: boolean }) => ReactNode` | — | For components whose `children` is a render function (e.g. `Pressable`); merges the component's own render state with `{ focused }`. |
| `renderFocusable` | `(state: { focused: boolean }) => ReactNode` | — | Replaces `children` with a render prop receiving `{ focused }`. Use for components without a render-prop `children` (e.g. `TouchableOpacity`). |
| `triggerCodes` | `number[]` | space + enter | Key codes that trigger `onPress` / `onLongPress`. |
| `ref` | `Ref<KeyboardFocus>` | — | Imperative [focus handle](../api/overview.md#imperative-ref-keyboardfocus). |
| `componentRef` | `RefObject<ViewType>` | — | Ref to the wrapped component instance. |
| `...rest` | wrapped component props | — | Forwarded to the wrapped component. |

### renderContent — `Pressable` with `pressed` + `focused`

```tsx
const KeyboardPressable = withKeyboardFocus(Pressable);

<KeyboardPressable
  onPress={onPress}
  renderContent={({ pressed, focused }) => (
    <View style={[styles.button, pressed && styles.pressed, focused && styles.focused]}>
      <Text>{pressed ? 'Pressed' : focused ? 'Focused' : 'Default'}</Text>
    </View>
  )}
/>
```

### renderFocusable — `TouchableOpacity` and others

`TouchableOpacity` does not expose a render-prop `children`, so use `renderFocusable`, which receives only `{ focused }`:

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

---

## KeyboardExtendedView

A focus-aware `View` (also exported as `KeyboardFocusView` / `K.View`). Use it to handle key presses or to manage focus for a group of components rather than to build a single button.

```tsx
<KeyboardExtendedView onKeyDownPress={onKey}>
  <Text>Parent</Text>
  <KeyboardExtendedView>
    <Text>Child 1</Text>
  </KeyboardExtendedView>
  <KeyboardExtendedView>
    <Text>Child 2</Text>
  </KeyboardExtendedView>
</KeyboardExtendedView>
```

### Props

All [common focus props](#common-focus-props), all standard `ViewProps`, plus:

| Prop | Type | Description |
| :-- | :-- | :-- |
| `style` | `StyleProp<ViewStyle>` | Style for the inner component. |
| `focusStyle` | [`FocusStyle`](../api/overview.md#focusstyle) | Style applied to the inner component when focused. |
| `containerStyle` | `StyleProp<ViewStyle>` | Style for the container. |
| `containerFocusStyle` | [`FocusStyle`](../api/overview.md#focusstyle) | Style applied to the container when focused. |

---

## KeyboardExtendedInput

A `TextInput` with keyboard focus support (also exported as `TextInput` / `K.Input`). Lets the input be focused with a hardware keyboard and customizes focus/blur behavior across platforms.

```tsx
import { KeyboardExtendedInput } from 'react-native-external-keyboard';

<KeyboardExtendedInput
  focusType="default"
  blurType="default"
  value={text}
  onChangeText={setText}
/>
```

### Props

All standard `TextInputProps`, plus:

| Prop | Type | Default | Description |
| :-- | :-- | :-- | :-- |
| `focusable` | `boolean` | `true` | Whether the input can be keyboard-focused. |
| `focusType` | `'default' \| 'press' \| 'auto'` | `'default'` | How the input takes keyboard focus. `default` follows the platform (Android focuses directly; iOS requires a press); `press` requires pressing Space to focus; `auto` focuses automatically when keyboard focus targets it. |
| `blurType` | `'default' \| 'disable' \| 'auto'` | `'default'` | *(iOS)* Blur behavior when focus moves away. `default` keeps typing enabled; `disable` blurs the input when focus leaves. |
| `onFocusChange` | `(isFocused: boolean) => void` | — | Called on focus or blur. |
| `onSubmitEditing` | `(e: NativeSyntheticEvent<TextInputSubmitEditingEventData>) => void` | — | Extended `onSubmitEditing` supporting multiline input. |
| `haloEffect` | `boolean` | — | *(iOS)* Halo ring on focus. |
| `defaultFocusHighlightEnabled` | `boolean` | `true` | *(Android)* Default focus highlight. |
| `tintColor` | `string` | — | Tint color on focus. |
| `style` | `StyleProp<ViewStyle>` | — | Style for the inner `TextInput`. |
| `focusStyle` | [`FocusStyle`](../api/overview.md#focusstyle) | — | Style applied when focused. |
| `containerStyle` | `StyleProp<ViewStyle>` | — | Style for the container. |
| `containerFocusStyle` | [`FocusStyle`](../api/overview.md#focusstyle) | — | Container style when focused. |

---

## KeyboardExtendedBaseView

The lowest-level focusable view (canonical `BaseKeyboardView`; aliases `ExternalKeyboardView`, `KeyboardExtendedBaseView`). Most apps should use `withKeyboardFocus` or `KeyboardExtendedView` instead — reach for this when you need a bare focusable primitive.

```tsx
<KeyboardExtendedBaseView focusable onKeyDownPress={onDown} onKeyUpPress={onUp}>
  <Text>Content</Text>
</KeyboardExtendedBaseView>
```

### Props

All standard `ViewProps` and the [common focus props](#common-focus-props), plus:

| Prop | Type | Description |
| :-- | :-- | :-- |
| `focusableWrapper` | `boolean` | Treat the view as a transparent focus wrapper rather than a focusable target itself. |
| `enableContextMenu` | `boolean` | Enable the context-menu interaction on the view. |
| `ref → focus()` | `() => void` | Programmatically focus the view. See the [imperative ref](../api/overview.md#imperative-ref-keyboardfocus). |

---

## KeyboardFocusGroup

A `View`-based component built on the iOS focus API. Use it to define an iOS focus group (`focusGroupIdentifier`) or to set a `tintColor` for everything inside.

```tsx
<KeyboardFocusGroup
  groupIdentifier="green"
  tintColor="green"
  focusStyle={{ backgroundColor: 'green' }}
  onFocusChange={(isFocused) => console.log('green', isFocused)}
>
  <Button title="Confirm" />
</KeyboardFocusGroup>
```

### Props

| Prop | Type | Description |
| :-- | :-- | :-- |
| `groupIdentifier` | `string` | *(iOS)* The `focusGroupIdentifier` this view belongs to. |
| `tintColor` | `string` | Tint color applied to focused descendants. |
| `focusStyle` | [`FocusStyle`](../api/overview.md#focusstyle) | Style applied to the inner component when focused. |
| `onFocus` | `() => void` | Called when the group gains focus. |
| `onBlur` | `() => void` | Called when the group loses focus. |
| `onFocusChange` | `(isFocused: boolean) => void` | Called on focus or blur. |
| `...ViewProps` | — | All standard `View` properties. |

---

## Focus.Frame / Focus.Trap

A pair of components that lock focus inside a region — useful for modals, bottom sheets, and overlays.

- **`Focus.Frame`** — placed at the root of a "screen" to detect focus leaks and keep focus contained.
- **`Focus.Trap`** — wraps the content area where focus should be explicitly locked.

On iOS, `Focus.Trap` uses the native `accessibilityViewIsModal`. Pass `forceLock` for stronger containment (e.g. to keep focus away from navigation bars/headers) — focus is corrected reactively, so VoiceOver may briefly jump outside the trap before being returned. On Android, where no `accessibilityViewIsModal` equivalent exists, a custom implementation provides the lock.

```tsx
import { Focus } from 'react-native-external-keyboard';

<Focus.Frame>
  {/* ...screen content... */}
  <Focus.Trap forceLock>
    <Text accessibilityRole="header">Locked Area</Text>
    <Button title="Confirm" accessibilityLabel="Confirm action" />
  </Focus.Trap>
</Focus.Frame>
```

### Props (both components)

| Prop | Type | Description |
| :-- | :-- | :-- |
| `forceLock` | `boolean` | *(iOS, `Focus.Trap`)* Strengthen containment beyond `accessibilityViewIsModal` by returning focus into the trap when it escapes. |
| `lockDisabled` | `boolean` | *(Android)* Disable the focus lock when `true`. |
| `...ViewProps` | — | All standard `View` properties (`style`, `testID`, …). |

---

## KeyboardOrderFocusGroup

A context provider with two jobs:

1. **Namespacing** — automatically prefixes every `orderId` inside it so duplicate IDs in repeated content (lists, cards) don't collide.
2. **Index-based ordering** — children that declare `orderIndex` are focused in ascending index order within the group.

```tsx
import { KeyboardOrderFocusGroup } from 'react-native-external-keyboard';

<KeyboardOrderFocusGroup>
  <Pressable onPress={onPress} orderIndex={0}><Text>First</Text></Pressable>
  <Pressable onPress={onPress} orderIndex={2}><Text>Third</Text></Pressable>
  <Pressable onPress={onPress} orderIndex={1}><Text>Second</Text></Pressable>
</KeyboardOrderFocusGroup>
```

### Props

| Prop | Type | Description |
| :-- | :-- | :-- |
| `groupId` | `string` | Optional explicit group name. Auto-generated when omitted. |
| `children` | `ReactNode` | Child components. |

See [focus-order props](../api/overview.md#focus-order-props) for the full set of `order*` and `lockFocus` props that drive ordering.

---

← [Focus order](../guides/focus-order.md) · [API reference →](../api/overview.md)
