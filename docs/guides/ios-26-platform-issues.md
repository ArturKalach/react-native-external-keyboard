# iOS 26+ platform-specific issues

Since iOS 26 (this includes iOS 27), Tab navigation works a bit differently than on iOS 18.
These are changes in iOS itself — they are not bugs in this library. This page explains what
changed and what to do about it.

| | Does the library fix it? | Seen on |
| :-- | :-- | :-- |
| [Tab skips buttons whose content covers them](#tab-skips-buttons-whose-content-covers-them) | Yes, automatically since 2.0.0 | iOS 26, iOS 27 |
| [Tab does not reach a TextInput field after it](#tab-does-not-reach-a-textinput-field-after-it) | No — you fix it in your own layout | iOS 26, iOS 27 |

---

## Tab skips buttons whose content covers them

**Fixed in 2.0.0.** The library fixes this for you, in every `Pressable`,
`BaseKeyboardView`, `KeyboardExtendedView`, and `KeyboardExtendedInput`. You don't need to
change anything in your code.

**What you will see** — Pressing Tab or Shift-Tab skips some buttons on iOS 26 (iPadOS 26)
or later, even though they worked fine on iOS 18. Arrow keys still reach the same buttons.
`onFocusChange` still fires when you use arrow keys, but not when you use Tab.

**Why this happens** — Since iOS 26, if a button's own content fills the button completely,
iOS may skip that button when you press Tab (arrow keys can still reach it). This breaks a
very common pattern:

```jsx
<Pressable>
  <View style={{ height: 138, backgroundColor: '#fff' }}>...</View>
</Pressable>
```

### What to do

- **On version 2.0.0 or later:** nothing — it's fixed automatically. If you still see this
  problem, your content is nested more than 3-4 levels deep inside the button (the one case
  the fix does not cover yet) — use the workaround below, and please file an issue.
- **On an older version:** use the workaround below, or update to 2.0.0+.

### Workaround

Put the styling directly on the `Pressable`, instead of on a child view that covers it:

```jsx
// ✗ Tab skips this — the inner View covers the button completely
<Pressable onPress={…}>
  <View style={{ height: 138, backgroundColor: '#fff' }}>
    <Text>label</Text>
  </View>
</Pressable>

// ✓ works — the Pressable itself draws the box
<Pressable style={{ height: 138, backgroundColor: '#fff' }} onPress={…}>
  <Text>label</Text>
</Pressable>
```

**About iOS 27** — we tested this on iOS 27 too, and the problem happens there the same way
it does on iOS 26. The fix already covers iOS 27 automatically, no extra work needed on our
side.

**Want the technical details?** How the fix works internally, and how it was tested, is
described in
[ios/CLAUDE.md](../../ios/CLAUDE.md#focusability-read-before-touching-canbecomefocused).

**Search terms** — iOS 26 tab focus not working react native, iOS 27 tab focus not working
react native, keyboard focus stops working after iOS update, Tab skips a button, external
keyboard Tab navigation iOS 26, iOS 27.

---

## Tab does not reach a TextInput field after it

**There is no automatic fix for this — you need to change your layout.** Unlike the button
issue above, this one cannot be fixed inside the library.

**What you will see** — Tab reaches a `KeyboardExtendedInput` / `K.TextInput` field fine,
but pressing Tab again jumps somewhere else instead of moving to the next field — as if
every field after it disappeared. Shift-Tab still works. Arrow keys still work. iOS 18 does
not have this problem.

**Why this happens** — the exact reason is not confirmed. Apple has not documented this
behavior, so we don't know if it's about layout, geometry, or how iOS's focus system decides
what to check next. What we do know, from testing, is *when* it happens: since iOS 26, a
`KeyboardExtendedInput` needs to be the **last** thing visually among its siblings (furthest
right in a row, or lowest in a column). If another view — a badge, an icon, a label — is
drawn *after* it, Tab stops working past that field. It's possible iOS's focus search skips
that other view and, for some reason, treats the input as if it were the last field on
screen — but that's an educated guess, not a confirmed mechanism.

### What to do

Move the other content so it appears **before** the input on screen. Changing only the code
order is not enough — for example, `flexDirection: 'row-reverse'` does not fix it, because
iOS looks at where things actually appear, not the order you wrote them in:

```jsx
// ✗ Tab does not move past this field — the badge appears after the input
<View style={styles.row}>
  <KeyboardExtendedInput value={value} onChangeText={setValue} />
  <StatusBadge focused={focused} />
</View>

// ✓ works — the badge now appears before the input
<View style={styles.row}>
  <StatusBadge focused={focused} />
  <KeyboardExtendedInput value={value} onChangeText={setValue} />
</View>
```

If moving the content isn't an option, two other ideas worth trying (not fully tested yet):
move the badge/icon out of the row or column entirely (for example, with absolute
positioning), or use the library's own `orderId` / `orderForward` / `orderIndex` /
`orderGroup` props on `KeyboardExtendedInput` to set the Tab order yourself, so it doesn't
depend on layout at all.

**About iOS 27** — we tested this on iOS 27 too, and the same problem happens there. There
is still no automatic fix, so use the workaround above on either version.

