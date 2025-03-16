import React, { useMemo } from 'react';
import { View, StyleSheet, Platform } from 'react-native';
import type { KeyboardFocusViewProps } from '../../types/KeyboardFocusView.types';
import { BaseKeyboardView } from '../BaseKeyboardView/BaseKeyboardView';
import type {
  BaseKeyboardViewType,
  KeyboardFocus,
} from '../../types/BaseKeyboardView';
import type { TintType } from '../../types/WithKeyboardFocus';
import {
  type RenderProp,
  RenderPropComponent,
} from '../RenderPropComponent/RenderPropComponent';
import { useFocusStyle } from '../../utils/useFocusStyle';
import { useKeyboardPress } from '../../utils/useKeyboardPress/useKeyboardPress';
import { IsViewFocusedContext } from '../../context/IsViewFocusedContext';

export const KeyboardFocusView = React.forwardRef<
  BaseKeyboardViewType | KeyboardFocus,
  KeyboardFocusViewProps & {
    tintType?: TintType;
    FocusHoverComponent?: RenderProp;
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
      FocusHoverComponent,
      children,
      accessible,
      ...props
    },
    ref
  ) => {
    const { focused, containerFocusedStyle, onFocusChangeHandler, hoverColor } =
      useFocusStyle({
        onFocusChange,
        tintColor,
        containerFocusStyle: focusStyle,
        tintType,
      });

    const withHaloEffect = tintType === 'default' && haloEffect;

    const { onKeyUpPressHandler, onKeyDownPressHandler } = useKeyboardPress({
      onKeyUpPress,
      onKeyDownPress,
      onPress,
      onLongPress,
    });

    const HoverComonent = useMemo(() => {
      if (FocusHoverComponent) return FocusHoverComponent;
      if (tintType === 'hover')
        return <View style={[hoverColor, styles.absolute, styles.opacity]} />;

      return undefined;
    }, [FocusHoverComponent, hoverColor, tintType]);

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
          autoFocus={autoFocus}
          canBeFocused={canBeFocused}
          focusable={focusable}
          tintColor={tintColor}
          group={group}
          accessible={a11y}
          {...props}
        >
          {children}
          {focused && HoverComonent && (
            <RenderPropComponent render={HoverComonent} />
          )}
        </BaseKeyboardView>
      </IsViewFocusedContext.Provider>
    );
  }
);

const styles = StyleSheet.create({
  absolute: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
  },
  opacity: {
    opacity: 0.3,
  },
});
