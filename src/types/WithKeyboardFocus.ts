import type { StyleProp, ViewStyle, GestureResponderEvent } from 'react-native';
import type { FocusStyle } from './FocusStyle';
import type { KeyboardFocusViewProps } from './KeyboardFocusView.types';

export type PressType =
  | ((event: GestureResponderEvent) => void)
  | undefined
  | null;

export type WithKeyboardFocus = KeyboardFocusViewProps & {
  tintBackground?: string;
  containerStyle?: StyleProp<ViewStyle>;
  containerFocusStyle?: FocusStyle;
};

export type TintType = 'default' | 'hover' | 'background' | 'none';
