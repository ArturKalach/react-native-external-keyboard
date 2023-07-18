import React from 'react';
import { View } from 'react-native';
import { useFocusStyle } from './hooks/useFocusStyle';
import { ExternalKeyboardView } from '../../nativeSpec';
import type { KeyboardFocusViewProps } from '../../types';

export const KeyboardFocusView = React.forwardRef<View, KeyboardFocusViewProps>(
  (
    {
      canBeFocused = true,
      onFocusChange,
      focusStyle,
      children,
      style,
      withView = true,
      onKeyUpPress,
      onKeyDownPress,
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
        onFocusChange={onFocusChangeHandler}
        style={[style, fStyle]}
        canBeFocused={canBeFocused}
        ref={ref}
        onKeyUpPress={onKeyUpPress}
        onKeyDownPress={onKeyDownPress}
        {...props}
      >
        {withView ? <View accessible>{children}</View> : children}
      </ExternalKeyboardView>
    );
  }
);
