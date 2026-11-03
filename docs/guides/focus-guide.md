# Focus guide — redirect focus to a chosen view

`Focus.Guide` (also exported as `KeyboardFocusGuide`) is an area that passes focus on. When focus moves into the guide it does not
stay there: it goes to the view whose `orderId` you pass in `to`. It is the React Native
equivalent of iOS `UIFocusGuide`, and it also works on Android, which has no such API.

By default a guide redirects the **hardware keyboard** (arrow keys and Tab). It can also
redirect **VoiceOver / TalkBack**, with the limits described [below](#limitations).

---

## When to use it

| Need | Use |
| :-- | :-- |
| Arrow keys land on an unexpected neighbour because of a gap or a wide cell in a grid | `Focus.Guide` over the gap |
| A shortcut across a long list, e.g. from the first item straight to "Continue" | `Focus.Guide` next to the first item |
| One view must name where each of its moves goes | Link props `orderForward`, `orderDown`, … ([Focus order](./focus-order.md#1-link-based-ordering)) |
| Keep focus inside a modal or overlay | `Focus.Trap` ([Component overview](../components/overview.md#focusframe--focustrap)) |

A link prop belongs to the view that focus **leaves**, and covers every move from that view in
one direction. A guide belongs to an **area**, and covers every move that ends in it, whichever
view the move starts from. Use a guide when several views should all reach the same target, for
example every cell above an empty part of a grid.

---

## Basic usage

Row 2 of this grid is shorter than row 1. Without a guide, Down from the products on the right
has nothing below it and focus goes to whatever the platform picks. The guide fills the empty
part of row 2 and sends those moves to "Pay".

```tsx
import {
  Focus,
  KeyboardOrderFocusGroup,
  Pressable,
} from 'react-native-external-keyboard';

<KeyboardOrderFocusGroup groupId="checkout">
  <View style={styles.row}>
    {products.map((product) => (
      <Pressable key={product.id} onPress={() => add(product)}>
        <Text>{product.title}</Text>
      </Pressable>
    ))}
  </View>

  <View style={styles.row}>
    <Pressable orderId="pay" onPress={pay}>
      <Text>Pay</Text>
    </Pressable>
    {/* Down from any product above this area lands on "Pay". */}
    <Focus.Guide to="pay" style={{ flex: 1 }} />
  </View>
</KeyboardOrderFocusGroup>
```

### Jump across a scrolled list

The target can be far away, outside the visible part of a `ScrollView`. With the keyboard, the
target is scrolled into view as focus moves to it.

```tsx
<KeyboardOrderFocusGroup groupId="terms">
  <ScrollView removeClippedSubviews={false}>
    <Pressable orderId="start" onPress={openSummary}>
      <Text>Summary</Text>
    </Pressable>
    {/* Down or Tab from "Summary" skips the text below and lands on "Accept". */}
    <Focus.Guide to="accept" style={{ height: 24 }} />

    {paragraphs.map((text) => (
      <Text key={text}>{text}</Text>
    ))}

    {/* Up or Shift + Tab from "Accept" jumps back to "Summary". */}
    <Focus.Guide to="start" style={{ height: 24 }} />
    <Pressable orderId="accept" onPress={accept}>
      <Text>Accept</Text>
    </Pressable>
  </ScrollView>
</KeyboardOrderFocusGroup>
```

`removeClippedSubviews={false}` keeps the off-screen target mounted. See
[The target must be mounted](#the-target-must-be-mounted).

---

## How the target is found

- **`to` is an `orderId`.** Any keyboard-focusable view of this library can be the target:
  `KeyboardExtendedView` (`K.View`), `Pressable` (`K.Pressable`), `KeyboardExtendedInput` (`K.Input`),
  `KeyboardExtendedBaseView`, or a `withKeyboardFocus` component with that `orderId`.
- **Same namespace as the guide.** `orderId`s are namespaced by `KeyboardOrderFocusGroup` and
  `orderPrefix` (see "`orderId` values are global" in
  [Link-based ordering](./focus-order.md#1-link-based-ordering)).
  The guide looks up `to` in its own surrounding `KeyboardOrderFocusGroup`. For a target in
  another namespace, pass `orderGroup`. Its value is the `groupId` of the target's
  `KeyboardOrderFocusGroup`, or the target's `orderPrefix`.
  - A `KeyboardOrderFocusGroup` without `groupId` gets a generated id, so give it a `groupId`
    when a guide outside it needs to reach in.
  - A target's own `orderGroup` prop (index-based order) does **not** namespace its `orderId`.
    Match its prefix, not its `orderGroup`.
- **The link is kept up to date natively.** The guide subscribes to the target's `orderId`. When
  the target mounts after the guide, remounts, or `to` changes, the guide links again with no
  re-render on the JS side.
- **No target, no redirect.** While no target is linked, or while `enabled` is `false`, the
  keyboard treats the guide as empty space. See the screen-reader exception in
  [Limitations](#a-screen-reader-guide-stays-a-stop-when-it-cannot-redirect).

---

## Choosing what to redirect: `guide`

Read the prop as "guide *keyboard* to *pay*": `<Focus.Guide guide="keyboard" to="pay" />`.

| `guide` | Redirects | The screen reader sees the guide |
| :-- | :-- | :-- |
| `'keyboard'` *(default)* | Arrow keys and Tab / Shift + Tab (and Ctrl + Tab on iOS) | No, it stays hidden |
| `'arrows'` | Arrow keys only. Tab passes over the guide | No, it stays hidden |
| `'screen-reader'` | VoiceOver / TalkBack focus | Yes, as a stop that moves on to the target |
| `['keyboard', 'screen-reader']` | The keyboard while no screen reader runs, the screen reader while one runs | Yes |

Unknown values are skipped, with a dev warning. An empty list redirects nothing.

### Keyboard and screen reader together

With a keyboard input and `'screen-reader'` in the same list, the guide checks at the moment of
each move whether a screen reader is running. Nothing is stored, so turning the screen reader on
or off takes effect right away.

- **No screen reader:** the keyboard is redirected. The guide is hidden from accessibility services.
- **Screen reader running:** the screen reader is redirected and Tab is not. On Android, arrow
  keys are not redirected either. On iOS the arrow-key `UIFocusGuide` stays in place.

"Screen reader running" means VoiceOver on iOS. On Android it means an enabled accessibility
service with touch exploration, such as TalkBack.

---

## How it works

### Keyboard on iOS

The guide uses two mechanisms. Which one is in place depends on `guide`:

| `guide` | The guide view takes focus | Native `UIFocusGuide` |
| :-- | :-- | :-- |
| `'keyboard'` | Arrow keys and Tab | No |
| `'arrows'` | No, Tab passes over the guide | Arrow keys |
| `['keyboard', 'screen-reader']` | Arrow keys and Tab while no screen reader runs | Arrow keys |

- **The guide view takes focus:** UIKit has no focus guide for Tab, so the guide view itself is
  a focus candidate. When an arrow key or Tab move picks it:
  - **The target is fully visible:** the move is cancelled and focus is sent to the target
    directly, so the guide is never shown as focused.
  - **The target is scrolled out of view:** the move lands on the guide first, so the focus
    engine scrolls to it. The guide then hands focus to the target and scrolls the target into
    view, with a 16 pt margin for the focus effect. If the move were cancelled here, the engine
    would skip ahead and briefly show focus on the next element.
- **Native `UIFocusGuide`:** covers the guide's bounds and prefers the target. The focus engine
  redirects within the move itself, so the move keeps its usual animation and scrolling. It
  only reacts to arrow keys.
- **No bounce:** while focus is inside the target, the guide view is not a candidate, so a move
  from the target goes on to the next element.
- The guide has no focus effect of its own (`focusEffect = nil`).

### Keyboard on Android

Android has no focus guide API. While the guide is enabled and linked to a target, it is a
focusable view: hidden from TalkBack, not focusable in touch mode, and without the default focus
highlight. When the platform's focus search picks the guide for an arrow key or Tab move, the
guide hands focus to the target within `requestFocus`. It never holds focus, so a key repeat
cannot start from it. The `ScrollView` around the target scrolls it into view as usual for a
newly focused view.

The move goes on **past** the guide, to the next view in the same direction, when:

- the move starts from the target (no bounce);
- the key is Tab and `guide` is `'arrows'`;
- the target is missing or detached from the window;
- a screen reader is running and the guide also has `'screen-reader'`.

Guides that point at each other cannot loop.

### Screen reader on iOS

With `'screen-reader'`, while VoiceOver runs the guide is one accessibility element. It:

- is **silent**: its label is empty and its text children are not separate elements, so
  VoiceOver reads only the target;
- when VoiceOver lands on it, posts `UIAccessibilityLayoutChangedNotification` for the target,
  once, on the next main-loop turn;
- does **not** redirect a swipe that comes from the target, so focus does not bounce back.

### Screen reader on Android

With `'screen-reader'`, the guide is important for accessibility and screen-reader focusable.
When TalkBack focuses the guide, or one of its children, the guide moves accessibility focus to
the target right away. If the target refuses, it tries again on the next frame. TalkBack reads the
guide's own label or text, so leave them out for a silent guide.

---

## Size and layout

> [!IMPORTANT]
> A guide needs a **non-zero size** to redirect. Android (API 28+) and iOS do not let a zero-size
> view take keyboard focus, so a guide with `height: 0` or `width: 0` is never reached. For a guide
> that should not be visible, use `height: 1` (full width) with a transparent background.

- The guide is a normal layout box. It takes `style` and children like a `View`, and renders
  them as usual. Use children for visual hints such as an arrow or a label, not for focusable
  views.
- React Native removes views that only affect layout. The guide sets `collapsable={false}` itself,
  so it works without any styling.
- A guide only acts when the platform picks its area for the move. If a focusable view is a
  better match in that direction, focus goes there and the guide is not involved. Put a guide
  where the platform would otherwise pick the wrong view, or no view.

> [!TIP]
> On Android the focus engine scores candidates by their distance along the move plus their
> horizontal offset, and a wide guide is off-centre from most views. A view directly below or above
> the guide (a few dp away) can win over it and the redirect is skipped. Keep the guide next to the
> views it redirects from, and leave a clear gap (about 40 dp or more) between those views and the
> next ones, also when the guide is `height: 1` and transparent.

---

## Limitations

### The VoiceOver redirect is not instant (iOS)

> [!WARNING]
> VoiceOver lands on the guide first and moves on to the target when it handles the focus
> request. That took about 0.8 s in our tests, and iOS has no public API that moves VoiceOver
> focus immediately. Until then VoiceOver is still on the guide. A swipe made in that time continues from the guide's place, not the
> target's. It can go back to where it came from, on to the guide's neighbour, or onto another
> guide that sends focus to its own target. Swiping again after the target is announced works as
> expected.

Use a screen-reader guide where a short pause is natural. When the goal is only a different
reading order, prefer a screen-reader order API (for example `A11y.Order` / `A11y.Index` from
`react-native-a11y-order`). TalkBack moves to the target immediately, so Android is not affected.

### A swipe from the target onto the guide (Android)

On Android, a swipe from the target onto its own guide is redirected back to the target. If the
guide comes right after (or right before) its target in the TalkBack order, the user cannot swipe
past it. Keep a screen-reader guide away from its target's swipe path.

iOS does not redirect such a swipe. VoiceOver stays on the guide, which is silent, and the next
swipe continues as usual.

### A screen-reader guide stays a stop when it cannot redirect

With `'screen-reader'` in `guide`, the guide is a screen-reader element whenever the screen
reader runs, also while `enabled` is `false` or no target is linked. In that state it does not
redirect. VoiceOver stops on a silent element, and TalkBack stops on the guide and reads its
content. To turn a screen-reader guide off, remove `'screen-reader'` from `guide` or unmount the
guide.

### The target must be mounted

The guide can only move focus to a view that is mounted and in the window.

- Virtualized lists (`FlatList`, `SectionList`) unmount items far from the viewport.
- `removeClippedSubviews` (on by default for `FlatList` on Android) detaches off-screen items.

For a target outside the viewport, render it in a `ScrollView` with
`removeClippedSubviews={false}`. On Android, a guide whose target is detached lets keyboard moves
continue past it.

### Other limits

- **Touch** is not affected: a guide only redirects keyboard and screen-reader focus.
- **Other platforms:** outside iOS and Android, `Focus.Guide` renders a plain `View`.
- **Separate focus systems:** the keyboard redirect moves hardware-keyboard focus only, not
  VoiceOver or TalkBack focus. The screen-reader redirect does not move keyboard focus.

---

## Props

| Prop | Type | Default | Description |
| :-- | :-- | :-- | :-- |
| `to` | `string` | — | `orderId` of the view that receives focus when focus moves into the guide. |
| `enabled` | `boolean` | `true` | Turns the redirect on or off. |
| `guide` | `'keyboard' \| 'arrows' \| 'screen-reader'` or a list of them | `'keyboard'` | Which mode the guide operates in. See [Choosing what to redirect](#choosing-what-to-redirect-guide). |
| `orderGroup` | `string` | surrounding `KeyboardOrderFocusGroup` | Namespace of the target: its `KeyboardOrderFocusGroup` `groupId` or its `orderPrefix`. |
| `...ViewProps` | — | — | All standard `View` props. Children render as usual. |

Types: `KeyboardFocusGuideProps`, `KeyboardFocusGuideMode`.

---

## Try it

The example app has two screens:

- **Demos → Focus Guide**: a grid with two guides, and horizontal and vertical lists with
  start ⇄ end shortcuts. Toggles turn the guides off, switch to
  `guide={['keyboard', 'screen-reader']}`, and make the guides invisible.
- **Tests → Focus Guide Cases**: a wide guide in a grid (with toggles to turn it off, change the
  target at runtime and unmount it), stacked full-width guides with a toggle that cycles through
  the `guide` modes, and a jump across a scrolled list.

---

## Related

- [Focus order](./focus-order.md): link props, index order and direction locking
- [Component overview → Focus.Guide](../components/overview.md#focusguide)

---

← [Focus order](./focus-order.md) · [Keyboard grouping →](./keyboard-grouping.md)
