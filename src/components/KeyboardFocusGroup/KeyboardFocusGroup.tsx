import { type PropsWithChildren } from 'react';
import { type ColorValue, View } from 'react-native';
import type { FocusStyle } from '../../types';

export type KeyboardFocusGroupProps = PropsWithChildren<{
  groupIdentifier?: string;
  tintColor?: ColorValue;
  onFocus?: () => void;
  onBlur?: () => void;
  onFocusChange?: (isFocused: boolean) => void;
  focusStyle?: FocusStyle;
}>;

export const KeyboardFocusGroup = View as KeyboardFocusGroupProps;
