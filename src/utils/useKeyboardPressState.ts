import { useCallback, useState } from 'react';
import { Platform } from 'react-native';

type AnyPressHandler = (event?: any) => void;
type PressableStyleFn = (state: { pressed: boolean }) => unknown;

type UseKeyboardPressStateParams = {
  enabled?: boolean;
  onPressIn?: AnyPressHandler;
  onPressOut?: AnyPressHandler;
  onFocusChange?: (isFocused: boolean) => void;
};

/**
 * Android only. Physical-keyboard activation (Enter / Space / DPad-center) never
 * reaches the touch responder, so a wrapped component's `pressed` stays false.
 * This derives a press state from the key down/up events and returns composable
 * pieces to thread it through focus, press handlers, and function styles.
 *
 * Everything is a no-op unless `enabled` and running on Android, so callers can
 * always wire the returned values unconditionally.
 */
export const useKeyboardPressState = ({
  enabled = false,
  onPressIn,
  onPressOut,
  onFocusChange,
}: UseKeyboardPressStateParams) => {
  const active = enabled && Platform.OS === 'android';
  const [pressed, setPressed] = useState(false);

  const handlePressIn = useCallback(
    (e?: any) => {
      setPressed(true);
      onPressIn?.(e);
    },
    [onPressIn]
  );

  const handlePressOut = useCallback(
    (e?: any) => {
      setPressed(false);
      onPressOut?.(e);
    },
    [onPressOut]
  );

  const handleFocusChange = useCallback(
    (isFocused: boolean) => {
      // Drop a stuck press if focus leaves before the key-up arrives.
      if (!isFocused && active) setPressed(false);
      onFocusChange?.(isFocused);
    },
    [onFocusChange, active]
  );

  // Fold the keyboard press into a `style({ pressed })` function so visual
  // press feedback (`withPressedStyle`, function styles) reacts to the keyboard.
  // Non-function styles and the inactive case are returned untouched.
  const applyPressedStyle = useCallback(
    <S>(style: S): S => {
      if (!active || typeof style !== 'function') return style;
      const styleFn = style as PressableStyleFn;
      return (({ pressed: touchPressed }: { pressed: boolean }) =>
        styleFn({ pressed: touchPressed || pressed })) as S;
    },
    [active, pressed]
  );

  return {
    /** A keyboard-driven press is currently held. */
    pressed: active && pressed,
    /** Pass to the keyboard press hook; the original handlers when inactive. */
    onPressIn: active ? handlePressIn : onPressIn,
    onPressOut: active ? handlePressOut : onPressOut,
    /** Wrap `onFocusChange` to clear a stuck press on blur. */
    onFocusChange: handleFocusChange,
    /** Fold the keyboard press into a function style. */
    applyPressedStyle,
  };
};
