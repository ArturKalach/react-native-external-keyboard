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

[Extensions/](Extensions/) holds Obj-C categories on RN-owned classes — `RCTViewComponentView`, `UIViewController`, `RCTTextInputComponentView`, `RCTEnhancedScrollView`, `RCTCustomScrollView`. These wire library-wide behavior (e.g. preferred focus environment, focus-aware scrolling) into views the library does not own.

Categories use `+load`-time swizzling via [RNCEKVSwizzlingHelper](Helpers/RNCEKVSwizzlingHelper/) / [RNCEKVSwizzleInstanceMethod](Helpers/RNCEKVSwizzleInstanceMethod/). Keep swizzles idempotent (guard with `dispatch_once`) and isolated to symbols owned by this library — never swizzle a method on a host-app class.

## Module

[RNCEKVExternalKeyboardModule](Modules/RNCEKVExternalKeyboardModule.h) is the only `RCTBridgeModule` — exposes JS-callable functions (the imperative API in `src/modules/Keyboard.ts`). Keep it thin: route work down to the view via `RNCEKVOrderLinking` lookups.

## View managers

Each user-facing view has a `*Manager.mm` next to it (e.g. [RNCEKVExternalKeyboardViewManager.mm](Views/RNCEKVExternalKeyboardView/RNCEKVExternalKeyboardViewManager.mm)). On Legacy these export view + props to RN; on Fabric they are mostly empty shells (Fabric uses the codegen'd component descriptor). Imperative commands (`rnekKeyboardFocus`, `rnekScreenReaderFocus`) are handled in `handleCommand:args:` on the Fabric view and via the manager on Legacy.
