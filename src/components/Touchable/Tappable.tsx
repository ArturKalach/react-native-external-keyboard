import React from 'react';
import {
  GestureResponderEvent,
  Pressable as RNPressable,
  View,
  PressableProps,
} from 'react-native';
import type { OnKeyPressFn } from '../../types/BaseKeyboardView';
import type { KeyboardFocusViewProps } from '../../types';

import { KeyboardFocusView } from '../KeyboardFocusView';
import { Platform } from 'react-native';

const spaceKeyCode = Platform.select({
  android: 62,
  ios: 44,
  default: -1,
});

export const Tappable = React.forwardRef<
  View,
  PressableProps & KeyboardFocusViewProps
>(
  (
    {
      canBeFocused,
      focusStyle,
      style,
      onFocusChange,
      onPress,
      onLongPress,
      onKeyDownPress,
      onKeyUpPress,
      onPressOut,
      onPressIn,
      ...props
    },
    ref
  ) => {
    const onKeyUpPressHandler = React.useCallback<OnKeyPressFn>(
      (e) => {
        const {
          nativeEvent: { keyCode, isLongPress },
        } = e;
        onKeyUpPress?.(e);

        if (keyCode === spaceKeyCode) {
          onPressOut?.(e as unknown as GestureResponderEvent);
          if (isLongPress) {
            onLongPress?.(e);
          } else {
            onPress?.(e);
          }
        }
      },
      [onKeyUpPress, onLongPress, onPress, onPressOut]
    );

    const onPressablePressHandler = React.useCallback(
      (event: GestureResponderEvent) => {
        if (event.nativeEvent.identifier !== undefined) {
          onPress?.(event);
        }
      },
      [onPress]
    );

    const onKeyDownHandler = React.useCallback<OnKeyPressFn>(
      (e) => {
        const {
          nativeEvent: { keyCode },
        } = e;
        onKeyDownPress?.(e);

        if (keyCode === spaceKeyCode) {
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
        canBeFocused={canBeFocused}
        onFocusChange={onFocusChange}
        onContextMenuPress={onLongPress}
      >
        <RNPressable
          onPressOut={onPressOut}
          onPressIn={onPressIn}
          onPress={onPressablePressHandler}
          onLongPress={onLongPress}
          {...props}
        />
      </KeyboardFocusView>
    );
  }
);
