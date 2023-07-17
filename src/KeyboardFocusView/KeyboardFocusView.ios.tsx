import React, { useCallback } from 'react';
import type { View } from 'react-native';
import ExternalKeyboardView from '../ExternalKeyboardViewNativeComponent';
import { A11yModule } from '../A11yModule';
import { useFocusStyle } from './useFocusStyle';

import type { KeyboardFocusViewProps } from './KeyboardFocusView.types';

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
