import React, { useCallback } from 'react';
import {
  View,
  GestureResponderEvent,
  Platform,
  StyleProp,
  ViewStyle,
} from 'react-native';
import { BaseKeyboardView } from '../components';
import type { FocusStyle, KeyboardFocusViewProps } from '../types';
import type { KeyboardFocus, OnKeyPressFn } from '../types/BaseKeyboardView';
// import { useFocusStyle } from '../components/KeyboardFocusView/hooks';
import { useFocusStyle } from './useFocusStyle';

const ANDROID_SPACE_KEY_CODE = 62;
const IOS_SPACE_KEY_CODE = 44;

const SPACE_KEY_CODE = Platform.select({
  android: ANDROID_SPACE_KEY_CODE,
  ios: IOS_SPACE_KEY_CODE,
  default: -1,
});

type KeyboardFocusPress = {
  onPressOut?: null | ((event: GestureResponderEvent) => void) | undefined;
  onPressIn?: null | ((event: GestureResponderEvent) => void) | undefined;
  onPress?: null | ((event: GestureResponderEvent) => void) | undefined;
  onLongPress?: null | ((event: GestureResponderEvent) => void) | undefined;
};

export const withKeyboardFocus = <T extends KeyboardFocusPress>(
  Component: React.ComponentType<T>
) => {
  const WithKeyboardFocus = React.memo(
    React.forwardRef<
      View | KeyboardFocus,
      T &
        KeyboardFocusViewProps & {
          tintBackground?: string;
          containerStyle?: StyleProp<ViewStyle>;
          containerFocusStyle?: FocusStyle;
        }
    >(
      (
        {
          autoFocus,
          focusStyle,
          style,
          containerStyle,
          onFocusChange,
          onPress,
          onLongPress,
          onPressOut,
          onPressIn,
          haloEffect = true,
          canBeFocused = true,
          focusable = true,
          tintColor,
          onFocus,
          onBlur,
          tintBackground,
          containerFocusStyle,
          ...props
        },
        ref
      ) => {
        //ToDo refactor move it to another component TouchableKeyboardView
        const onKeyUpPressHandler = useCallback<OnKeyPressFn>(
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

        //ToDo refactor, verify whether it still needed
        const onPressablePressHandler = useCallback(
          (event: GestureResponderEvent) => {
            if (event.nativeEvent.identifier !== undefined) {
              onPress?.(event);
            }
          },
          [onPress]
        );

        //ToDo refactor move it to another component TouchableKeyboardView
        const onKeyDownHandler = useCallback<OnKeyPressFn>(
          (e) => {
            const {
              nativeEvent: { keyCode },
            } = e;

            if (keyCode === SPACE_KEY_CODE) {
              onPressIn?.(e as unknown as GestureResponderEvent);
            }
          },
          [onPressIn]
        );

        const {
          containerFocusedStyle,
          componentFocusedStyle,
          onFocusChangeHandler,
        } = useFocusStyle({
          onFocusChange,
          tintBackground,
          focusStyle,
          containerFocusStyle,
        });

        console.log('assd', [containerStyle, containerFocusedStyle]);
        return (
          <BaseKeyboardView
            style={[containerStyle, containerFocusedStyle]}
            ref={ref}
            onKeyUpPress={onKeyUpPressHandler} //ToDo make it optional
            onKeyDownPress={onKeyDownHandler} //ToDo make it optional
            onFocus={onFocus}
            onBlur={onBlur}
            onFocusChange={onFocusChangeHandler}
            onContextMenuPress={onLongPress}
            haloEffect={haloEffect}
            autoFocus={autoFocus}
            canBeFocused={canBeFocused}
            focusable={focusable}
            tintColor={tintColor}
          >
            <Component
              style={[style, componentFocusedStyle]}
              onPressOut={onPressOut} //ToDo check long/default pressable
              onPressIn={onPressIn}
              onPress={onPressablePressHandler}
              onLongPress={onLongPress}
              focusable={canBeFocused && focusable}
              disabled={!canBeFocused || !focusable}
              {...(props as T)}
            />
          </BaseKeyboardView>
        );
      }
    )
  );

  const wrappedComponentName =
    Component.displayName || Component.name || 'Component';
  WithKeyboardFocus.displayName = `withKeyboardFocus(${wrappedComponentName})`;

  return WithKeyboardFocus;
};
