import React from 'react';
import {
  View,
  GestureResponderEvent,
  StyleProp,
  ViewStyle,
  StyleSheet,
} from 'react-native';
import { BaseKeyboardView, KeyboardExtendedBaseView } from '../components';
import type { FocusStyle, KeyboardFocusViewProps } from '../types';
import type { KeyboardFocus } from '../types/BaseKeyboardView';
import { useFocusStyle } from './useFocusStyle';
import type { TintType } from '../types/WithKeyboardFocus';
import {
  type RenderProp,
  RenderPropComponent,
} from '../components/RenderPropComponent/RenderPropComponent';
import { useKeyboardPress } from './useKeyboardPress/useKeyboardPress';

type KeyboardFocusPress = {
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
          onKeyUpPress,
          onKeyDownPress,
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
        const {
          focused,
          containerFocusedStyle,
          componentFocusedStyle,
          onFocusChangeHandler,
          hoverColor,
        } = useFocusStyle({
          onFocusChange,
          tintColor,
          focusStyle,
          containerFocusStyle,
          tintType,
        });

        const withHaloEffect = tintType === 'default' && haloEffect;

        const { onKeyUpPressHandler, onPressHandler } = useKeyboardPress({
          onPress,
          onLongPress,
          onKeyUpPress,
        });

        return (
          <BaseKeyboardView
            style={[containerStyle, containerFocusedStyle]}
            ref={ref}
            onKeyUpPress={onKeyUpPressHandler}
            onKeyDownPress={onKeyDownPress}
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
              onPress={onPressHandler}
              onLongPress={onLongPress}
              focusable={canBeFocused && focusable}
              disabled={!canBeFocused || !focusable}
              {...(props as T)}
            />
            {focused && tintType === 'hover' && (
              <KeyboardExtendedBaseView
                focusable={false}
                style={[hoverColor, styles.absolute, styles.opacity]}
              />
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
