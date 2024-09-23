import { useState, useMemo, useCallback } from 'react';
import type { FocusStyle } from '../../../../types';

export const useTintStyle = ({
  focusStyle,
  haloEffect,
  onFocusChange,
  tintBackground = '#dce3f9',
}: {
  haloEffect?: boolean;
  focusStyle?: FocusStyle;
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

  const fStyle = useMemo(() => {
    if (!focusStyle) return undefined;
    const specificStyle =
      typeof focusStyle === 'function' ? focusStyle({ focused }) : focusStyle;
    return focused ? specificStyle : undefined;
  }, [focused, focusStyle]);

  const tintStyle = useMemo(() => {
    if (haloEffect) return;
    return focused ? { backgroundColor: tintBackground } : undefined;
  }, [haloEffect, focused, tintBackground]);
  return {
    onFocusChangeHandler,
    tintStyle,
    fStyle,
  };
};
