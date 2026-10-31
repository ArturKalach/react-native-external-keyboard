import type { ViewProps } from 'react-native';

/**
 * Native role for a KeyboardFocusLock component on Android.
 * iOS does not consume this value.
 *
 * Values must match `TYPE_TRAP` in
 * `android/src/main/java/com/externalkeyboard/views/ExternalKeyboardLockView/ExternalKeyboardLockViewManager.java`.
 */
export enum LockComponentType {
  Trap = 0,
  Frame = 1,
}

export type KeyboardFocusLockProps = ViewProps & {
  /** Native role of the lock — `Trap` (containment) or `Frame` (leak detection). */
  componentType?: LockComponentType;
  /** When `true`, disables the lock without unmounting the component. Takes precedence over `forceLock`. */
  lockDisabled?: boolean;
  /**
   * iOS only: strengthens `Focus.Trap` beyond `accessibilityViewIsModal` by returning focus into the trap when it
   * escapes. Ignored on Android, where every enabled trap already contains focus.
   */
  forceLock?: boolean;
};
