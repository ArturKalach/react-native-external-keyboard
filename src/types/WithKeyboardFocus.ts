import type { StyleProp, ViewStyle } from 'react-native';
import type { FocusStyle } from './FocusStyle';
import type { KeyboardFocusViewProps } from './KeyboardFocusView.types';

export type PressType<E> = ((e?: E) => void) | (() => void) | undefined;

export type WithKeyboardFocus = KeyboardFocusViewProps & {
  tintBackground?: string;
  containerStyle?: StyleProp<ViewStyle>;
  containerFocusStyle?: FocusStyle;
};

export type TintType = 'default' | 'hover' | 'background' | 'none';
