import React from 'react';
import { useFocusStyle } from './hooks/useFocusStyle';
import type { KeyboardFocusViewProps } from '../../types/KeyboardFocusView.types';
import { ExternalKeyboardView } from '../ExternalKeyboardView';
import type { ExternalKeyboardViewType } from '../../types/ExternalKeyboardView';

export const KeyboardFocusView = React.forwardRef<
  ExternalKeyboardViewType,
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
      <ExternalKeyboardView
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
