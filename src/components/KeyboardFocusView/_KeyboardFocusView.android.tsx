import React from 'react';
import { useFocusStyle } from './hooks/useFocusStyle';
import type { KeyboardFocusViewProps } from '../../types/KeyboardFocusView.types';
import { BaseKeyboardView } from '../BaseKeyboardView/BaseKeyboardView';
import type { BaseKeyboardViewType } from '../../types/BaseKeyboardView';

export const KeyboardFocusView = React.forwardRef<
  BaseKeyboardViewType,
  KeyboardFocusViewProps
>(
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
      <BaseKeyboardView
        autoFocus={autoFocus}
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
