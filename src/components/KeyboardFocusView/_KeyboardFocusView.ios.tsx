import React, { useCallback } from 'react';
import { BaseKeyboardView } from '../BaseKeyboardView/BaseKeyboardView';
import type { BaseKeyboardViewType } from '../../types/BaseKeyboardView';
import type { KeyboardFocusViewProps } from '../../types/KeyboardFocusView.types';

import { A11yModule } from '../../services';

import { useFocusStyle } from './hooks';

export const KeyboardFocusView = React.forwardRef<
  BaseKeyboardViewType,
  KeyboardFocusViewProps
>(
  (
    {
      onFocusChange,
      style,
      focusStyle,
      canBeFocused,
      onKeyUpPress,
      onKeyDownPress,
      autoFocus,
      haloEffect,
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
      <BaseKeyboardView
        ref={ref}
        autoFocus={autoFocus}
        style={[style, fStyle]}
        canBeFocused={canBeFocused}
        onKeyUpPress={onKeyUpPress}
        onKeyDownPress={onKeyDownPress}
        onFocusChange={onFocusChangeHandler}
        haloEffect={haloEffect}
        {...props}
      />
    );
  }
);
