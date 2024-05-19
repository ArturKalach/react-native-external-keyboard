import React, { useCallback } from 'react';
import type { View } from 'react-native';
import type { KeyboardFocusViewProps } from '../../types';
import { A11yModule } from '../../services';

import { useFocusStyle } from './hooks';
import { ExternalKeyboardView } from '../ExternalKeyboardView';

export const KeyboardFocusView = React.forwardRef<View, KeyboardFocusViewProps>(
  (
    {
      onFocusChange,
      style,
      focusStyle,
      canBeFocused = true,
      onKeyUpPress,
      onKeyDownPress,
      ...props
    },
    ref
  ) => {
    const setCurrentFocusTag = useCallback(
      (e: { nativeEvent: { target: number } }) => {
        A11yModule.currentFocusedTag = e?.nativeEvent?.target || undefined;
      },
      []
    );

    const onFocus = useCallback(
      (e) => {
        setCurrentFocusTag(e);
        onFocusChange?.(e);
      },
      [onFocusChange, setCurrentFocusTag]
    );

    const { fStyle, onFocusChangeHandler } = useFocusStyle(focusStyle, onFocus);

    return (
      <ExternalKeyboardView
        ref={ref}
        style={[style, fStyle]}
        canBeFocused={canBeFocused}
        onKeyUpPress={onKeyUpPress}
        onKeyDownPress={onKeyDownPress}
        onFocusChange={onFocusChangeHandler}
        {...props}
      />
    );
  }
);
