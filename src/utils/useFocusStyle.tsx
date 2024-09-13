import { useState, useMemo, useCallback } from 'react';
import type { FocusStyle } from 'src/types';

export const useFocusStyle = ({
  focusStyle,
  onFocusChange,
  tintBackground,
  containerFocusStyle,
}: {
  focusStyle?: FocusStyle;
  containerFocusStyle?: FocusStyle;
  tintBackground?: string;
  onFocusChange?: (isFocused: boolean) => void;
}) => {
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
    if (!containerFocusStyle && !tintBackground) return undefined;
    if (!containerFocusStyle && tintBackground) {
      return focused ? { backgroundColor: tintBackground } : undefined;
    }

    const specificStyle =
      typeof containerFocusStyle === 'function'
        ? containerFocusStyle({ focused })
        : containerFocusStyle;
    return focused ? specificStyle : undefined;
  }, [containerFocusStyle, focused, tintBackground]);

  return {
    componentFocusedStyle,
    containerFocusedStyle,
    onFocusChangeHandler,
    focused,
  };
};
