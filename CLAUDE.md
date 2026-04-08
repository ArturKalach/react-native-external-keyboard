# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## What This Repo Is

`react-native-external-keyboard` is a React Native library (npm package) that adds physical keyboard support — focus management, key press events, focus ordering, and focus locking — across iOS and Android, for both New Architecture (Fabric/bridgeless) and Legacy Bridge.

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
ios/               Objective-C native implementation
android/           Java native implementation (dual-arch)
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

Dual-architecture pattern:
- **`src/main/`** — shared code (view managers, module, delegates, events, helpers)
- **`src/newarch/`** — Fabric (New Architecture) implementations
- **`src/oldarch/`** — Legacy Bridge implementations

Gradle conditionally compiles newarch vs oldarch based on the host app's RN architecture setting.

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
3. Implement in Android newarch + oldarch (`android/src/`)
4. Update TypeScript types in `src/types/`

### Architecture Guards
Android view managers check `ReactNativeVersionChecker` at runtime to select the right implementation. iOS uses `#ifdef RCT_NEW_ARCH_ENABLED` preprocessor guards.
