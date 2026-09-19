# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## What This Repo Is

`react-native-external-keyboard` is a React Native library (npm package) that adds physical keyboard support — focus management, key press events, focus ordering, and focus locking — across iOS and Android, for the New Architecture (Fabric/bridgeless). Legacy Bridge (Old Architecture) support was dropped in 2.0.0, which also requires React Native ≥ 0.87 — there is no New/Old Architecture conditional left in the code at all (not just disabled), so a consumer on an older React Native version needs an older package version (`1.2.0` for RN 0.80–0.86, `0.13.0` for RN ≤ 0.79) instead.

## Commands

```bash
# Library
yarn prepare          # Build lib/ (run after src/ changes)
yarn lint             # ESLint on all JS/TS/TSX files
yarn typecheck        # TypeScript type check (no emit)
yarn test             # Jest tests

# Example app
yarn example ios      # Run example on iOS simulator
yarn example android  # Run example on Android emulator
yarn example start    # Start Metro bundler

# Release
yarn release          # Bump version + publish
yarn release-ni       # Publish without version bump
yarn clean            # Remove lib/, android/build, example builds
```

Git hooks (lefthook) run lint + typecheck on pre-commit and validate conventional commits on commit-msg.

## Architecture

### Layer Overview

```
src/               TypeScript/TSX — library source, compiled to lib/
ios/               Objective-C native implementation (Fabric only)
android/           Java native implementation (New Architecture only)
example/           Full example app (React Navigation + all features)
lib/               Generated build output (commonjs, ESM, types) — do not edit
```

### JS/TS Layer (`src/`)

- **`nativeSpec/`** — TurboModule/Codegen specs (the source of truth for the native bridge contract). Changes here must be reflected in both iOS and Android native code.
- **`components/`** — React Native components. Each subdirectory contains a component that wraps a native view:
  - `BaseKeyboardView` — core wrapper, used by most other components
  - `KeyboardFocusGroup` — maps to iOS `focusGroupIdentifier`
  - `KeyboardFocusLock/` — `Focus.Frame` (leak detection) and `Focus.Trap` (containment)
  - `KeyboardExtendedInput` — TextInput with focus support
  - `Touchable/` — Pressable wrapper
- **`modules/`** — JS-side native module bridge (`Keyboard.ts` / `Keyboard.android.ts`)
- **`context/`** — React contexts for focus order and group state
- **`utils/`** — `withKeyboardFocus` HOC, `useKeyboardPress` hooks, `useFocusStyle`
- **`types/`** — Shared TypeScript types

### iOS Native (`ios/`)

Structured by responsibility:
- **Views**: `RNCEKVExternalKeyboardView`, `RNCEKVKeyboardFocusGroup`, `RNCEKVExternalKeyboardLockView`, `RNCEKVTextInputFocusWrapper`
- **Delegates**: `FocusDelegate`, `FocusOrderDelegate`, `HaloDelegate`, `GroupIdentifierDelegate`
- **Services**: `RNCEKVKeyboardOrderManager` — manages directional focus order graph
- **Extensions**: Categories on `RCTViewComponentView`, `UIViewController`, `RCTTextInputComponentView`
- **Module**: `RNCEKVExternalKeyboardModule`

### Android Native (`android/src/main/java/com/externalkeyboard`)

Single source tree — view managers, module, delegates, events, and helpers all live under `src/main/`, including the codegen-mirroring `*ManagerSpec`/`*ManagerInterface` classes (in their own `specs/` subpackage; formerly split into `src/newarch`/`src/oldarch`, that split was removed along with Legacy Bridge support in 2.0.0). `build.gradle` always applies the `com.facebook.react` codegen plugin.

## Key Patterns

### Component Enhancement
- **HOC**: `withKeyboardFocus(Component)` adds keyboard focus to any Pressable-like component
- **Direct components**: `BaseKeyboardView`, `KeyboardExtendedView`, `KeyboardExtendedInput`

### Focus Ordering (three systems, can be combined)
1. **Link-based**: `orderId` + `orderForward`/`orderBackward`/`orderLeft`/`orderRight`/`orderUp`/`orderDown` props
2. **Index-based**: `orderIndex` + `orderGroup`
3. **Lock-based**: `lockFocus` array to restrict movement directions

### Native Bridge Contract
`src/nativeSpec/` defines the Codegen specs. When adding props or events:
1. Update the relevant spec file in `nativeSpec/`
2. Implement in iOS (`ios/`)
3. Implement in Android (`android/src/main/`)
4. Update TypeScript types in `src/types/`
