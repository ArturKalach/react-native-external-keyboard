import { useState, useMemo, useCallback } from 'react';
import { type PressableProps, Pressable } from 'react-native';
import type { FocusStyle } from '../types';

type UseFocusStyleProps<C> = {
  focusStyle?: FocusStyle;
  containerFocusStyle?: FocusStyle;
  onFocusChange?: (isFocused: boolean) => void;
  style?: PressableProps['style'];
  Component?: React.ComponentType<C>;
  withPressedStyle?: boolean;
};

export const useFocusStyle = <C extends {}>({
  focusStyle,
  onFocusChange,
  containerFocusStyle,
  style,
  Component,
  withPressedStyle = false,
}: UseFocusStyleProps<C>) => {
  const [focused, setFocusStatus] = useState(false);

  const onFocusChangeHandler = useCallback(
    (isFocused: boolean) => {
      setFocusStatus(isFocused);
      onFocusChange?.(isFocused);
    },
    [onFocusChange]
  );

  const componentFocusedStyle = useMemo(() => {
    const specificStyle =
      typeof focusStyle === 'function' ? focusStyle({ focused }) : focusStyle;
    return focused ? specificStyle : undefined;
  }, [focusStyle, focused]);

  const containerFocusedStyle = useMemo(() => {
    if (!containerFocusStyle) return undefined;

    const specificStyle =
      typeof containerFocusStyle === 'function'
        ? containerFocusStyle({ focused })
        : containerFocusStyle;

    return focused ? specificStyle : undefined;
  }, [containerFocusStyle, focused]);

  const dafaultComponentStyle = useMemo(
    () => [style, componentFocusedStyle],
    [style, componentFocusedStyle]
  );
  const styleHandlerPressable = useCallback(
    ({ pressed }: { pressed: boolean }) => {
      if (typeof style === 'function') {
        return [style({ pressed }), componentFocusedStyle];
      } else {
        return [style, componentFocusedStyle];
      }
    },
    [componentFocusedStyle, style]
  );

  const componentStyleViewStyle =
    Component === Pressable || withPressedStyle
      ? styleHandlerPressable
      : dafaultComponentStyle;

  return {
    componentStyleViewStyle,
    componentFocusedStyle,
    containerFocusedStyle,
    onFocusChangeHandler,
    focused,
  };
};
