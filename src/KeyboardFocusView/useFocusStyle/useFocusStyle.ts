import { useState, useMemo } from 'react';
import type { NativeSyntheticEvent } from 'react-native';
import { StyleProp, ViewStyle, StyleSheet } from 'react-native';

export type FocusStateCallbackType = {
  readonly focused: boolean;
};

export type FocusStyle =
  | StyleProp<ViewStyle>
  | ((state: FocusStateCallbackType) => StyleProp<ViewStyle>)
  | undefined;

export type KeyboardFocusEvent = NativeSyntheticEvent<{
  isFocused: boolean;
}>;
export type OnFocusChangeFn = (e: KeyboardFocusEvent) => void;

export const useFocusStyle = (
  focusStyle?: FocusStyle,
  onFocusChange?: OnFocusChangeFn
) => {
  const [focused, setFocusStatus] = useState(false);

  const onFocusChangeHandler: OnFocusChangeFn = (event) => {
    setFocusStatus(event.nativeEvent.isFocused);
    onFocusChange?.(event);
  };

  const fStyle = useMemo(() => {
    if (!focusStyle) return focused ? styles.defaultHighlight : undefined;
    return typeof focusStyle === 'function'
      ? focusStyle({ focused })
      : focusStyle;
  }, [focused, focusStyle]);

  return {
    onFocusChangeHandler,
    fStyle,
  };
};

const styles = StyleSheet.create({
  defaultHighlight: { backgroundColor: '#9999' },
});
