# CLAUDE.md — iOS Native Layer

This file gives Claude Code guidance specific to the iOS native code under [ios/](.). Read this in addition to the root [CLAUDE.md](../CLAUDE.md).

## Conventions

- **Prefix `RNCEKV`** is mandatory on every Obj-C class, protocol, enum, and category contributed by this library (stands for "React Native ChaosKey External Keyboard View"). Do not introduce unprefixed symbols — they will collide with React Native or host-app code at link time.
- Files are `.h` + `.mm` (Objective-C++). The `.mm` is required because Fabric props are C++ structs.
- One class per directory under `Views/`, `Delegates/`, and `Helpers/`. The directory name matches the class name. Exception: `features/` groups every file for one cross-cutting feature (view + delegate + utils) instead — see `features/Halo/`.
- Headers use `#ifndef X_h / #define X_h / #endif` include guards (not `#pragma once`).

## Architecture-conditional compilation

All code paths must handle both **Fabric (New Architecture)** and **Legacy Bridge**. The toggle is `RCT_NEW_ARCH_ENABLED`:

```objc
#ifdef RCT_NEW_ARCH_ENABLED
  // Fabric: subclass RCTViewComponentView, consume C++ Props structs
#else
  // Legacy: subclass RCTView, expose RCTDirectEventBlock / RCTBubblingEventBlock
#endif
```

[RNCEKVViewGroupBase.h](Views/Base/ViewGroup/RNCEKVViewGroupBase.h) defines `RNCEKVBaseViewClass` as `RCTViewComponentView` or `RCTView` depending on the flag — base view classes inherit from this macro so the rest of the hierarchy is arch-agnostic.

Fabric C++ prop diffing flows through helper structs in [Helpers/RNCEKVNativeProps/](Helpers/RNCEKVNativeProps/) (e.g. `RNCEKV::FocusProps`, `RNCEKV::OrderProps`, `RNCEKV::HaloProps`) — each base class exposes an `updateXxxProps:newProps:` method invoked from [RNCEKVExternalKeyboardView.mm](Views/RNCEKVExternalKeyboardView/RNCEKVExternalKeyboardView.mm) `updateProps:oldProps:`.

When adding a new prop:
1. Update the JS Codegen spec under `src/nativeSpec/`.
2. Add the field to the relevant `RNCEKV::XxxProps` C++ struct in `Helpers/RNCEKVNativeProps/`.
3. Update the corresponding base class `updateXxxProps:newProps:` (Fabric path).
4. Expose a matching `@property` for the Legacy path (auto-bridged by `RCTViewManager`).

## View inheritance chain

The main keyboard view stacks behaviors through a chain of single-purpose base classes, each layering one capability:

```
RCTViewComponentView / RCTView                  (RN base)
  └── RNCEKVViewGroupBase                       subview tracking, getStoredView, cleanReferences
        └── RNCEKVViewOrderGroupBase            focus-order props (orderId/orderLeft/orderRight/...)
              └── RNCEKVExternalKeyboardHalloBase  halo (focus highlight) props (lives in features/Halo/)
                    └── RNCEKVViewGroupIdentifierBase  customGroupId / focusGroupIdentifier
                          └── RNCEKVViewFocusChangeBase canBeFocused, isKeyboardFocused, onFocusChange
                                └── RNCEKVViewContextMenuBase  enableContextMenu (UIContextMenuInteractionDelegate)
                                      └── RNCEKVViewFocusRequestBase  autoFocus, focus, screenReaderFocus
                                            └── RNCEKVViewKeyPress     hasOnPressUp/Down, key event dispatch
                                                  └── RNCEKVExternalKeyboardView  (the concrete native view)
```

When extending behavior, **add to the lowest base class that conceptually owns it** rather than to the leaf — `RNCEKVTextInputFocusWrapper` and `RNCEKVKeyboardFocusGroup` reuse the same bases and benefit from the change.

## Delegates (composition)

Each base view owns a **delegate** that encapsulates its UIKit-side logic, so behavior can be unit-isolated and reused by the TextInput wrapper:

| Delegate | Responsibility |
|---|---|
| [RNCEKVFocusDelegate](Delegates/RNCEKVFocusDelegate/) | `canBecomeFocused`, focus-change detection from `UIFocusUpdateContext` |
| [RNCEKVFocusLinkDelegate](Delegates/RNCEKVFocusLinkDelegate/) | Resolves `orderLeft/Right/Up/Down/Forward/Backward` link-by-id navigation, plugs into `shouldUpdateFocusInContext:` |
| [RNCEKVFocusSequenceDelegate](Delegates/RNCEKVFocusSequenceDelegate/) | Implements `orderPosition` + `orderGroup` index-based ordering |
| [RNCEKVFocusOrderDelegate](Delegates/RNCEKVFocusOrderDelegate/) | Defines `RNCEKVFocusOrderProtocol` (the order-prop contract) |
| [RNCEKVGroupIdentifierDelegate](Delegates/RNCEKVGroupIdentifierDelegate/) | Maps `customGroupId` to `focusGroupIdentifier` on UIKit; generates a unique id only when `uniqueGroupIdentifierEnabled` (see [Unique focus group ids](#unique-focus-group-ids)) |

If you find yourself adding logic directly inside an `updateXxxProps:` method, consider whether a delegate already owns it — most concrete behavior lives in the delegate, and the view only forwards.

> The **halo** subsystem is grouped under [`features/Halo/`](features/Halo/CLAUDE.md)
> instead of living under `Delegates/`/`Views/Base/`: `RNCEKVExternalKeyboardHalloBase`
> (the base-chain layer above), `RNCEKVHaloDelegate`, `RNCEKVFocusEffectUtility`, and
> `RNCEKVHaloProtocol`. Every other base-chain layer and delegate lives in its usual
> `Views/Base/` / `Delegates/` directory. The **focus guide** is the other `features/` folder:
> [`features/FocusGuide/`](features/FocusGuide/) holds the view, its manager and its helper classes
> (see [Focus guide](#focus-guide)).

## Protocols

Lightweight contracts under [Protocols/](Protocols/):

- `RNCEKVKeyboardFocusableProtocol` — declares `- (void)focus;` for any view RN can programmatically focus via the imperative API.
- `RNCEKVFocusProtocol` — fields the FocusDelegate reads back from its host view.
- `RNCEKVFocusOrderProtocol` — the full order-prop surface (see [RNCEKVFocusOrderProtocol.h](Delegates/RNCEKVFocusOrderDelegate/RNCEKVFocusOrderProtocol.h)).
- `RNCEKVGroupIdentifierProtocol` — same pattern for group features. (`RNCEKVHaloProtocol` lives in [features/Halo/](features/Halo/), not here.)
- `RNCEKVCustomFocusEffectProtocol`, `RNCEKVCustomGroudIdProtocol` — extension points for host apps to override the focus effect or group identifier.

Conform to these on a base class once; do not redeclare them on leaf views.

## Services (singletons)

Cross-view coordination state lives in singletons under [Services/](Services/):

- [RNCEKVOrderLinking](Services/RNCEKVOrderLinking.h) — registry mapping `orderId` → `UIView` and `(orderGroup, orderPosition)` → `UIView`. Backed by [RNCEKVOrderRelationship](Services/RNCEKVKeyboardOrderManager/RNCEKVOrderRelationship/) (a sorted map per group). `+sharedInstance`.
- [RNCEKVFocusLinkObserver](Services/RNCEKVFocusLinkObserver.h) — pub/sub for "view with this `orderId` appeared/disappeared". Used to resolve a forward link to a view that mounts later. `+sharedManager`.
- [RNCEKVKeyboardFocusService](Services/RNCEKVKeyboardFocusService.h) — stateless helpers that drive the UIKit focus engine (`getFocusedItem:`, `focus:`).
- [RNCEKVFocusService](Services/RNCEKVFocusService.h) — **screen-reader** (VoiceOver) focus, not keyboard focus: one shared `UIAccessibilityElementFocusedNotification` observer that notifies subscribed views, plus `previousFocusedView`, `+accessibilityElementFor:` and `-focus:`. Used by the focus guide. Twin of react-native-a11y's `RCA11yFocusService`. `+sharedService`.

When a view's order props change, route the mutation through `RNCEKVOrderLinking` (not directly into another view) so subscribers are notified consistently. Always `cleanOrderId:` / unsubscribe in `prepareForRecycle` and `cleanReferences` — these singletons hold non-weak references that will leak otherwise.

## Focus guide

[`features/FocusGuide/`](features/FocusGuide/) backs `Focus.Guide` (`KeyboardFocusGuide`; codegen component `KeyboardFocusGuide`,
view `RNCEKVKeyboardFocusGuide`). It is a copy of react-native-a11y's `views/RNCEKVKeyboardFocusGuide/` (prefix and Fabric names
differ), so port fixes between the two. The view keeps props, its accessibility/focus state and the UIKit
overrides, and delegates to helpers in the same folder (mirroring Android): `RNCEKVGuideMaskPolicy` (flags + which input wins),
`RNCEKVGuideTargetLink` (observer subscription), `RNCEKVGuideKeyboardRedirect` (focusable host + native `UIFocusGuide`), `RNCEKVGuideScreenReaderRedirect`,
read through the `RNCEKVGuideHost` protocol. It subscribes to `RNCEKVFocusLinkObserver`
for the native `preferredFocusOrderId` prop (`to` in JS) and redirects the keyboard with two mechanisms. Which one is in
place depends on `guide` (`needsNativeGuide` in `updateLayoutGuide`):

| `guide` | Focusable host | Native `UIFocusGuide` |
| :-- | :-- | :-- |
| `'keyboard'` | arrows and Tab | none |
| `'arrows'` | not a candidate, Tab passes over it | arrows |
| `['keyboard', 'screen-reader']` | arrows and Tab while VoiceOver is off | arrows, kept so they are redirected while VoiceOver runs |

- **Focusable host** (Tab / Ctrl+Tab, and arrows in `'keyboard'`): the view is itself a focus candidate (`canBecomeFocused`,
  like on Android), because UIKit has no guide for Next/Previous; arrow moves land on it the same way. Without the Tab bit,
  or with the screen-reader bit while VoiceOver runs, it is not a candidate. While the target is on screen, a move onto it is cancelled in `shouldUpdateFocusInContext:` and sent to the
  target via `RNCEKVKeyboardFocusService` (no blink). When the target is off screen the move is allowed to land on the
  guide instead, because a cancelled move makes the engine skip the guide and flash the next element: the engine
  scrolls to the guide (next to the target) with its own animation, and `didUpdateFocusInContext:` hands focus on
  to the target. The programmatic hand-off is not scrolled by the engine, so `focusTarget:scrollIntoView:` also scrolls the target
  into view (`RNCEKVScrollHelper`: `scrollRectToVisible:animated:NO` on its scroll-view ancestors, inside one `UIView` animation block), started
  together with the focus call. The engine scrolls to the guide right after `didUpdateFocusInContext:`, and that
  animation overwrites `contentOffset` every frame, so the helper starts one run-loop turn later, cancels it and takes
  over; otherwise the scroll ends next to the guide, short of the target.
- **Native `UIFocusGuide`** (arrows in `'arrows'` and mixed mode): laid over the view (`updateLayoutGuide`, via
  `RNCEKVFocusGuideHelper`). The focus engine redirects inside the move, which keeps its context and scrolling.

While focus is already inside the target the host is not a candidate, so a move from the target goes on to the next element.

The host is a Tab stop, so it groups like `KeyboardExtendedView`: JS resolves `groupIdentifier` / `uniqueGroupIdentifierEnabled` from
the group scope (`useResolvedGroupIdentifier`, no public prop) and `focusGroupIdentifier` goes through
`RNCEKVGroupIdentifierDelegate`. Without it, unique ids (`Keyboard.configure({ uniqueGroupIdentifier: true })`) made each
neighbour its own group while the guide had none, so Tab skipped it; in a named group Ctrl+Tab would skip it the same way.

**Why `'keyboard'` has no native guide.** A native guide does not redirect Tab, but UIKit lists it in Tab order as its
target, at the target's position (seen with `-UIFocusLoggingEnabled YES`: an off-screen target appears in "Linearly sorted
items" while its guide is on screen). With a host and a native guide both in place, Ctrl+Tab past the last item of a
horizontal list found the guide's target, the focused item itself (Next: Dec -> Dec), and UIKit then wrapped to the first
item (`First`), so Tab never left the list. The host already takes arrow moves, so `'keyboard'` lays no native guide and
nothing stands in for the target. Do not add one back to the `'keyboard'` path.

**Open, not checked on device:** the native guide stays on while focus is inside its target, so the same loop may happen in
the modes that keep it. Mixed mode with VoiceOver off has a host Tab stop and a native guide, the setup that looped;
`'arrows'` may loop on Ctrl+Tab from the target at the end of a list. If either does, the alternative that worked on device
for `'keyboard'`: disable the native guide while focus is inside its target, driven by one shared
`UIFocusDidUpdateNotification` observer for all guides (set `enabled` only when it changes). The guide's own focus callbacks
cannot drive this: UIKit calls them only on the focused view and its ancestors, and the guide is its target's sibling.
Tried and dropped, so do not retry them: answering lazily from a `UIFocusGuide` subclass, overriding `isEnabled` or
`preferredFocusEnvironments` (empty while focus is inside the target). Neither changed anything on device: UIKit does not
read these getters when it searches, so `enabled` must be set before the move.

JS maps `guide` to one native integer, `guideMask` (`RNCEKVGuideMask`: arrows 1, Tab 2, screen reader 4; default 3), so native
never parses a string and checks bits with `hasFlag:`. Arrows need the arrows bit, Tab the Tab bit; the table above says
which mechanism serves them. The screen-reader bit makes the guide a single VoiceOver element: the `isAccessibilityElement` getter is overridden so its text
children are not focused separately, and `accessibilityLabel` returns `@""` while it redirects, so the guide itself is silent. With both a keyboard input and the screen-reader bit, what is redirected is decided at use time with
`UIAccessibilityIsVoiceOverRunning()` (`redirectsScreenReader`, `redirectsTab`): VoiceOver only while it runs, the keyboard otherwise, so the
two never act together. There is no VoiceOver status observer or stored state. The guide subscribes to the shared
`RNCEKVFocusService` (one `UIAccessibilityElementFocusedNotification` observer for the whole app) only while it can redirect VoiceOver; when
the service reports the guide focused, it moves VoiceOver to the target with `-[RNCEKVFocusService focus:]` (a
`UIAccessibilityLayoutChangedNotification` for the target's accessibility element, `+accessibilityElementFor:`). The service's
`previousFocusedView` tells it the swipe came from the target, in which case it does not redirect (no bounce).

**Limit (documented for users):** the move is not instant. VoiceOver acts on the notification ~800ms after it is posted (traced
on device), and until then it is still on the guide. A swipe made in that window continues from the guide: to its neighbours, or onto another guide that then
redirects to its own target. iOS has no public API that moves VoiceOver focus synchronously. The move is posted once, on the
next main-loop turn: delaying it only adds to the wait, and reposting restarts VoiceOver's wait (posts every 0.1s or 0.5s
never landed). Tried and dropped, so do not retry them:
- the guide reading the target's label: read twice, no faster;
- the guide as a container holding the target (`accessibilityElements = @[target]`) instead of landing: the target loses
  its own place in the order (an element has one place), e.g. cell1 -> cell3 skipping cell2;
- keeping the move pending and sending any stop made meanwhile back to the target (hidden from subscribers): did not help
  on device, and hid real focus changes from `onScreenReaderDescendantFocusChanged`.

## Unique focus group ids

`RNCEKVGroupIdentifierDelegate` gives each keyboard-chain view a generated `focusGroupIdentifier`
unless an explicit `groupIdentifier` is set. The iOS-only native prop `uniqueGroupIdentifierEnabled`
(public JS prop `uniqueGroupIdentifier`; default `false` in JS, codegen and native since 0.14; Android stub) controls it:
`true` generates the id, `false` turns it off; the view then falls back to `[super focusGroupIdentifier]`. An explicit
`groupIdentifier` always wins. JS resolves both props per view in `useResolvedGroupIdentifier`
(`src/context/GroupIdentifierContext.ts`): the view's own prop, else the nearest `KeyboardGroupProvider` /
`KeyboardFocusGroup` scope, else `Keyboard.configure` (`src/config`). Same design as react-native-a11y's
`RCA11yGroupIdentifierDelegate` (0.10).

## Keyboard order and focus groups (Tab vs Ctrl+Tab)

Tab moves between focus groups, Ctrl+Tab between items in one group, and UIKit reports both as
`UIFocusHeadingNext` / `Previous`. `UIFocusUpdateContext` has no public modifier flags. Both order delegates
(`RNCEKVFocusSequenceDelegate` for `orderIndex`, `RNCEKVFocusLinkDelegate` for `orderForward` /
`orderBackward`) ask `+[RNCEKVKeyboardFocusService isOrderMove:forView:]` before redirecting:

- **The key comes from UIKit's search.** UIKit records which search it ran in the private
  `_focusMovement._groupFilter` (`_UIFocusMovementInfo`), read with KVC in `focusSearchOf:`. Seen on
  device: **0 for Ctrl+Tab** (item search), **2 for Tab** (group search, its candidates are the groups);
  heading and `_inputType` are the same for both. Expected to stay exact at a group's last item, where
  Ctrl+Tab leaves the group and proposes the same destination as Tab. <!-- TODO: confirm on device at the
  group edge and for Shift+Tab / Ctrl+Shift+Tab -->.
- The order takes Ctrl+Tab, or Tab when the view is its own group (`uniqueGroupIdentifierEnabled`
  without `customGroupId`, the pre-0.14 behavior). Other moves return `FOCUS_DEFAULT`.
- **Unknown** (nil, another value, or an exception from a renamed ivar): the order takes both keys, as
  before the keys were told apart. Private API, so kept to one read in `@try` and never required.

Dropped, do not bring back without a reason: guessing the key from UIKit's destination (another
`focusGroupIdentifier` for Tab, the same for Ctrl+Tab, the order's boundary when neither side has an id,
since the public getter is nil for implicit groups). It worked only inside a real group (scroll view or
`groupIdentifier`; ungrouped views outside a scroll view are one Tab stop each, so both keys propose the
same view), and at the group's last item it needed a reading-order exception that made plain Tab follow
the order from that item. It lives only in react-native-a11y's local stash.

Key state is not read, by the user's decision: no `GCKeyboard` Control read and no Control press
tracking, so there is no modifier state to keep in sync. `_groupFilter` is UIKit's own record of the
move, not key state.

## Keyboard order edges (`orderGroup` + `orderIndex`)

`RNCEKVFocusSequenceDelegate` cancels Next/Previous moves inside the sequence and focuses the next
index itself; on leaving it focuses the relationship's `exit` (after the last item) or `entry`
(before the first). Both are UIKit's own proposals across the sequence edge, updated on every
order move (latest wins). The group check above runs first, so a Tab out of the order is never
recorded as its `entry` / `exit`. Same logic in react-native-a11y's `RCA11yFocusSequenceDelegate`; port fixes between the two.
Not handled, by decision (add only when an issue shows it): an outside view lying between sequence items
on screen is recorded as an edge too, so leaving to it may lead straight back into the sequence.
A check for it (`isBetweenItems:`, reading order in window coordinates) was tried in react-native-a11y and left out.

## View recycling (Fabric)

Fabric reuses `RCTViewComponentView` instances across mounts. Every base class implements `cleanReferences` and is called from `prepareForRecycle`. **Anything stored in a delegate, service registry, focus guide, or subscriber must be released here**, or a recycled view will keep stale links from its previous mount.

## Extensions (Categories)

[Extensions/](Extensions/) holds Obj-C categories on RN-owned classes — `RCTViewComponentView`, `UIViewController`, `RCTTextInputComponentView`, `RCTEnhancedScrollView`, `RCTCustomScrollView`. These wire library-wide behavior (e.g. preferred focus environment, focus-aware scrolling) into views the library does not own.

Categories use `+load`-time swizzling via [RNCEKVSwizzlingHelper](Helpers/RNCEKVSwizzlingHelper/) / [RNCEKVSwizzleInstanceMethod](Helpers/RNCEKVSwizzleInstanceMethod/). Keep swizzles idempotent (guard with `dispatch_once`) and isolated to symbols owned by this library — never swizzle a method on a host-app class.

## Module

[RNCEKVExternalKeyboardModule](Modules/RNCEKVExternalKeyboardModule.h) is the only `RCTBridgeModule` — exposes JS-callable functions (the imperative API in `src/modules/Keyboard.ts`). Keep it thin: route work down to the view via `RNCEKVOrderLinking` lookups.

## View managers

Each user-facing view has a `*Manager.mm` next to it (e.g. [RNCEKVExternalKeyboardViewManager.mm](Views/RNCEKVExternalKeyboardView/RNCEKVExternalKeyboardViewManager.mm)). On Legacy these export view + props to RN; on Fabric they are mostly empty shells (Fabric uses the codegen'd component descriptor). Imperative commands (`rnekKeyboardFocus`, `rnekScreenReaderFocus`) are handled in `handleCommand:args:` on the Fabric view and via the manager on Legacy.
