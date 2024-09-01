import React from 'react';
import { View, GestureResponderEvent, Platform } from 'react-native';
import type { KeyboardFocusViewProps, OnKeyPressFn } from '../types';
import { KeyboardFocusView } from '../components';

const ANDROID_SPACE_KEY_CODE = 62;
const IOS_SPACE_KEY_CODE = 44;

const SPACE_KEY_CODE = Platform.select({
  android: ANDROID_SPACE_KEY_CODE,
  ios: IOS_SPACE_KEY_CODE,
  default: -1,
});

export const withKeyboardFocus = <
  T extends {
    onPressOut?: null | ((event: GestureResponderEvent) => void) | undefined;
    onPressIn?: null | ((event: GestureResponderEvent) => void) | undefined;
    onPress?: null | ((event: GestureResponderEvent) => void) | undefined;
    onLongPress?: null | ((event: GestureResponderEvent) => void) | undefined;
  }
>(
  Component: React.ComponentType<T>
) => {
  const WithKeyboardFocus = React.forwardRef<View, T & KeyboardFocusViewProps>(
    (
      {
        autoFocus,
        focusStyle,
        style,
        onFocusChange,
        onPress,
        onLongPress,
        onKeyDownPress,
        onPressOut,
        onPressIn,
        haloEffect,
        canBeFocused = true,
        focusable = true,
        ...props
      },
      ref
    ) => {
      const onKeyUpPressHandler = React.useCallback<OnKeyPressFn>(
        (e) => {
          const {
            nativeEvent: { keyCode, isLongPress },
          } = e;

          if (keyCode === SPACE_KEY_CODE) {
            onPressOut?.(e as unknown as GestureResponderEvent);
            if (isLongPress) {
              onLongPress?.(e);
            } else {
              onPress?.(e);
            }
          }
        },
        [onLongPress, onPress, onPressOut]
      );

      const onPressablePressHandler = (event: GestureResponderEvent) => {
        if (event.nativeEvent.identifier !== undefined) {
          onPress?.(event);
        }
      };

      const onKeyDownHandler = React.useCallback<OnKeyPressFn>(
        (e) => {
          const {
            nativeEvent: { keyCode },
          } = e;

          if (keyCode === ANDROID_SPACE_KEY_CODE) {
            onKeyDownPress?.(e);
            onPressIn?.(e as unknown as GestureResponderEvent);
          }
        },
        [onKeyDownPress, onPressIn]
      );

      return (
        <KeyboardFocusView
          style={style}
          focusStyle={focusStyle}
          ref={ref}
          onKeyUpPress={onKeyUpPressHandler}
          onKeyDownPress={onKeyDownHandler}
          onFocusChange={onFocusChange}
          onContextMenuPress={onLongPress}
          haloEffect={haloEffect}
          autoFocus={autoFocus}
          canBeFocused={canBeFocused}
          focusable={focusable}
        >
          <Component
            onPressOut={onPressOut}
            onPressIn={onPressIn}
            onPress={onPressablePressHandler}
            onLongPress={onLongPress}
            focusable={canBeFocused && focusable}
            disabled={!canBeFocused || !focusable}
            {...(props as T)}
          />
        </KeyboardFocusView>
      );
    }
  );

  // Optional: Give the HOC a display name for better debugging
  const wrappedComponentName =
    Component.displayName || Component.name || 'Component';
  WithKeyboardFocus.displayName = `withKeyboardFocus(${wrappedComponentName})`;

  return WithKeyboardFocus;
};
