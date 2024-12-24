import { useState, useMemo, useCallback } from 'react';
import { Platform, type ColorValue } from 'react-native';
import type { FocusStyle } from '../types';
import type { TintType } from '../types/WithKeyboardFocus';

const backgroundTintMap = Platform.select<Partial<Record<TintType, boolean>>>({
  ios: {
    background: true,
  },
  default: {
    background: true,
    default: true,
  },
});

const DEFAULT_BACKGROUND_TINT = '#dce3f9';

export const useFocusStyle = ({
  focusStyle,
  onFocusChange,
  containerFocusStyle,
  tintColor,
  tintType = 'default',
}: {
  focusStyle?: FocusStyle;
  containerFocusStyle?: FocusStyle;
  onFocusChange?: (isFocused: boolean) => void;
  tintColor?: ColorValue;
  tintType?: TintType;
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

  const hoverColor = useMemo(
    () => ({
      backgroundColor: tintColor,
    }),
    [tintColor]
  );

  const containerFocusedStyle = useMemo(() => {
    if (backgroundTintMap[tintType] && !containerFocusStyle) {
      return focused
        ? { backgroundColor: tintColor ?? DEFAULT_BACKGROUND_TINT }
        : undefined;
    }
    if (!containerFocusStyle) return undefined;

    const specificStyle =
      typeof containerFocusStyle === 'function'
        ? containerFocusStyle({ focused })
        : containerFocusStyle;

    return focused ? specificStyle : undefined;
  }, [containerFocusStyle, focused, tintColor, tintType]);

  return {
    componentFocusedStyle,
    containerFocusedStyle,
    onFocusChangeHandler,
    hoverColor,
    focused,
  };
};
