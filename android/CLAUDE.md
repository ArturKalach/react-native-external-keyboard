# CLAUDE.md — android/

Android native implementation of `react-native-external-keyboard`. Read this together with the root [CLAUDE.md](../CLAUDE.md).

## New Architecture only

The library targets Fabric + Turbo Modules exclusively (Legacy Bridge support was removed in 2.0.0, alongside the React Native ≥ 0.87 requirement). [build.gradle](build.gradle) unconditionally applies the `com.facebook.react` codegen plugin, adds `generated/java` + `generated/jni` to `sourceSets.main.java.srcDirs`, and configures the `react { ... }` block (`libraryName = "ExternalKeyboardView"`, `codegenJavaPackageName = "com.externalkeyboard"`). There is no `newArchEnabled` toggle and no `BuildConfig` flag — `ExternalKeyboardViewPackage.java`'s `ReactModuleInfo` hardcodes `isTurboModule = true`.

`build.gradle` carries its own `buildscript` block (AGP 9.2.1, Kotlin 2.2.0 as of this writing) so the module resolves independently of whatever the host app's root `build.gradle` declares. `getExtOrDefault(prop)` still checks `rootProject.ext` first, falling back to the `ExternalKeyboard` version map at the top of the file (`kotlinVersion`, `minSdkVersion`, `compileSdkVersion`, `targetSdkVersion`) — a host app can still override any of these via its own `rootProject.ext`. There is no `android/gradle.properties`/`ExternalKeyboard_`-prefixed fallback anymore.

### Spec pattern

Each manager/module in `src/main/` extends a codegen-mirroring spec class living in its own `com.externalkeyboard.specs` subpackage ([src/main/java/com/externalkeyboard/specs/](src/main/java/com/externalkeyboard/specs/)), separate from the hand-written implementations (formerly all flat in `com.externalkeyboard`, and before that split into a separate `src/newarch/` source root — both splits are gone in favor of this one):

| Main class | Spec |
|---|---|
| `ExternalKeyboardViewManager` | `com.externalkeyboard.specs.ExternalKeyboardViewManagerSpec` |
| `TextInputFocusWrapperManager` | `com.externalkeyboard.specs.TextInputFocusWrapperManagerSpec` |
| `KeyboardFocusGroupManager` | `com.externalkeyboard.specs.KeyboardFocusGroupManagerSpec` |
| `ExternalKeyboardLockViewManager` | `com.externalkeyboard.specs.ExternalKeyboardLockViewManagerSpec` |
| `ExternalKeyboardModule` | `com.externalkeyboard.specs.ExternalKeyboardModuleSpec` |

Each spec extends the codegen-generated `Native…Spec` / `…ManagerInterface` (in `build/generated/source/codegen/java/...`) — note the codegen output itself still lands in the bare `com.externalkeyboard` package (`codegenJavaPackageName` in `build.gradle`), so `com.externalkeyboard.specs.ExternalKeyboardModuleSpec` imports `com.externalkeyboard.NativeExternalKeyboardModuleSpec` explicitly rather than sharing a package with it.

When adding a prop or command, update:
1. The codegen TS spec under `../src/nativeSpec/` (regenerates the spec's parent interface)
2. The main implementation in `src/main/`

## Manifest

A single [AndroidManifest.xml](src/main/AndroidManifest.xml) with no `package` attribute — `android.namespace` in `build.gradle` is the sole source of the package name now (`com.externalkeyboard`). The old dual-manifest setup (a legacy manifest with `package=` plus an `AndroidManifestNew.xml` swapped in via a `supportsNamespace()` AGP-version check) was removed once the module started pinning its own modern AGP version; don't reintroduce a `package` attribute here — it's redundant with `namespace` and newer AGP treats the two disagreeing as an error.

## View Class Hierarchy

All custom view groups inherit from `ReactViewGroup` through a chain that splits focus responsibilities by layer:

```
ReactViewGroup
 └─ ViewGroupBase                  getFocusingView() — descend to first focusable child
     └─ ViewOrderGroupBase         orderId/orderGroup/orderIndex/orderL/R/U/D/F/B, lockFocus, focusSearch()
         └─ FocusHighlightBase     haloEffect → setDefaultFocusHighlightEnabled
             └─ ViewFocusChangeBase    onFocusChangeListener → EventHelper.focusChanged
                 └─ ViewFocusRequestBase   autoFocus, screenAutoA11yFocus, focus()/a11yFocus()
                     └─ ViewKeyHandlerBase   hasKeyUp/DownListener + KeyboardKeyPressHandler
                         └─ ExternalKeyboardView
```

`TextInputFocusWrapper` deviates — it extends `FocusHighlightBase` directly and overrides `linkAddView`/`linkRemoveView` to intercept the `ReactEditText` child instead of using the generic first-child path.

## Focus-Order System (singletons)

Two process-wide singletons coordinate the focus graph across mounted views:

- **[FocusLinkObserverSingleton](src/main/java/com/externalkeyboard/services/FocusLinkObserver/FocusLinkObserverSingleton.java)** — pub/sub on `orderId`. When a view sets `orderId`, it `emit()`s itself; views with `orderLeft`/`orderRight`/`orderUp`/`orderDown` referencing that id `subscribe()` and call `View.setNextFocusXxxId()` when notified. Holds `WeakReference<View>` for links.
- **[A11yOrderLinking](src/main/java/com/externalkeyboard/helper/Linking/A11yOrderLinking.java)** — manages `orderGroup`+`orderIndex` queues via [LinkingQueue](src/main/java/com/externalkeyboard/helper/Linking/LinkingQueue.java), which uses a `TreeMap<Integer, View>` to maintain forward-focus chains (`setNextFocusForwardId`) sorted by index.

`FocusOrderDelegate` (per-view, owned by `ViewOrderGroupBase`) bridges the view to both singletons. Always call `delegate.link()` after the first child attaches, and `delegate.unlink()` before it detaches; `cleanByOrderId()` runs from `onDropViewInstance`.

## Stub Pattern

Many iOS-only props/commands have empty `//stub` implementations in Android managers (e.g. `setHaloCornerRadius`, `setHaloExpendX/Y`, `setTintColor`, `setGroupIdentifier`, `setOrderFirst/Last`, `setEnableContextMenu`). They must still be declared because the New Architecture codegen interface requires them. Don't remove the stubs — the build will fail on `@Override`.

## React Native Version Handling

Two unrelated RN-version checks live here:

- **[ReactNativeVersionChecker.java](src/main/java/com/externalkeyboard/helper/ReactNativeVersionChecker.java)** — reflects on `ReactEditText.dragAndDropFilter` field to detect RN 0.80+. Used in `ViewOrderGroupBase.focusSearch` to apply a workaround for `FOCUS_FORWARD`/`FOCUS_BACKWARD` with ordered groups.
- **[TextInputFocusWrapper.IS_NATIVELY_FIXED_VERSION](src/main/java/com/externalkeyboard/views/TextInputFocusWrapper/TextInputFocusWrapper.java#L36)** — reads `ReactNativeVersion.VERSION.minor >= 79`. Pre-0.79 had a backward-focus bug on TextInput, so the wrapper intercepted focus and forwarded it to the `EditText`. From 0.79+ the `EditText` is the focus target directly; `getFirstChild()` switches between `this` and `reactEditText` based on this constant and `focusType`.

Cached as `static final` — RN version is compile-time constant for any given consumer build.

## ExternalKeyboardLockView modes

`componentType` encodes which lock role this instance plays (see [ExternalKeyboardLockView.java](src/main/java/com/externalkeyboard/views/ExternalKeyboardLockView/ExternalKeyboardLockView.java)):
- `0` = **Frame** — records the last accessibility-focused descendant into `LockService` so a Trap can route focus back to it.
- `1` = **Trap** — intercepts accessibility focus events and redirects to the stored view; also returns the stored keyboard view from `focusSearch` to contain D-pad navigation.

[LockService](src/main/java/com/externalkeyboard/views/ExternalKeyboardLockView/LockService.java) is a process-wide singleton holding `WeakReference<View>` for the focused descendant and the last keyboard-focused view; cleared on `onDetachedFromWindow`.

## Commands

`receiveCommand` in [ExternalKeyboardViewManager.java:264](src/main/java/com/externalkeyboard/views/ExternalKeyboardView/ExternalKeyboardViewManager.java#L264) handles two string commands invoked from JS:
- `rnekKeyboardFocus` → `view.focus()` (keyboard + a11y)
- `rnekScreenReaderFocus` → `view.a11yFocus()` (a11y only)

The single native module method is `dismissKeyboard(Promise)` on `ExternalKeyboardModule`, which uses a static `WeakReference<View>` populated by `TextInputFocusWrapper` when an EditText gains focus.

## Events

All custom events are dispatched through [EventHelper](src/main/java/com/externalkeyboard/events/EventHelper.java) using `UIManagerHelper.getEventDispatcherForReactTag`. Event classes:
- `FocusChangeEvent` (`onFocusChange`)
- `KeyPressDownEvent` (`onKeyDownPress`)
- `KeyPressUpEvent` (`onKeyUpPress`) — includes `isLongPress` derived from [KeyboardKeyPressHandler](src/main/java/com/externalkeyboard/services/KeyboardKeyPressHandler.java)
- `MultiplyTextSubmit` (`onMultiplyTextSubmit`) — fired for multiline `TextInputFocusWrapper` on Enter

Direct event maps are registered in each manager's `getExportedCustomDirectEventTypeConstants`.

## Build Properties

Configurable from the host app via `rootProject.ext` (e.g. a consuming app's root `build.gradle` `ext { }` block); falls back to the `ExternalKeyboard` map at the top of [build.gradle](build.gradle) otherwise:
- `kotlinVersion: "2.2.0"`
- `minSdkVersion: 24`
- `compileSdkVersion: 37`
- `targetSdkVersion: 36`

There is no `gradle.properties` in this module and no `ExternalKeyboard_`-prefixed fallback anymore — `rootProject.ext` or the in-file defaults are the only two sources.

## Gotchas

- `lockFocus` is an `int` bitmask — see masks in [FocusHelper.java:14-19](src/main/java/com/externalkeyboard/helper/FocusHelper.java#L14-L19). Don't compare it as a boolean.
- `WeakReference<View>` is used pervasively (singletons, listeners, the linked-child cache in `FocusOrderDelegate`). Never store a strong reference to a `ReactView` in a static or singleton — it leaks the React context.
- `TextInputFocusWrapper.focusType == FOCUS_BY_PRESS` (1) keeps the wrapper focusable instead of the `EditText`; touch/key events on the wrapper then transfer focus inward. Changing `focusType` while attached requires re-linking the `focusOrderDelegate` (see [TextInputFocusWrapper.java:202-213](src/main/java/com/externalkeyboard/views/TextInputFocusWrapper/TextInputFocusWrapper.java#L202-L213)).
- The `setHasOnFocusChanged` setter on `ExternalKeyboardView` is a stub on Android — focus listeners are attached unconditionally in `ViewFocusChangeBase.onAttachedToWindow`.
