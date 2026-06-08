# CLAUDE.md — android/

Android native implementation of `react-native-external-keyboard`. Read this together with the root [CLAUDE.md](../CLAUDE.md).

## Dual-Architecture Wiring

The same Java view managers and module support both Fabric (New Architecture) and the Legacy Bridge. The split happens at compile time in [build.gradle](build.gradle):

- `isNewArchitectureEnabled()` checks `rootProject.newArchEnabled`.
- When **true**: applies `com.facebook.react` plugin, adds `src/newarch` + `generated/java` + `generated/jni` to `sourceSets.main.java.srcDirs`, and configures the `react { ... }` codegen block (`libraryName = "ExternalKeyboardView"`, `codegenJavaPackageName = "com.externalkeyboard"`).
- When **false**: adds `src/oldarch` instead.

`BuildConfig.IS_NEW_ARCHITECTURE_ENABLED` is generated as a `boolean` field and read at runtime by [ExternalKeyboardViewPackage.java:35](src/main/java/com/externalkeyboard/ExternalKeyboardViewPackage.java#L35) to set the `isTurboModule` flag on `ReactModuleInfo`.

### Spec pattern

Each manager/module in `src/main/` extends an arch-specific spec class with the **same FQN** in `src/newarch/` and `src/oldarch/`:

| Main class | Spec (same name, different src dir) |
|---|---|
| `ExternalKeyboardViewManager` | `com.externalkeyboard.ExternalKeyboardViewManagerSpec` |
| `TextInputFocusWrapperManager` | `com.externalkeyboard.TextInputFocusWrapperManagerSpec` |
| `KeyboardFocusGroupManager` | `com.externalkeyboard.KeyboardFocusGroupManagerSpec` |
| `ExternalKeyboardLockViewManager` | `com.externalkeyboard.ExternalKeyboardLockViewManagerSpec` |
| `ExternalKeyboardModule` | `com.externalkeyboard.ExternalKeyboardModuleSpec` |

- **newarch** spec extends the codegen-generated `Native…Spec` / `…ManagerInterface` (in `build/generated/source/codegen/java/...`).
- **oldarch** spec is a hand-written abstract class with the same surface (see [src/oldarch/ExternalKeyboardViewManagerSpec.java](src/oldarch/ExternalKeyboardViewManagerSpec.java)).

When adding a prop or command, you must update **all three** locations:
1. The codegen TS spec under `../src/nativeSpec/` (regenerates `src/newarch`'s parent interface)
2. The oldarch spec abstract method
3. The main implementation in `src/main/`

## Manifests

Two manifests exist for AGP compatibility ([build.gradle:26-33](build.gradle#L26-L33)):
- [AndroidManifest.xml](src/main/AndroidManifest.xml) — legacy, declares `package="com.externalkeyboard"`.
- [AndroidManifestNew.xml](src/main/AndroidManifestNew.xml) — used when AGP ≥ 7.3 supports `namespace`, with package declaration removed.

Don't add the package attribute to the New manifest — `supportsNamespace()` switches `manifest.srcFile` based on AGP version.

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

Configurable from the host app via `rootProject.ext` or `gradle.properties` (with `ExternalKeyboard_` prefix). Defaults in [gradle.properties](gradle.properties):
- `kotlinVersion=1.7.0`
- `minSdkVersion=21`
- `targetSdkVersion=31`
- `compileSdkVersion=31`

## Gotchas

- `lockFocus` is an `int` bitmask — see masks in [FocusHelper.java:14-19](src/main/java/com/externalkeyboard/helper/FocusHelper.java#L14-L19). Don't compare it as a boolean.
- `WeakReference<View>` is used pervasively (singletons, listeners, the linked-child cache in `FocusOrderDelegate`). Never store a strong reference to a `ReactView` in a static or singleton — it leaks the React context.
- `TextInputFocusWrapper.focusType == FOCUS_BY_PRESS` (1) keeps the wrapper focusable instead of the `EditText`; touch/key events on the wrapper then transfer focus inward. Changing `focusType` while attached requires re-linking the `focusOrderDelegate` (see [TextInputFocusWrapper.java:202-213](src/main/java/com/externalkeyboard/views/TextInputFocusWrapper/TextInputFocusWrapper.java#L202-L213)).
- The `setHasOnFocusChanged` setter on `ExternalKeyboardView` is a stub on Android — focus listeners are attached unconditionally in `ViewFocusChangeBase.onAttachedToWindow`.
