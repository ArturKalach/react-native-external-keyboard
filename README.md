![React Native External Keyboard banner — physical keyboard support for iOS and Android](/.github/images/react-native-external-keyboard.png)


# React Native External Keyboard

<div>
  <img align="right" width="35%" src="/.github/images/react-native-external-keyboard.gif" alt="Demo of navigating a React Native app with a physical keyboard — focus moving between buttons and inputs">
</div>

Native-first React Native toolkit for physical (external) keyboard support on iOS and Android — focus management, key-press events, custom focus order, and focus locking.

- 🎯 **Keyboard focus management** — focus/blur events, `autoFocus`, imperative focus via `ref`
- ⌨️ **Key press events** — handle key-down / key-up with full modifier info
- 🔢 **Custom focus order** — link-based, index-based, or direction locking
- 🔒 **Focus lock** — keep focus inside modals and overlays (`Focus.Frame` / `Focus.Trap`)
- 🎨 **Native focus styling** — iOS halo effect & `tintColor`, Android `defaultFocusHighlightEnabled`
- ⚡ New Architecture · Old Architecture · Bridgeless · Expo prebuild

> [!TIP]
> The quickest start is the `K` namespace — `K.Pressable`, `K.View`, and `K.Input` are drop-in, keyboard-focusable versions of `Pressable`, `View`, and `TextInput`. To add focus to a component you already have (a custom button, `TouchableOpacity`, …), reach for the [`withKeyboardFocus`](./docs/components/overview.md#withkeyboardfocus) HOC. See the [getting started guide](./docs/getting-started/getting-started.md).

> [!NOTE]
> On iOS, long-pressing the spacebar does not fire a long press — iOS routes it through *Full Keyboard Access*. Use `Tab + M` (the default "open context menu" command) instead.

</br>

## Installation

```sh
npm install react-native-external-keyboard
cd ios && pod install
```

Get started with the [getting started guide](./docs/getting-started/getting-started.md) or jump straight to the [component overview](./docs/components/overview.md).

## Quick start

Use the `K` namespace — `K.Pressable`, `K.View`, and `K.Input` are ready-made, keyboard-focusable replacements for `Pressable`, `View`, and `TextInput`:

```tsx
import { K } from 'react-native-external-keyboard';
import { Text } from 'react-native';

<K.Pressable
  autoFocus
  onPress={onPress}
  focusStyle={{ backgroundColor: 'dodgerblue' }}
>
  <Text>Press me with Space or Enter</Text>
</K.Pressable>
```

Need focus on a component the `K` namespace doesn't cover — `TouchableOpacity`, a custom button, a third-party component? Wrap it with the [`withKeyboardFocus`](./docs/components/overview.md#withkeyboardfocus) HOC:

```tsx
import { withKeyboardFocus } from 'react-native-external-keyboard';
import { TouchableOpacity } from 'react-native';

const KeyboardTouchable = withKeyboardFocus(TouchableOpacity);
```

## Architecture support

| Capability | Supported |
| :-- | :-- |
| New Architecture (Fabric / Turbo Modules) | ✅ |
| Old Architecture (Bridge) | ✅ |
| Bridgeless mode | ✅ |
| Expo (prebuild / bare) | ✅ |

## Documentation

New here? Start with the [getting started guide](./docs/getting-started/getting-started.md), then follow a task-focused guide. The [full docs index](./docs/README.md) links everything.

**Guides** — task-focused walkthroughs

- [Pressable focus handling](./docs/guides/pressable-focus.md) — focus/blur events, `focusStyle`, render props
- [Native focus styling](./docs/guides/focus-styling.md) — iOS halo & `tintColor`, Android focus highlight
- [Programmatic focus](./docs/guides/programmatic-focus.md) — `ref.focus()`, `keyboardFocus()`, `autoFocus`
- [Keyboard text input](./docs/guides/text-input.md) — `KeyboardExtendedInput`, `focusType`, `blurType`
- [Focus order](./docs/guides/focus-order.md) — link-based, index-based, and direction-lock ordering

**Reference**

- [Component overview](./docs/components/overview.md) — every component and its props
- [API reference](./docs/api/overview.md) — modules, hooks, the imperative ref, shared types
- [Migration guide](./docs/migration/migration.md) — version-to-version upgrade notes

## What's available

**Components**

| Export | Purpose |
| :-- | :-- |
| [`K.Pressable` / `K.View` / `K.Input`](./docs/getting-started/getting-started.md#quick-start) | Ready-made, keyboard-focusable `Pressable` / `View` / `TextInput`. Start here. |
| [`withKeyboardFocus(C)`](./docs/components/overview.md#withkeyboardfocus) | HOC that adds keyboard focus to any `Pressable`/`Touchable`-like component. |
| [`KeyboardExtendedView`](./docs/components/overview.md#keyboardextendedview) | Focus-aware `View` for key handling and grouping (also `K.View`). |
| [`KeyboardExtendedInput`](./docs/components/overview.md#keyboardextendedinput) | `TextInput` with keyboard focus support (also `K.Input`). |
| [`KeyboardExtendedBaseView`](./docs/components/overview.md#keyboardextendedbaseview) | Low-level focusable view (alias `ExternalKeyboardView`). |
| [`KeyboardFocusGroup`](./docs/components/overview.md#keyboardfocusgroup) | iOS `focusGroupIdentifier` grouping + global `tintColor`. |
| [`Focus.Frame` / `Focus.Trap`](./docs/components/overview.md#focusframe--focustrap) | Confine focus to a region (modals, overlays). |
| [`KeyboardOrderFocusGroup`](./docs/components/overview.md#keyboardorderfocusgroup) | Namespacing + index-based focus ordering. |

**API**

| Export | Purpose |
| :-- | :-- |
| [`Keyboard`](./docs/api/overview.md#keyboard-module) | Dismiss the soft keyboard from a hardware keyboard. |
| [`KeyboardFocus` ref](./docs/api/overview.md#imperative-ref-keyboardfocus) | Imperative focus handle (`focus`, `keyboardFocus`, `screenReaderFocus`). |
| [Hooks](./docs/api/overview.md#hooks) | `useIsViewFocused`, `useOrderFocusGroup`. |
| [Focus-order props](./docs/api/overview.md#focus-order-props) | `orderId`, `order*`, `orderIndex`, `orderGroup`, `lockFocus`. |

---

## Contributing

Any type of contribution is highly appreciated. Feel free to create PRs, raise issues, or share ideas — see the [contributing guide](CONTRIBUTING.md) for the development workflow.

## Acknowledgements

It has been a long journey since the first release of the `react-native-external-keyboard` package. Many features have been added, and a lot of issues have been fixed.

With that, I would like to thank the contributors, those who created issues, and the followers, because achieving these results wouldn't have been possible without you.

Thanks to the initial authors: [Andrii Koval](https://github.com/ZioVio), [Michail Chavkin](https://github.com/mchavkin), [Dzmitry Khamitsevich](https://github.com/bulletxenus).

Thanks to the contributors: [João Mosmann](https://github.com/JoaoMosmann), [Stéphane](https://github.com/stephane-r).

Thanks to those who created issues: [Stéphane](https://github.com/stephane-r), [proohit](https://github.com/proohit), [Rananjaya Bandara](https://github.com/Rananjaya), [SteveHoneckPGE](https://github.com/SteveHoneckPGE), [Wes](https://github.com/mrpoodestump).

I really appreciate your help; it has truly helped me move forward!

## License

MIT

---

Made with [create-react-native-library](https://github.com/callstack/react-native-builder-bob)
