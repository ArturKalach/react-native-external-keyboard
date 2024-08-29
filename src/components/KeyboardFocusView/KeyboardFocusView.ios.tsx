import React, { useCallback } from 'react';
import { ExternalKeyboardView } from '../ExternalKeyboardView';
import type { ExternalKeyboardViewType } from '../../types/ExternalKeyboardView';
import type { KeyboardFocusViewProps } from '../../types/KeyboardFocusView.types';

import { A11yModule } from '../../services';

import { useFocusStyle } from './hooks';

export const KeyboardFocusView = React.forwardRef<
  ExternalKeyboardViewType,
  KeyboardFocusViewProps
>(
  (
    {
      onFocusChange,
      style,
      focusStyle,
      canBeFocused: _canBeFocused = true, //ToDo add rule
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
      <ExternalKeyboardView
        ref={ref}
        autoFocus={autoFocus}
        style={[style, fStyle]}
        // canBeFocused={canBeFocused}
        onKeyUpPress={onKeyUpPress}
        onKeyDownPress={onKeyDownPress}
        onFocusChange={onFocusChangeHandler}
        haloEffect={haloEffect}
        {...props}
      />
    );
  }
);
