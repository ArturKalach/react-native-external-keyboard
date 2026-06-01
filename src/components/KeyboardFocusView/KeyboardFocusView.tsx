import React, { useMemo } from 'react';
import { Platform } from 'react-native';
import type {
  KeyboardFocusViewProps,
  BaseKeyboardViewType,
  KeyboardFocus,
} from '../../types';
import { BaseKeyboardView } from '../BaseKeyboardView/BaseKeyboardView';
import { useKeyboardFocusContainer } from '../../utils/useKeyboardFocusContainer';
import { IsViewFocusedContext } from '../../context/IsViewFocusedContext';

export const KeyboardFocusView = React.forwardRef<
  BaseKeyboardViewType | KeyboardFocus,
  KeyboardFocusViewProps
>(
  (
    {
      autoFocus,
      focusStyle,
      style,
      onFocusChange,
      onPress,
      onLongPress,
      onKeyUpPress,
      onKeyDownPress,
      focusableWrapper = false,
      haloEffect = true,
      focusable,
      withView = true,
      tintColor,
      onFocus,
      onBlur,
      children,
      accessible,
      triggerCodes,
      defaultFocusHighlightEnabled = true,
      ...props
    },
    ref
  ) => {
    const {
      focused,
      containerFocusedStyle,
      onFocusChangeHandler,
      onKeyUpPressHandler,
      onKeyDownPressHandler,
    } = useKeyboardFocusContainer({
      onFocusChange,
      containerFocusStyle: focusStyle,
      onKeyUpPress,
      onKeyDownPress,
      onPress,
      onLongPress,
      triggerCodes,
    });

    const a11y =
      (Platform.OS === 'android' && withView && accessible !== false) ||
      accessible;

    const containerStyleArr = useMemo(
      () => [style, containerFocusedStyle],
      [style, containerFocusedStyle]
    );

    return (
      <IsViewFocusedContext.Provider value={focused}>
        <BaseKeyboardView
          style={containerStyleArr}
          ref={ref as React.Ref<BaseKeyboardViewType>}
          onKeyUpPress={onKeyUpPressHandler}
          onKeyDownPress={onKeyDownPressHandler}
          onFocus={onFocus}
          onBlur={onBlur}
          onFocusChange={onFocusChangeHandler}
          onContextMenuPress={onLongPress}
          haloEffect={haloEffect}
          defaultFocusHighlightEnabled={defaultFocusHighlightEnabled}
          autoFocus={autoFocus}
          focusable={focusable}
          tintColor={tintColor}
          focusableWrapper={focusableWrapper}
          accessible={a11y}
          enableContextMenu={Boolean(onLongPress)}
          {...props}
        >
          {children}
        </BaseKeyboardView>
      </IsViewFocusedContext.Provider>
    );
  }
);
