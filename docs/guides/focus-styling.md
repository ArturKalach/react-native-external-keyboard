# Native focus styling — halo, tint & Android highlight

| iOS | Android |
| --- | --- |
| <img src="../images/focus-styling-ios.gif" height="400" alt="Native focus styling on iOS" /> | <img src="../images/focus-styling-android.gif" height="400" alt="Native focus styling on Android" /> |

Beyond your own `focusStyle` ([see Pressable focus handling](./pressable-focus.md)), each platform draws a **native** focus indicator. This guide covers configuring and disabling it: the iOS halo (`haloEffect`, `tintColor`, `haloExpendX`/`haloExpendY`, `haloCornerRadius`, `roundedHaloFix`) and the Android highlight (`defaultFocusHighlightEnabled`).

| Platform | Native indicator | Controlled by |
| :-- | :-- | :-- |
| iOS | The focus **halo** (a ring drawn around the focused view) | `haloEffect`, `tintColor`, `halo*` props |
| Android | The system **focus highlight** | `defaultFocusHighlightEnabled` |

Both are **enabled by default**. The iOS halo props have no effect on Android, and `defaultFocusHighlightEnabled` has no effect on iOS.

---

## iOS — the halo effect

On iOS the focused view gets a halo ring (`UIFocusHaloEffect`). It is on by default.

```tsx
<KeyboardPressable haloEffect tintColor="dodgerblue" onPress={onPress}>
  <Text>Halo on focus</Text>
</KeyboardPressable>
```

| Prop | Type | Default | Description |
| :-- | :-- | :-- | :-- |
| `haloEffect` | `boolean` | `true` | Draw the halo ring on focus. |
| `tintColor` | `string` | — | Color of the halo / focus tint. |
| `haloCornerRadius` | `number` | `0` | Corner radius of the halo ring, in points. |
| `haloExpendX` | `number` | `0` | Horizontal expansion of the ring beyond the view bounds, in points. |
| `haloExpendY` | `number` | `0` | Vertical expansion of the ring beyond the view bounds, in points. |

### Shaping the halo

`haloExpendX` / `haloExpendY` push the ring outward so it doesn't hug the content too tightly, and `haloCornerRadius` rounds it to match a rounded button:

```tsx
<KeyboardPressable
  haloEffect
  tintColor="dodgerblue"
  haloExpendX={6}
  haloExpendY={6}
  haloCornerRadius={12}
  style={styles.roundedButton}
  onPress={onPress}
>
  <Text>Rounded, padded halo</Text>
</KeyboardPressable>
```

### Disabling the iOS halo

Set `haloEffect={false}` to turn the ring off (for example, when you draw your own focus ring via `focusStyle` / `containerFocusStyle`):

```tsx
<KeyboardPressable
  haloEffect={false}
  containerFocusStyle={{ borderWidth: 2, borderColor: 'dodgerblue' }}
  onPress={onPress}
>
  <Text>Custom ring, no halo</Text>
</KeyboardPressable>
```

### `roundedHaloFix`

When you disable the halo (`haloEffect={false}`) on a view that has a `borderRadius`, the halo can reappear anyway — iOS recalculates and redraws it on the next layout pass, overriding the fact that you turned it off.

#### Why this happens

This is a UIKit + React Native interaction, not a bug in this library. UIKit arms the focus halo from the focused view's `layer.cornerRadius`, and React Native re-applies that `cornerRadius` (from your `borderRadius` style) on every layout pass. Each time it does, UIKit recalculates the halo and draws it again — re-enabling the effect you had disabled.

You can avoid it in **two ways**:

**1. Use `roundedHaloFix`** — it watches for layout changes and resets the focus effect on each pass, so the disabled halo stays suppressed:

```tsx
<KeyboardPressable
  haloEffect={false}
  roundedHaloFix
  style={{ borderRadius: 16 }}
  onPress={onPress}
>
  <Text>Rounded focus highlight</Text>
</KeyboardPressable>
```

**2. Move the rounding off the focused view** — apply the `borderRadius` (and other border styles) on `containerStyle` instead of `style` or nested children. `containerStyle` targets the outer wrapper, not the focused view, so the focused view's layer keeps a `cornerRadius` of `0` and UIKit never arms the mismatched highlight — while the view still looks rounded:

```tsx
<KeyboardPressable
  haloEffect={false}
  containerStyle={{ borderRadius: 16 }}
  onPress={onPress}
>
  <Text>Rounded, no highlight glitch</Text>
</KeyboardPressable>
```

> [!IMPORTANT]
> `roundedHaloFix` only takes effect when `haloEffect={false}`. With the halo enabled (the default), the ring already follows `haloCornerRadius`, so the fix is not needed and is ignored.

---

## Android — the default focus highlight

Android draws its own system focus highlight on the focused native view, controlled by `defaultFocusHighlightEnabled` (on by default). The iOS `haloEffect` / `tintColor` / `halo*` props do nothing on Android.

```tsx
// Disable Android's native highlight (e.g. when using your own focusStyle)
<KeyboardPressable
  defaultFocusHighlightEnabled={false}
  focusStyle={{ backgroundColor: '#e0e0e0' }}
  onPress={onPress}
>
  <Text>Custom highlight only</Text>
</KeyboardPressable>
```

| Prop | Type | Default | Description |
| :-- | :-- | :-- | :-- |
| `defaultFocusHighlightEnabled` | `boolean` | `true` | Enable Android's default focus highlight for the focused native view. |

---

## Turning off all native indicators

To rely entirely on your own `focusStyle` / `containerFocusStyle` across both platforms, disable both native indicators:

```tsx
<KeyboardPressable
  haloEffect={false}                  // iOS
  defaultFocusHighlightEnabled={false} // Android
  focusStyle={({ focused }) => ({
    backgroundColor: focused ? 'dodgerblue' : 'transparent',
  })}
  onPress={onPress}
>
  <Text>Fully custom focus look</Text>
</KeyboardPressable>
```

---

## Related

- [Pressable focus handling](./pressable-focus.md) — `focusStyle`, `containerFocusStyle`, render props
- [Component overview → common focus props](../components/overview.md#common-focus-props)

---

← [Pressable focus handling](./pressable-focus.md) · [Programmatic focus →](./programmatic-focus.md)
