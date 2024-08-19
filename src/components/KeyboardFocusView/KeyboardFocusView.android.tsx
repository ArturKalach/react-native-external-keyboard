import React from 'react';
import { View } from 'react-native';
import { useFocusStyle } from './hooks/useFocusStyle';
import type { KeyboardFocusViewProps } from '../../types';
import { ExternalKeyboardView } from '../ExternalKeyboardView';

export const KeyboardFocusView = React.forwardRef<View, KeyboardFocusViewProps>(
  (
    {
      canBeFocused = true,
      onFocusChange,
      focusStyle,
      style,
      onKeyUpPress,
      onKeyDownPress,
      autoFocus,
      ...props
    },
    ref
  ) => {
    const { fStyle, onFocusChangeHandler } = useFocusStyle(
      focusStyle,
      onFocusChange
    );

    return (
      <ExternalKeyboardView
        withAutoFocus={autoFocus}
        onFocusChange={onFocusChangeHandler}
        style={[style, fStyle]}
        canBeFocused={canBeFocused}
        ref={ref}
        onKeyUpPress={onKeyUpPress}
        onKeyDownPress={onKeyDownPress}
        {...props}
      />
    );
  }
);
