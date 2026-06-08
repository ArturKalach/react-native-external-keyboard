import type { ViewProps } from 'react-native';

/**
 * Native role for a KeyboardFocusLock component on Android.
 * iOS does not consume this value.
 *
 * Values must match the constants in
 * `android/src/main/java/com/externalkeyboard/views/ExternalKeyboardLockView/ExternalKeyboardLockView.java`.
 */
export enum LockComponentType {
  Trap = 0,
  Frame = 1,
}

export type KeyboardFocusLockProps = ViewProps & {
  /** Native role of the lock — `Trap` (containment) or `Frame` (leak detection). */
  componentType?: LockComponentType;
  /** When `true`, disables the lock without unmounting the component. */
  lockDisabled?: boolean;
  /** When `true`, forces focus containment even when it would otherwise be allowed to leave. */
  forceLock?: boolean;
};
