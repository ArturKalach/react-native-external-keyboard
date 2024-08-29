/**
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 * @flow strict-local
 * @format
 */

import React from 'react';
import {
  GestureResponderEvent,
  Pressable as RNPressable,
  View,
  PressableProps,
} from 'react-native';
import type { KeyboardFocusViewProps, OnKeyPressFn } from '../../types';
import { KeyboardFocusView } from '../KeyboardFocusView';

const ANDROID_SPACE_KEY_CODE = 62;

export const Pressable = React.forwardRef<
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
      onPressOut,
      onPressIn,
      autoFocus,
      ...props
    },
    ref
  ) => {
    const onKeyUpPressHandler = React.useCallback<OnKeyPressFn>(
      (e) => {
        const {
          nativeEvent: { keyCode, isLongPress },
        } = e;

        if (keyCode === ANDROID_SPACE_KEY_CODE) {
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
        canBeFocused={canBeFocused}
        onFocusChange={onFocusChange}
        autoFocus={autoFocus}
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
