import type { PropsWithChildren } from 'react';
import type { ColorValue, ViewProps } from 'react-native';
import type { FocusStyle } from '../../types';

export type KeyboardFocusGroupProps = PropsWithChildren<
  ViewProps & {
    groupIdentifier?: string;
    tintColor?: ColorValue;
    onFocus?: () => void;
    onBlur?: () => void;
    onFocusChange?: (isFocused: boolean) => void;
    focusStyle?: FocusStyle;
    /** Keyboard order group inherited by descendants without their own `orderGroup`. */
    orderGroup?: string;
  }
>;
