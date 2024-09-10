import React, { useCallback, useMemo } from 'react';
import { Platform } from 'react-native';
import { useFocusStyle } from './hooks/useFocusStyle';
import type { KeyboardFocusViewProps } from '../../types/KeyboardFocusView.types';
import { BaseKeyboardView } from '../BaseKeyboardView/BaseKeyboardView';
import type { BaseKeyboardViewType } from '../../types/BaseKeyboardView';
import { A11yModule } from '../../services';

//ToDo REMOVE_AFTER_REFACTOR
const setCurrentFocusTag = (tag: number | undefined) => {
  A11yModule.currentFocusedTag = tag;
};

export const KeyboardFocusView = React.forwardRef<
  BaseKeyboardViewType,
  KeyboardFocusViewProps
>(
  (
    {
      canBeFocused = true,
      onFocusChange,
      onFocus,
      onBlur,
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
      (isFocused: boolean) => {
        setCurrentFocusTag(0); //ToDo add stub
        onFocusChange?.(isFocused);
      },
      [onFocusChange]
    );

    //ToDo REMOVE_AFTER_REFACTOR
    const onFocusHandler = Platform.select({
      ios: onIOSFocusHandler,
      android: onFocusChange,
    });

    const { fStyle, onFocusChangeHandler } = useFocusStyle(
      focusStyle,
      onFocusHandler
    );
    const viewStyle = useMemo(() => [style, fStyle], [fStyle, style]);

    return (
      <BaseKeyboardView
        autoFocus={autoFocus}
        onFocusChange={onFocusChangeHandler}
        style={viewStyle}
        canBeFocused={canBeFocused}
        ref={ref}
        onKeyUpPress={onKeyUpPress}
        onKeyDownPress={onKeyDownPress}
        onFocus={onFocus}
        onBlur={onBlur}
        {...props}
      />
    );
  }
);
