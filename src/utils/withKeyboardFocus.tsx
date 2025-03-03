import React, { useCallback, useMemo } from 'react';
import {
  View,
  StyleSheet,
  type StyleProp,
  type ViewStyle,
  type PressableProps,
} from 'react-native';
import { BaseKeyboardView } from '../components';
import type { FocusStyle, KeyboardFocusViewProps } from '../types';
import type { KeyboardFocus, OnKeyPress } from '../types/BaseKeyboardView';
import { useFocusStyle } from './useFocusStyle';
import type { TintType } from '../types/WithKeyboardFocus';
import {
  type RenderProp,
  RenderPropComponent,
} from '../components/RenderPropComponent/RenderPropComponent';
import { useKeyboardPress } from './useKeyboardPress/useKeyboardPress';
import { IsViewFocusedContext } from '../context/IsViewFocusedContext';

type KeyboardFocusPress<T = Function, K = Function> = {
  onPress?: T;
  onLongPress?: T;
  onPressIn?: K;
  onPressOut?: K;
};

export const withKeyboardFocus = <K, T>(
  Component: React.ComponentType<KeyboardFocusPress<T, K>>
) => {
  const WithKeyboardFocus = React.memo(
    React.forwardRef<
      View | KeyboardFocus,
      {
        onPress?: T | ((e?: OnKeyPress) => void);
        onLongPress?: T | ((e?: OnKeyPress) => void);
        onPressIn?: K | ((e?: OnKeyPress) => void);
        onPressOut?: K | ((e?: OnKeyPress) => void);
        disabled?: boolean;
        withPressedStyle?: boolean;
      } & Omit<KeyboardFocusViewProps, 'onPress' | 'onLongPress' | 'style'> & {
          containerStyle?: StyleProp<ViewStyle>;
          containerFocusStyle?: FocusStyle;
          tintType?: TintType;
          FocusHoverComponent?: RenderProp;
          style?: PressableProps['style'];
        }
    >(
      (
        {
          tintType = 'default',
          autoFocus,
          focusStyle,
          style,
          containerStyle,
          onFocusChange,
          onPress,
          onLongPress,
          onKeyUpPress,
          onKeyDownPress,
          onPressIn,
          onPressOut,
          group = false,
          haloEffect = true,
          canBeFocused = true,
          focusable = true,
          tintColor,
          onFocus,
          onBlur,
          containerFocusStyle,
          FocusHoverComponent,
          viewRef,
          haloCornerRadius,
          haloExpendX,
          haloExpendY,
          groupIdentifier,
          withPressedStyle = false,
          ...props
        },
        ref
      ) => {
        const {
          focused,
          containerFocusedStyle,
          componentStyleViewStyle,
          onFocusChangeHandler,
          hoverColor,
        } = useFocusStyle({
          onFocusChange,
          tintColor,
          focusStyle,
          containerFocusStyle,
          tintType,
          style,
          withPressedStyle,
          Component,
        });

        const withHaloEffect = tintType === 'default' && haloEffect;

        const { onKeyUpPressHandler, onKeyDownPressHandler, onPressHandler } =
          useKeyboardPress({
            onKeyUpPress,
            onKeyDownPress,
            onPress: onPress as (e?: OnKeyPress) => void,
            onLongPress: onLongPress as (e?: OnKeyPress) => void,
            onPressIn: onPressIn as (e?: OnKeyPress) => void,
            onPressOut: onPressOut as (e?: OnKeyPress) => void,
          });

        const HoverComonent = useMemo(() => {
          if (FocusHoverComponent) return FocusHoverComponent;
          if (tintType === 'hover') {
            return (
              <View style={[hoverColor, styles.absolute, styles.opacity]} />
            );
          }

          return undefined;
        }, [FocusHoverComponent, hoverColor, tintType]);

        const onContextMenuHandler = useCallback(() => {
          (onLongPress as (e?: OnKeyPress) => void)?.();
        }, [onLongPress]);

        return (
          <IsViewFocusedContext.Provider value={focused}>
            <BaseKeyboardView
              style={[containerStyle, containerFocusedStyle]}
              ref={ref}
              viewRef={viewRef}
              onKeyUpPress={onKeyUpPressHandler}
              onKeyDownPress={onKeyDownPressHandler}
              onFocus={onFocus}
              onBlur={onBlur}
              onFocusChange={onFocusChangeHandler}
              onContextMenuPress={onContextMenuHandler}
              haloEffect={withHaloEffect}
              haloCornerRadius={haloCornerRadius}
              haloExpendX={haloExpendX}
              haloExpendY={haloExpendY}
              autoFocus={autoFocus}
              canBeFocused={canBeFocused}
              focusable={focusable}
              tintColor={tintColor}
              group={group}
              groupIdentifier={groupIdentifier}
            >
              <Component
                style={componentStyleViewStyle}
                onPress={onPressHandler as T}
                onLongPress={onLongPress as T}
                onPressIn={onPressIn as K}
                onPressOut={onPressOut as K}
                {...(props as T)}
              />
              {focused && HoverComonent && (
                <RenderPropComponent render={HoverComonent} />
              )}
            </BaseKeyboardView>
          </IsViewFocusedContext.Provider>
        );
      }
    )
  );

  const wrappedComponentName =
    Component.displayName || Component.name || 'Component';
  WithKeyboardFocus.displayName = `withKeyboardFocus(${wrappedComponentName})`;

  return WithKeyboardFocus;
};

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
