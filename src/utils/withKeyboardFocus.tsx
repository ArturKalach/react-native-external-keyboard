import React, { useCallback, useMemo } from 'react';
import {
  View,
  GestureResponderEvent,
  Platform,
  StyleProp,
  ViewStyle,
  StyleSheet,
} from 'react-native';
import { BaseKeyboardView } from '../components';
import type { FocusStyle, KeyboardFocusViewProps } from '../types';
import type { KeyboardFocus, OnKeyPressFn } from '../types/BaseKeyboardView';
import { useFocusStyle } from './useFocusStyle';
import type { TintType } from '../types/WithKeyboardFocus';
import {
  type RenderProp,
  RenderPropComponent,
} from '../components/RenderPropComponent/RenderPropComponent';

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
          tintType?: TintType;
          FocusHoverComponent?: RenderProp;
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
          onPressOut,
          onPressIn,
          haloEffect = true,
          canBeFocused = true,
          focusable = true,
          tintColor,
          onFocus,
          onBlur,
          containerFocusStyle,
          FocusHoverComponent,
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
        const onPressHandler = useCallback(
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
          focused,
          containerFocusedStyle,
          componentFocusedStyle,
          onFocusChangeHandler,
        } = useFocusStyle({
          onFocusChange,
          tintColor,
          focusStyle,
          containerFocusStyle,
          tintType,
        });

        const hoverColor = useMemo(
          () => ({
            backgroundColor: tintColor,
          }),
          [tintColor]
        );

        const withHaloEffect = tintType === 'default' && haloEffect;

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
            haloEffect={withHaloEffect}
            autoFocus={autoFocus}
            canBeFocused={canBeFocused}
            focusable={focusable}
            tintColor={tintColor}
          >
            <Component
              style={[style, componentFocusedStyle]}
              onPressOut={onPressOut} //ToDo check long/default pressable
              onPressIn={onPressIn}
              onPress={onPressHandler}
              onLongPress={onLongPress}
              focusable={canBeFocused && focusable}
              disabled={!canBeFocused || !focusable}
              {...(props as T)}
            />
            {focused && tintType === 'hover' && (
              <View style={[hoverColor, styles.absolute, styles.opacity]} />
            )}
            {focused && FocusHoverComponent && (
              <View style={styles.absolute}>
                <RenderPropComponent render={FocusHoverComponent} />
              </View>
            )}
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
