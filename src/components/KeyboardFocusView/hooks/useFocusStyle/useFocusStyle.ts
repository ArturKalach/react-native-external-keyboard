import { useState, useMemo, useCallback } from 'react';
import { StyleSheet } from 'react-native';
import type { FocusStyle } from '../../../../types';

export const useFocusStyle = (
  focusStyle?: FocusStyle,
  onFocusChange?: (isFocused: boolean) => void
) => {
  const [focused, setFocusStatus] = useState(false);

  const onFocusChangeHandler = useCallback(
    (isFocused: boolean) => {
      setFocusStatus(isFocused);
      onFocusChange?.(isFocused);
    },
    [onFocusChange]
  );

  const fStyle = useMemo(() => {
    if (!focusStyle) return focused ? styles.defaultHighlight : undefined;
    const specificStyle =
      typeof focusStyle === 'function' ? focusStyle({ focused }) : focusStyle;
    return focused ? specificStyle : undefined;
  }, [focused, focusStyle]);

  return {
    onFocusChangeHandler,
    fStyle,
  };
};

const styles = StyleSheet.create({
  defaultHighlight: { backgroundColor: '#dce3f9' },
});
