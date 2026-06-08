import {
  type TextInputProps,
  type StyleProp,
  type ViewStyle,
} from 'react-native';

import type { FocusStyle } from './focusStyle.types';
import type { FocusOrderProps } from './focusOrder.types';
import type { CommonFocusProps } from './baseKeyboardView.types';

/** Keyboard-focus props added on top of React Native's `TextInputProps`. */
export type ExtraKeyboardProps = {
  /**
   * How the input acquires focus.
   *
   * - `'default'` — platform default (Android focuses the input; iOS requires a press).
   * - `'press'` — press the spacebar to focus the input.
   * - `'auto'` — focus automatically; keyboard focus targets the input.
   */
  focusType?: 'default' | 'press' | 'auto';
  /**
   * How the input blurs when keyboard focus moves away.
   *
   * - `'default'` — keep typing allowed while focus is on another component.
   * - `'disable'` — blur the input when focus moves away.
   * - `'auto'` — platform-managed blur behavior.
   *
   * @platform ios
   */
  blurType?: 'default' | 'disable' | 'auto';
  /** Style for the container wrapping the input. */
  containerStyle?: StyleProp<ViewStyle>;
  /** Called when the input gains or loses keyboard focus. */
  onFocusChange?: (isFocused: boolean) => void;
  /** Style applied to the inner `TextInput` while focused. */
  focusStyle?: FocusStyle;
  /** Style applied to the container while focused. */
  containerFocusStyle?: FocusStyle;
  /** Behavior of the submit / return key. */
  submitBehavior?: string;
} & CommonFocusProps &
  FocusOrderProps;

/**
 * `TextInput` props that differ across React Native versions and so are loosened
 * to also accept `null` for backward/forward compatibility.
 */
type IgnoreForCompatibility =
  | 'rejectResponderTermination'
  | 'selectionHandleColor'
  | 'cursorColor'
  | 'maxFontSizeMultiplier';

type CompatibleInputProp<
  TextInputPropsType extends object,
  CompatibilityProp extends IgnoreForCompatibility
> = CompatibilityProp extends keyof TextInputPropsType
  ? TextInputPropsType[CompatibilityProp]
  : CompatibilityProp extends keyof TextInputProps
  ? TextInputProps[CompatibilityProp]
  : never;

type ReactNativeInputCompatibility<
  TextInputPropsType extends object = TextInputProps
> = Omit<TextInputPropsType, IgnoreForCompatibility> & {
  [CompatibilityProp in IgnoreForCompatibility]?: CompatibleInputProp<
    TextInputPropsType,
    CompatibilityProp
  > | null;
};

/**
 * Generic form of {@link KeyboardInputProps}. Combines a (version-compatible)
 * `TextInputProps` shape with the library's {@link ExtraKeyboardProps}.
 */
export type KeyboardInputPropsDeclaration<
  TextInputPropsType extends object = TextInputProps
> = ReactNativeInputCompatibility<TextInputPropsType> & ExtraKeyboardProps;

/** Props for `KeyboardExtendedInput` — RN `TextInputProps` plus keyboard-focus props. */
export type KeyboardInputProps = KeyboardInputPropsDeclaration<TextInputProps>;
