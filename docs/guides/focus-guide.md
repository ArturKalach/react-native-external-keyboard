# Focus guide

`K.Guide` is a view that redirects focus to another component: focus that enters the guide moves on to the view whose `orderId` is set in `to`. It is an alternative way to manage focus order, where one guide covers every move into an area instead of [link props](./focus-order.md#links-between-views) on each view.

<!-- GIF table -->

It is the React Native counterpart of iOS `UIFocusGuide`, also available on Android, which has no native equivalent.

## How it works

### Guide and target

Menus, lists, and dynamically rendered content make focus order hard to set view by view: each view needs the `orderId` of its neighbor, and the ids change with the data. A guide is one view that manages focus for a whole area instead. Every move that enters the guide goes to its target, and the target can change with the app state.

Here, a guide between a menu and a list sends `Right` from any menu item to the selected message, not to the message that happens to sit next to the item:

```tsx
const [selectedId, setSelectedId] = useState(messages[0]?.id);

<K.Order groupId="inbox">
  <View style={styles.row}>
    <View>
      <K.Pressable onPress={onPress}>
        <Text>Inbox</Text>
      </K.Pressable>
      <K.Pressable onPress={onPress}>
        <Text>Archive</Text>
      </K.Pressable>
    </View>

    {/* Right from any menu item lands on the selected message */}
    <K.Guide to={selectedId} style={styles.guide} />

    <View>
      {messages.map((message) => (
        <K.Pressable
          key={message.id}
          orderId={message.id}
          onPress={() => setSelectedId(message.id)}
        >
          <Text>{message.subject}</Text>
        </K.Pressable>
      ))}
    </View>
  </View>
</K.Order>
```

### Target lookup

`to` is the `orderId` of any keyboard-focusable view of this library: `K.Pressable`, `K.View`, `K.Input`, `K.BaseView`, or a `withKeyboardFocus` component. The guide looks it up in its own [namespace](./focus-order.md#unique-ids), the surrounding `K.Order`. A target in another namespace, such as a list component with its own `K.Order`, needs `orderGroup`, set to the target's `K.Order` `groupId` or its `orderPrefix`:

```tsx
<K.Order groupId="menu">
  <K.Pressable onPress={onPress}>
    <Text>Inbox</Text>
  </K.Pressable>
  {/* The target is in the "messages" order, not in "menu" */}
  <K.Guide to={selectedId} orderGroup="messages" style={styles.guide} />
</K.Order>

<K.Order groupId="messages">
  {messages.map((message) => (
    <K.Pressable key={message.id} orderId={message.id} onPress={onPress}>
      <Text>{message.subject}</Text>
    </K.Pressable>
  ))}
</K.Order>
```

A `K.Order` without `groupId` has a generated id, so a guide outside it cannot reach in. A target's own `orderGroup` prop sets its index group only and does not change its namespace.

The guide subscribes to the target's `orderId` on the native side. For this reason, a target that mounts after the guide, a remounted target, or a new `to` value links again without a JS re-render. While no target is linked, or while `enabled` is `false`, the keyboard treats the guide as empty space.

### Redirected input

The `guide` prop sets which focus the guide redirects. It reads as "guide *keyboard* to *pay*":

```tsx
<K.Guide guide="keyboard" to="pay" style={styles.guide} />
```

| `guide` | Redirects | Seen by the screen reader |
| :-- | :-- | :-- |
| `'keyboard'` (default) | Arrow keys, `Tab` / `Shift + Tab`, and `Ctrl + Tab` on iOS | No |
| `'arrows'` | Arrow keys only, `Tab` passes over the guide | No |
| `'screen-reader'` | VoiceOver / TalkBack focus | Yes, as a stop that moves on to the target |
| `['keyboard', 'screen-reader']` | The keyboard while no screen reader runs, the screen reader while one runs | Yes |

Unknown values are skipped, and an empty list redirects nothing.

### Keyboard and screen reader together

A list with a keyboard mode and `'screen-reader'` makes the guide check, at each move, whether a screen reader is running. Nothing is cached, so turning the screen reader on or off takes effect immediately:

```tsx
<K.Guide guide={['keyboard', 'screen-reader']} to="pay" style={styles.guide} />
```

| Screen reader | Redirected | Not redirected |
| :-- | :-- | :-- |
| Off | Keyboard. The guide is hidden from accessibility services. | — |
| Running | Screen reader | `Tab`. Arrow keys on Android. On iOS, the arrow-key `UIFocusGuide` stays in place. |

A running screen reader means VoiceOver on iOS, and an enabled accessibility service with touch exploration, such as TalkBack, on Android.

### Size and layout

A guide redirects only when it has a non-zero size, because iOS and Android (API 28+) do not give keyboard focus to a zero-size view. An invisible guide therefore takes `height: 1` across the full width and a transparent background:

```tsx
<K.Guide to="pay" style={{ height: 1 }} />
```

- The guide takes `style` and children like a `View`. Children render as usual and fit visual hints, such as an arrow or a label, not focusable views.
- The guide sets `collapsable={false}` itself, so React Native does not flatten it away when it has no styling.
- A guide acts only when the platform picks its area for the move. When a focusable view is a better match in that direction, focus goes there instead.

### Distant targets

The target can be far away, outside the visible part of a `ScrollView`. With the keyboard, the target scrolls into view as focus moves to it:

```tsx
<K.Order groupId="terms">
  <ScrollView removeClippedSubviews={false}>
    <K.Pressable orderId="start" onPress={onPress}>
      <Text>Summary</Text>
    </K.Pressable>
    {/* Down or Tab from "Summary" skips the text below and lands on "Accept" */}
    <K.Guide to="accept" style={{ height: 24 }} />

    {paragraphs.map((text) => (
      <Text key={text}>{text}</Text>
    ))}

    {/* Up or Shift + Tab from "Accept" goes back to "Summary" */}
    <K.Guide to="start" style={{ height: 24 }} />
    <K.Pressable orderId="accept" onPress={onPress}>
      <Text>Accept</Text>
    </K.Pressable>
  </ScrollView>
</K.Order>
```

`removeClippedSubviews={false}` keeps the off-screen target attached (see [Unmounted targets](#unmounted-targets)).

## Limitations

### VoiceOver delay *(iOS)*

> [!WARNING]
> VoiceOver lands on the guide first and moves on to the target when it handles the focus request, which took about 0.8 s in tests. iOS has no public API that moves VoiceOver focus at once. A swipe in that time continues from the guide's place, not the target's. It can go back to where it came from, on to the guide's neighbour, or onto another guide that sends focus to its own target. A swipe after the target is announced works as expected.

A screen-reader guide therefore fits places where a short pause is natural. A different reading order alone is a better fit for a screen-reader order API, such as `A11y.Order` / `A11y.Index` from `react-native-a11y-order`. TalkBack moves to the target at once, so Android has no such delay.

### Unmounted targets

The guide moves focus only to a view that is mounted and attached to the window. Virtualized lists (`FlatList`, `SectionList`) unmount items far from the viewport, and `removeClippedSubviews`, on by default for `FlatList` on Android, detaches off-screen items. A target outside the viewport therefore belongs in a `ScrollView` with `removeClippedSubviews={false}`.

---

## Quick decision guide

| Need | API |
| :-- | :-- |
| One target for every arrow-key or `Tab` move into an area | `<K.Guide to="…" />` |
| Arrow keys only, `Tab` order unchanged | `guide="arrows"` |
| Target in another `K.Order` | `orderGroup` set to its `groupId` or `orderPrefix` |
| Invisible guide | `style={{ height: 1 }}` with a transparent background |
| Keyboard redirect, and screen-reader redirect while one runs | `guide={['keyboard', 'screen-reader']}` |
| Next view for each key from one view | Link props ([Focus order](./focus-order.md#links-between-views)) |
| Focus containment for modals and overlays | `Focus.Trap` ([Focus lock](./focus-lock.md)) |

---

## Props

| Prop | Type | Default | Description |
| :-- | :-- | :-- | :-- |
| `to` | `string` | — | `orderId` of the view that receives focus when focus moves into the guide. |
| `enabled` | `boolean` | `true` | Redirect on or off. |
| `guide` | `KeyboardFocusGuideMode \| KeyboardFocusGuideMode[]` | `'keyboard'` | Redirected input: `'keyboard'`, `'arrows'`, `'screen-reader'`, or a list. See [Redirected input](#redirected-input). |
| `orderGroup` | `string` | surrounding `K.Order` | Namespace of the target: its `K.Order` `groupId` or its `orderPrefix`. |
| `...ViewProps` | | | Standard `View` props. Children render as usual. |

Types: `KeyboardFocusGuideProps`, `KeyboardFocusGuideMode`.

---

## Related

- [Focus order](./focus-order.md): link props, index order, and locked directions
- [Focus groups](./keyboard-grouping.md): `K.Guide` is a `Tab` stop and groups like the views around it
- [Component overview → K.Guide](../components/overview.md#kguide)
- [Focus guide demo](../../example/src/components/FocusGuide/FocusGuideDemoScreen.tsx): example app screen *Demos → Focus Guide*, a grid with two guides and list shortcuts
- [Focus guide cases](../../example/src/components/FocusGuide/FocusGuideScreen.tsx): example app screen *Tests → Focus Guide Cases*, runtime target changes, unmounting, and every `guide` mode

---

← [Focus order](./focus-order.md) · [Focus lock →](./focus-lock.md)
