import { useCallback, useMemo, useRef } from 'react';
import type { GestureResponderEvent } from 'react-native';
import type { UseKeyboardPressProps } from './useKeyboardPress.types';
import type { OnKeyPress, OnKeyPressFn } from '../../types/BaseKeyboardView';

export const ANDROID_SPACE_KEY_CODE = 62;

export const useKeyboardPress = <
  T extends (event?: any) => void,
  K extends (event?: any) => void,
>({
  onKeyUpPress,
  onKeyDownPress,
  onPressIn,
  onPressOut,
  onPress,
  onLongPress,
}: UseKeyboardPressProps<T, K>) => {
  const keyboardBased = useRef(false);
  const onKeyUpPressHandler = useCallback<OnKeyPressFn>(
    (e) => {
      const {
        nativeEvent: { keyCode, isLongPress },
      } = e;

      onPressOut?.(e as unknown as GestureResponderEvent);
      onKeyUpPress?.(e);

      if (onLongPress && keyCode === ANDROID_SPACE_KEY_CODE) {
        if (isLongPress) {
          onLongPress?.({} as GestureResponderEvent);
        } else {
          onPress?.({} as GestureResponderEvent);
        }
      }
      keyboardBased.current = false;
    },
    [onPressOut, onKeyUpPress, onLongPress, onPress]
  );

  const onKeyDownPressHandler = useMemo(() => {
    if (!onPressIn && !onPress) return onKeyDownPress;
    return (e: OnKeyPress) => {
      keyboardBased.current = true;

      onKeyDownPress?.(e);
      if (e.nativeEvent.keyCode === ANDROID_SPACE_KEY_CODE) {
        onPressIn?.(e as unknown as GestureResponderEvent);
      }
    };
  }, [onKeyDownPress, onPress, onPressIn]);

  const onPressHandler = useCallback(
    (event: GestureResponderEvent) => {
      if (!keyboardBased.current) {
        onPress?.(event);
      }
    },
    [onPress]
  );

  const hasHandler = onPressOut || onKeyUpPress || onLongPress || onPress;
  return {
    onKeyUpPressHandler: hasHandler && onKeyUpPressHandler,
    onKeyDownPressHandler,
    onPressHandler: onPress && onPressHandler,
  };
};
