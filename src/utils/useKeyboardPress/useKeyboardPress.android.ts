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

const MILLISECOND_THRESHOLD = 20;

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
  const thresholdTime = useRef(0);
  const onKeyUpPressHandler = useCallback<OnKeyPressFn>(
    (e) => {
      const {
        nativeEvent: { keyCode, isLongPress },
      } = e;

      onPressOut?.(e as unknown as GestureResponderEvent);
      onKeyUpPress?.(e);

      if (triggerCodes.includes(keyCode)) {
        if (isLongPress) {
          thresholdTime.current = e?.timeStamp;
          onLongPress?.({} as GestureResponderEvent);
        }
      }
    },
    [onPressOut, onKeyUpPress, triggerCodes, onLongPress]
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
      const pressThreshold = (event?.timeStamp ?? 0) - thresholdTime.current;
      if (pressThreshold > MILLISECOND_THRESHOLD) {
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
