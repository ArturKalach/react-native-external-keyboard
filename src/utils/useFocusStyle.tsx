import { useState, useMemo, useCallback } from 'react';
import type { PressableProps } from 'react-native';
import type { FocusStyle } from '../types';

type UseFocusStyleProps = {
  focusStyle?: FocusStyle;
  containerFocusStyle?: FocusStyle;
  onFocusChange?: (isFocused: boolean) => void;
  style?: PressableProps['style'];
  pressedStyleSignature?: boolean;
};

export const useFocusStyle = ({
  focusStyle,
  onFocusChange,
  containerFocusStyle,
  style,
  pressedStyleSignature = false,
}: UseFocusStyleProps) => {
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

  const defaultComponentStyle = useMemo(
    () => (pressedStyleSignature ? undefined : [style, componentFocusedStyle]),
    [pressedStyleSignature, style, componentFocusedStyle]
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

  const componentStyleViewStyle = pressedStyleSignature
    ? styleHandlerPressable
    : defaultComponentStyle;

  return {
    componentStyleViewStyle,
    componentFocusedStyle,
    containerFocusedStyle,
    onFocusChangeHandler,
    focused,
  };
};
