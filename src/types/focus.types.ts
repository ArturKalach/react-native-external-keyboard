import type { ElementRef } from 'react';
import type { HostComponent, NativeSyntheticEvent } from 'react-native';

/**
 * The host view ref instance (`measure`, `measureInWindow`, `setNativeProps`, …).
 *
 * RN exposes this as `HostInstance` from 0.77 onward; we derive it from
 * `HostComponent` so the type also resolves on older RN (e.g. 0.76).
 */
type HostInstance = ElementRef<HostComponent<unknown>>;

/**
 * Handler invoked when a view gains or loses keyboard focus.
 *
 * @param isFocused `true` on focus, `false` on blur.
 * @param tag Native view tag of the affected element, when available.
 */
export type OnFocusChangeFn = (isFocused: boolean, tag?: number) => void;

/** Imperative focus handle exposed via `ref` on keyboard-focusable components. */
export type KeyboardFocusHandle = {
  /** Moves both physical-keyboard and screen-reader focus to this element. */
  focus: () => void;
  /** Moves physical-keyboard focus to this element. */
  keyboardFocus: () => void;
  /** Moves screen reader (VoiceOver / TalkBack) focus to this element. */
  screenReaderFocus: () => void;
};

/**
 * The underlying native view instance augmented with the imperative
 * {@link KeyboardFocusHandle}. Uses RN's `HostInstance` (the host view ref —
 * `measure`, `measureInWindow`, `setNativeProps`, …) rather than the `View`
 * component type, so it resolves correctly under both the legacy and strict
 * (`react-native-strict-api`) RN type sets.
 */
export type KeyboardFocus = HostInstance & KeyboardFocusHandle;

/** Alias of {@link KeyboardFocus}. */
export type BaseKeyboardViewType = KeyboardFocus;

/** Native event payload emitted by the view's focus-change callback. */
export type KeyboardFocusEvent = NativeSyntheticEvent<{
  isFocused: boolean;
  target?: number;
}>;

/** Handler receiving the raw {@link KeyboardFocusEvent} from the native view. */
export type NativeFocusChangeHandler = (e: KeyboardFocusEvent) => void;
