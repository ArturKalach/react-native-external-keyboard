import React, { useCallback } from 'react';
import { Platform } from 'react-native';
import { useFocusStyle } from './hooks/useFocusStyle';
import type { KeyboardFocusViewProps } from '../../types/KeyboardFocusView.types';
import { ExternalKeyboardView } from '../ExternalKeyboardView';
import type { ExternalKeyboardViewType } from '../../types/ExternalKeyboardView';
import { A11yModule } from '../../services';

//ToDo REMOVE_AFTER_REFACTOR
const setCurrentFocusTag = (e: { nativeEvent: { target: number } }) => {
  A11yModule.currentFocusedTag = e?.nativeEvent?.target || undefined;
};

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
    //ToDo REMOVE_AFTER_REFACTOR
    const onIOSFocusHandler = useCallback(
      (e) => {
        setCurrentFocusTag(e);
        onFocusChange?.(e);
      },
      [onFocusChange]
    );

    //ToDo REMOVE_AFTER_REFACTOR
    const onFocus = Platform.OS === 'ios' ? onIOSFocusHandler : onFocusChange;

    const { fStyle, onFocusChangeHandler } = useFocusStyle(focusStyle, onFocus);

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
