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
  const pressInRef = useRef<number | undefined>(undefined);

  const onPressHandler = useCallback(
    (event: GestureResponderEvent) => {
      if (!onLongPress || !pressInRef.current) {
        onPress?.(event);
      }
    },
    [onLongPress, onPress]
  );

  const onKeyDownPressHandler = useMemo(() => {
    if (!onPressIn && !onLongPress) return onKeyDownPress;
    return (e: OnKeyPress) => {
      pressInRef.current = new Date().getTime();
      onKeyDownPress?.(e);
      if (triggerCodes.includes(e.nativeEvent.keyCode)) {
        onPressIn?.(e as unknown as GestureResponderEvent);
      }
    };
  }, [onKeyDownPress, onLongPress, onPressIn, triggerCodes]);

  const onKeyUpPressHandler = useCallback<OnKeyPressFn>(
    (e) => {
      const {
        nativeEvent: { keyCode, isLongPress },
      } = e;

      onPressOut?.(e as unknown as GestureResponderEvent);
      onKeyUpPress?.(e);

      if (triggerCodes.includes(keyCode)) {
        if (isLongPress) {
          onLongPress?.({} as GestureResponderEvent);
        } else {
          onPress?.();
        }
      }
      pressInRef.current = undefined;
    },
    [onPressOut, onKeyUpPress, triggerCodes, onLongPress, onPress]
  );

  return {
    onPressHandler: onPress && onLongPress ? onPressHandler : onPress,
    onKeyDownPressHandler,
    onKeyUpPressHandler,
  };
};
