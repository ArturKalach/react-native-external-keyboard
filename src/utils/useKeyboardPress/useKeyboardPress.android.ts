import { useCallback, useMemo, useRef } from 'react';
import type { GestureResponderEvent } from 'react-native';
import type { UseKeyboardPressProps } from './useKeyboardPress.types';
import type { OnKeyPress, OnKeyPressFn } from '../../types/BaseKeyboardView';

export const ANDROID_SPACE_KEY_CODE = 62;
export const ANDROID_DPAD_CENTER_CODE = 23;
export const ANDROID_ENTER_CODE = 66;

export const ANDROID_TRIGGER_CODES = [
  ANDROID_SPACE_KEY_CODE,
  ANDROID_DPAD_CENTER_CODE,
  ANDROID_ENTER_CODE,
];

const useDebouncedCallback = <T extends (...args: any[]) => void>(
  callback: T,
  delay: number
) => {
  const timeoutRef = useRef<ReturnType<typeof setTimeout>>();
  return useCallback(
    (...args: Parameters<T>) => {
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
      timeoutRef.current = setTimeout(() => {
        callback(...args);
      }, delay);
    },
    [callback, delay]
  );
};

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
  triggerCodes = ANDROID_TRIGGER_CODES,
}: UseKeyboardPressProps<T, K>) => {
  const isLongPressRef = useRef(false);

  const debouncedOnPress = useDebouncedCallback(
    (event?: GestureResponderEvent) => {
      if (isLongPressRef.current) {
        onLongPress?.();
      } else {
        onPress?.(event);
      }
      isLongPressRef.current = false;
    },
    40
  );

  const onKeyUpPressHandler = useCallback<OnKeyPressFn>(
    (e) => {
      const {
        nativeEvent: { keyCode, isLongPress },
      } = e;

      onPressOut?.(e as unknown as GestureResponderEvent);
      onKeyUpPress?.(e);

      if (triggerCodes.includes(keyCode)) {
        if (isLongPress) {
          isLongPressRef.current = true;
          debouncedOnPress();
        }
      }
    },
    [onPressOut, onKeyUpPress, triggerCodes, debouncedOnPress]
  );

  const onKeyDownPressHandler = useMemo(() => {
    if (!onPressIn) return onKeyDownPress;
    return (e: OnKeyPress) => {
      onKeyDownPress?.(e);
      if (triggerCodes.includes(e.nativeEvent.keyCode)) {
        onPressIn?.(e as unknown as GestureResponderEvent);
      }
    };
  }, [onKeyDownPress, onPressIn, triggerCodes]);

  const onPressHandler = useCallback(
    (event: GestureResponderEvent) => {
      debouncedOnPress(event);
    },
    [debouncedOnPress]
  );

  const hasHandler = onPressOut || onKeyUpPress || onLongPress || onPress;
  return {
    onKeyUpPressHandler: hasHandler ? onKeyUpPressHandler : undefined,
    onKeyDownPressHandler,
    onPressHandler: onPress ? onPressHandler : undefined,
  };
};
