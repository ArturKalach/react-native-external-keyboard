import type { NativeSyntheticEvent, View } from 'react-native';

/**
 * Handler invoked when a view gains or loses keyboard focus.
 *
 * @param isFocused `true` on focus, `false` on blur.
 * @param tag Native view tag of the affected element, when available.
 */
export type OnFocusChangeFn = (isFocused: boolean, tag?: number) => void;

/** Imperative focus handle exposed via `ref` on keyboard-focusable components. */
export type KeyboardFocus = {
  /** Moves keyboard focus to this element (alias of {@link KeyboardFocus.keyboardFocus}). */
  focus: () => void;
  /** Moves physical-keyboard focus to this element. */
  keyboardFocus: () => void;
  /** Moves screen reader (VoiceOver / TalkBack) focus to this element. */
  screenReaderFocus: () => void;
};

/** The underlying `View` augmented with the imperative {@link KeyboardFocus} handle. */
export type BaseKeyboardViewType = View & KeyboardFocus;

/** Native event payload emitted by the view's focus-change callback. */
export type KeyboardFocusEvent = NativeSyntheticEvent<{
  isFocused: boolean;
  target?: number;
}>;

/** Handler receiving the raw {@link KeyboardFocusEvent} from the native view. */
export type NativeFocusChangeHandler = (e: KeyboardFocusEvent) => void;
