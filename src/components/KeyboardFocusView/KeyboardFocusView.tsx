import React, { useMemo } from 'react';
import { Platform } from 'react-native';
import type { KeyboardFocusViewProps } from '../../types/KeyboardFocusView.types';
import { BaseKeyboardView } from '../BaseKeyboardView/BaseKeyboardView';
import type {
  BaseKeyboardViewType,
  KeyboardFocus,
} from '../../types/BaseKeyboardView';
import type { TintType } from '../../types/WithKeyboardFocus';
import { useFocusStyle } from '../../utils/useFocusStyle';
import { useKeyboardPress } from '../../utils/useKeyboardPress/useKeyboardPress';
import { IsViewFocusedContext } from '../../context/IsViewFocusedContext';

export const KeyboardFocusView = React.forwardRef<
  BaseKeyboardViewType | KeyboardFocus,
  KeyboardFocusViewProps & {
    tintType?: TintType;
    withView?: boolean;
  }
>(
  (
    {
      tintType = 'default',
      autoFocus,
      focusStyle,
      style,
      onFocusChange,
      onPress,
      onLongPress,
      onKeyUpPress,
      onKeyDownPress,
      group = false,
      haloEffect = true,
      canBeFocused = true,
      focusable = true,
      withView = true, //ToDo RNCEKV-9 update and rename Discussion #63
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
    const { focused, containerFocusedStyle, onFocusChangeHandler } =
      useFocusStyle({
        onFocusChange,
        containerFocusStyle: focusStyle,
      });

    const withHaloEffect = tintType === 'default' && haloEffect;

    const { onKeyUpPressHandler, onKeyDownPressHandler } = useKeyboardPress({
      onKeyUpPress,
      onKeyDownPress,
      onPress,
      onLongPress,
      triggerCodes,
    });

    const a11y = useMemo(() => {
      return (
        (Platform.OS === 'android' && withView && accessible !== false) ||
        accessible
      );
    }, [accessible, withView]);

    return (
      <IsViewFocusedContext.Provider value={focused}>
        <BaseKeyboardView
          style={[style, containerFocusedStyle]}
          ref={ref}
          onKeyUpPress={onKeyUpPressHandler}
          onKeyDownPress={onKeyDownPressHandler}
          onFocus={onFocus}
          onBlur={onBlur}
          onFocusChange={onFocusChangeHandler}
          onContextMenuPress={onLongPress}
          haloEffect={withHaloEffect}
          defaultFocusHighlightEnabled={defaultFocusHighlightEnabled}
          autoFocus={autoFocus}
          canBeFocused={canBeFocused}
          focusable={focusable}
          tintColor={tintColor}
          group={group}
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
