import type {
  ViewStyle,
  StyleProp,
  NativeSyntheticEvent,
  GestureResponderEvent,
} from 'react-native';
import type { FocusStyle } from './FocusStyle';
import type { BaseKeyboardViewProps, OnKeyPress } from './BaseKeyboardView';

export type KeyboardFocusEvent = NativeSyntheticEvent<{
  isFocused: boolean;
}>;

export type OnFocusChangeFn = (e: KeyboardFocusEvent) => void;

// export type FocusWrapperProps = ViewProps & {
//   onFocusChange?: (isFocused: boolean) => void;
//   onKeyUpPress?: OnKeyPressFn;
//   onKeyDownPress?: OnKeyPressFn;
//   canBeFocused?: boolean;
//   haloEffect?: boolean;
// };

export type FocusStateCallbackType = {
  readonly focused: boolean;
};

export type KeyboardFocusViewProps = BaseKeyboardViewProps & {
  focusStyle?: FocusStyle;
  containerStyle?: StyleProp<ViewStyle>;
  onPress?: (e: GestureResponderEvent | OnKeyPress) => void;
  onLongPress?: (e?: GestureResponderEvent | OnKeyPress) => void;
  onFocus?: () => void;
  onBlur?: () => void;
};
