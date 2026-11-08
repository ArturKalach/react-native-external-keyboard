# Focus lock

`Focus.Frame` and `Focus.Trap` keep keyboard and screen-reader focus inside a region, such as a modal, a bottom sheet, or an overlay. This guide covers the two components, the strict iOS lock, and temporary unlocking.

<!-- TODO: add focus-lock-ios.gif / focus-lock-android.gif to docs/images and a GIF table here -->

## How it works

### Frame and trap

The lock has two parts. `Focus.Frame` wraps the whole screen and is the scope of the trap, and on Android it also returns focus that leaves the trap. `Focus.Trap` wraps the region that holds focus:

```tsx
import { Focus, K } from 'react-native-external-keyboard';

<Focus.Frame style={styles.screen}>
  {/* … screen content … */}
  <Focus.Trap forceLock style={styles.dialog}>
    <Text accessibilityRole="header">Delete file?</Text>
    <K.Pressable onPress={onPress}>
      <Text>Delete</Text>
    </K.Pressable>
  </Focus.Trap>
</Focus.Frame>
```

A `Focus.Trap` outside a `Focus.Frame` still renders, but logs the warning `Focus.Trap must be used within a Focus.Frame`.

### Lock on mount

The lock is active while the trap is mounted, so a conditionally rendered trap locks focus when the dialog opens and releases it when the dialog closes:

```tsx
const [open, setOpen] = useState(false);

<Focus.Frame style={styles.screen}>
  <K.Pressable onPress={() => setOpen(true)}>
    <Text>Open dialog</Text>
  </K.Pressable>
  {open && (
    <Focus.Trap forceLock style={styles.dialog}>
      <K.Pressable onPress={() => setOpen(false)}>
        <Text>Close</Text>
      </K.Pressable>
    </Focus.Trap>
  )}
</Focus.Frame>
```

On mount, focus moves into the trap, so the dialog does not need its own `autoFocus`. On iOS this happens with `forceLock`.

### Strict lock: `forceLock` *(iOS)*

`Focus.Trap` on iOS is a view with `accessibilityViewIsModal`, which makes VoiceOver skip the trap's sibling views. Elements outside those siblings, such as a navigation bar, stay reachable. `forceLock` closes that gap:

- keyboard focus moves into the trap on mount, and the focus engine blocks moves that leave it;
- VoiceOver focus that lands outside the trap is sent back to it.

The VoiceOver correction is reactive, so VoiceOver can briefly land outside the trap before it returns. Android ignores `forceLock`, because every Android trap already contains focus.

### Lock on Android

Android has no `accessibilityViewIsModal`, so the lock is custom. `Focus.Trap` keeps keyboard focus in its own subtree, wraps `Tab` and `Shift + Tab` around inside it, and records where keyboard and TalkBack focus last were. `Focus.Frame` sends keyboard and TalkBack focus that lands outside the trap back to that recorded view, or to the first focusable view of the trap.

### Temporary unlock: `lockDisabled`

`lockDisabled` turns the lock off and keeps the trap mounted, for example while a nested picker takes focus. It takes precedence over `forceLock`:

```tsx
<Focus.Trap forceLock lockDisabled={isPickerOpen} style={styles.dialog}>
  {/* … */}
</Focus.Trap>
```

On iOS, `lockDisabled` affects only a trap with `forceLock`.

### One trap per frame

A `Focus.Frame` holds one active trap. A second trap in the same frame logs the warning `Multiple Focus.Trap components may cause unstable behavior`. On Android, with several traps mounted in one window, the newest one is active.

<!-- TODO: confirm behavior inside React Native `Modal`, which renders in its own window -->

### Platform behavior

| | iOS | Android |
| :-- | :-- | :-- |
| `Focus.Frame` | Plain `View`, scope for the trap | Native view that returns focus that leaves the trap |
| `Focus.Trap` | `accessibilityViewIsModal`, strict lock with `forceLock` | Custom lock for keyboard and TalkBack |
| Focus on mount | Keyboard and VoiceOver, with `forceLock` | Once, the TalkBack part only while TalkBack runs |
| `forceLock` | Strict lock | Ignored |
| `lockDisabled` | Only with `forceLock` | Lock off |

---

## Quick decision guide

| Need | API |
| :-- | :-- |
| Focus containment for a modal, sheet, or overlay | `Focus.Trap` inside a `Focus.Frame` |
| Strict iOS lock that also covers the navigation bar | `forceLock` |
| Lock off without unmounting the trap | `lockDisabled` |
| Focus on the first element of the dialog | No extra API: focus moves into the trap on mount |
| Locked directions for one view, not a whole region | `lockFocus` ([Focus order](./focus-order.md#locked-directions)) |

---

## Props

`Focus.Frame` and `Focus.Trap` accept all `View` props and:

| Prop | Component | Platform | Type | Default | Description |
| :-- | :-- | :-- | :-- | :-- | :-- |
| `forceLock` | `Focus.Trap` | iOS | `boolean` | `false` | Strict lock: keyboard focus moves in on mount, moves that leave are blocked, VoiceOver focus outside is sent back. |
| `lockDisabled` | Both | Android, iOS with `forceLock` | `boolean` | `false` | Lock off when `true`. Takes precedence over `forceLock`. |

Types: `KeyboardFocusLockProps`.

---

## Related

- [Focus order](./focus-order.md): locked directions for single views with `lockFocus`
- [Programmatic focus](./programmatic-focus.md): focus requests from code, for example back to the opening button after the dialog closes
- [Component overview → Focus.Frame / Focus.Trap](../components/overview.md#focusframe--focustrap)
- [Focus lock example](../../example/src/components/FocusLockExample/FocusLockExample.tsx): example app screen with a trapped dialog over background content

---

← [Focus guide](./focus-guide.md) · [Focus groups →](./keyboard-grouping.md)
