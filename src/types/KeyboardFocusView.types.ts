import type { NativeSyntheticEvent, GestureResponderEvent } from 'react-native';
import type { FocusStyle } from './FocusStyle';
import type {
  BaseFocusViewProps,
  BaseKeyboardViewProps,
  OnKeyPress,
} from './BaseKeyboardView';

export type KeyboardFocusEvent = NativeSyntheticEvent<{
  isFocused: boolean;
}>;

export type OnFocusChangeFn = (e: KeyboardFocusEvent) => void;

export type FocusStateCallbackType = {
  readonly focused: boolean;
};

export type FocusViewProps = {
  exposeMethods?: string[];
  triggerCodes?: number[];
  focusStyle?: FocusStyle;
  onPress?: (e: GestureResponderEvent | OnKeyPress) => void;
  onLongPress?: (e?: GestureResponderEvent | OnKeyPress) => void;
  onFocus?: () => void;
  onBlur?: () => void;
} & BaseFocusViewProps;

export type KeyboardFocusViewProps = BaseKeyboardViewProps & FocusViewProps;
