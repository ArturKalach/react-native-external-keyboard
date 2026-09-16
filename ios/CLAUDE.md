# CLAUDE.md — iOS Native Layer

This file gives Claude Code guidance specific to the iOS native code under [ios/](.). Read this in addition to the root [CLAUDE.md](../CLAUDE.md).

## Conventions

- **Prefix `RNCEKV`** is mandatory on every Obj-C class, protocol, enum, and category contributed by this library (stands for "React Native ChaosKey External Keyboard View"). Do not introduce unprefixed symbols — they will collide with React Native or host-app code at link time.
- Files are `.h` + `.mm` (Objective-C++). The `.mm` is required because Fabric props are C++ structs.
- One class per directory under `Views/`, `Delegates/`, and `Helpers/`. The directory name matches the class name. Exception: `features/` groups every file for one cross-cutting feature (view + delegate + utils) instead — see `features/Halo/`.
- Headers use `#ifndef X_h / #define X_h / #endif` include guards (not `#pragma once`).

## Fabric only

Every view subclasses `RCTViewComponentView` directly (see [RNCEKVViewGroupBase.h](Views/Base/ViewGroup/RNCEKVViewGroupBase.h)) and consumes C++ Props structs — there is no Legacy Bridge path. `RCT_NEW_ARCH_ENABLED` preprocessor guards and the parallel `RCTView`/`RCTDirectEventBlock` code paths they used to switch on were removed in 1.2.0 along with the per-view `*Manager.mm` (`RCTViewManager`) classes; Fabric registers components via `+componentDescriptorProvider`, not view-manager lookup.

Fabric C++ prop diffing flows through helper structs in [Helpers/RNCEKVNativeProps/](Helpers/RNCEKVNativeProps/) (e.g. `RNCEKV::FocusProps`, `RNCEKV::OrderProps`, `RNCEKV::HaloProps`) — each base class exposes an `updateXxxProps:newProps:` method invoked from [RNCEKVExternalKeyboardView.mm](Views/RNCEKVExternalKeyboardView/RNCEKVExternalKeyboardView.mm) `updateProps:oldProps:`.

When adding a new prop:
1. Update the JS Codegen spec under `src/nativeSpec/`.
2. Add the field to the relevant `RNCEKV::XxxProps` C++ struct in `Helpers/RNCEKVNativeProps/`.
3. Update the corresponding base class `updateXxxProps:newProps:`.

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
| [RNCEKVGroupIdentifierDelegate](Delegates/RNCEKVGroupIdentifierDelegate/) | Maps `customGroupId` to `focusGroupIdentifier` on UIKit |

If you find yourself adding logic directly inside an `updateXxxProps:` method, consider whether a delegate already owns it — most concrete behavior lives in the delegate, and the view only forwards.

> The **halo** subsystem is grouped under [`features/Halo/`](features/Halo/CLAUDE.md)
> instead of living under `Delegates/`/`Views/Base/`: `RNCEKVExternalKeyboardHalloBase`
> (the base-chain layer above), `RNCEKVHaloDelegate`, `RNCEKVFocusEffectUtility`, and
> `RNCEKVHaloProtocol`. Every other base-chain layer and delegate lives in its usual
> `Views/Base/` / `Delegates/` directory.

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

When a view's order props change, route the mutation through `RNCEKVOrderLinking` (not directly into another view) so subscribers are notified consistently. Always `cleanOrderId:` / unsubscribe in `prepareForRecycle` and `cleanReferences` — these singletons hold non-weak references that will leak otherwise.

## View recycling (Fabric)

Fabric reuses `RCTViewComponentView` instances across mounts. Every base class implements `cleanReferences` and is called from `prepareForRecycle`. **Anything stored in a delegate, service registry, focus guide, or subscriber must be released here**, or a recycled view will keep stale links from its previous mount.

## Extensions (Categories)

[Extensions/](Extensions/) holds Obj-C categories on RN-owned classes — `RCTViewComponentView`, `UIViewController`, `RCTTextInputComponentView`, `RCTEnhancedScrollView`. These wire library-wide behavior (e.g. preferred focus environment, focus-aware scrolling) into views the library does not own.

Categories use `+load`-time swizzling via [RNCEKVSwizzlingHelper](Helpers/RNCEKVSwizzlingHelper/) / [RNCEKVSwizzleInstanceMethod](Helpers/RNCEKVSwizzleInstanceMethod/). Keep swizzles idempotent (guard with `dispatch_once`) and isolated to symbols owned by this library — never swizzle a method on a host-app class.

## Focusability (read before touching `canBecomeFocused`)

`UIView.canBecomeFocused` is `NO` by default; RN only sets it under `TARGET_OS_TV`. The
category in [Extensions/RCTViewComponentView+RNCEKVExternalKeyboard.mm](Extensions/RCTViewComponentView+RNCEKVExternalKeyboard.mm)
is the **only** source of focusability on iOS — remove it and nothing is focusable, by Tab
or arrow keys. Two host shapes:

- **DELEGATED** (`focusableWrapper={true}`, the library `Pressable` pattern) — the
  wrapper's first subview is the focus item, resolved via the category checking
  `self.superview`.
- **SELF-target** (`focusableWrapper={false}`, the default — a bare `BaseKeyboardView`) —
  the view is its own focus item, resolved in `RNCEKVViewFocusChangeBase.canBecomeFocused`
  instead, since the category never runs for it.

Either shape is focusable unless JS passes `focusable={false}` (arrives as `canBeFocused`).

**Two traps:**

1. **iOS 26+ occlusion** — iOS drops a focus target from Tab's candidate list if its own
   content covers it 1:1 (arrow keys / `preferredFocusEnvironments` still reach it). Ruled
   out on device as causes: group identifiers, `ScrollView`, view flattening, focus
   redirection — don't re-investigate these. Fixed by the occlusion override below,
   confirmed working on both iOS 26 and iOS 27 (same `@available` gate covers both). Full
   write-up: [docs/guides/ios-26-platform-issues.md](../docs/guides/ios-26-platform-issues.md).
2. **Recursion crash** — never call `canBecomeFocused` while resolving a wrapper's focus
   target. `RNCEKVFocusDelegate.getFocusingView` is reachable from `canBecomeFocused`, so
   calling it there recurses until `EXC_BAD_ACCESS code=2`.

### Focus occlusion (`isTransparentFocusItem`)

UIKit derives this from a view's background: opaque → occludes; `clearColor` / nil /
`alpha == 0` / hidden → transparent (borders, text, subviews don't count). Since iOS 26, an
occluded item drops out of Tab's candidate list — breaks
`<Pressable><View style={{flex:1}}/></Pressable>`.

**Fix**: every view inside a resolved focus target's subtree reports transparent (button
content is never a reason to skip the button). "Resolved focus target"
(`RNCEKVIsFocusTarget`) covers both host shapes above. Notes from building this:

- Self-target hosts need explicit handling — without it, the content walk never finds a
  `focusableWrapper` ancestor and keeps occluding (the original fix missed this case; see
  Focus Sandbox shapes 10-17).
- Decided purely by tree position when UIKit asks — no geometry measured, nothing to
  invalidate on recycle/relayout.
- Views outside any focus host fall through to `[super …]` — unrelated overlays still
  occlude normally.
- The focus target itself keeps UIKit's default answer; harmless, since UIKit never treats
  a focusable item as transparent — this also keeps nested focus hosts safe.
- Upward walk capped at `kRNCEKVMaxFocusContentDepth` (3, ceiling 4) rather than the screen
  root, since this runs on every opaque view UIKit's focus engine touches, not just buttons.

Below iOS 26 the override forwards straight to `[super …]`. Gate must be `@available`, not
`#if` — preprocessor macros only see the SDK/deployment target, not the OS actually running.

**Measured on device:**

- Cost: 3-11µs/call.
- Only fires on screens with ≥1 resolved focusable item — zero cost otherwise (confirmed by
  toggling the library off).
- Idle: <5 calls/sec once something's focusable. Keyboard nav bursts ~350-400/sec vs.
  ~50/sec for touch — peak CPU still stays under ~2ms/sec.
- Not purely keyboard-triggered (the idle trickle's source is unconfirmed; halo animation
  is the leading suspect).

Run the [Focus Sandbox](../example/src/components/FocusSandbox/FocusSandbox.tsx) (shapes
10-17: both host types nested inside each other's covering content) after touching this
method.

## Module

[RNCEKVExternalKeyboardModule](Modules/RNCEKVExternalKeyboardModule.h) is the only `RCTBridgeModule` — exposes JS-callable functions (the imperative API in `src/modules/Keyboard.ts`). Keep it thin: route work down to the view via `RNCEKVOrderLinking` lookups.

## Component registration

There are no `*Manager.mm` (`RCTViewManager`) classes — those were Legacy-Bridge-only and were removed in 1.2.0. Fabric registers each view via `+componentDescriptorProvider`, implemented directly on the view class (e.g. [RNCEKVExternalKeyboardView.mm](Views/RNCEKVExternalKeyboardView/RNCEKVExternalKeyboardView.mm)). Imperative commands (`rnekKeyboardFocus`, `rnekScreenReaderFocus`) are handled in `handleCommand:args:` on the view.
