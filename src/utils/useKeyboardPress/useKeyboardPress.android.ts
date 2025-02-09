import { useCallback, useMemo, useRef } from 'react';
import type { GestureResponderEvent } from 'react-native';
import type { UseKeyboardPressProps } from './useKeyboardPress.types';
import type { OnKeyPress, OnKeyPressFn } from '../../types/BaseKeyboardView';

export const ANDROID_SPACE_KEY_CODE = 62;
const MILISECOND_THRESHOLD = 20;

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
  const tresholdTime = useRef(0);
  const onKeyUpPressHandler = useCallback<OnKeyPressFn>(
    (e) => {
      const {
        nativeEvent: { keyCode, isLongPress },
      } = e;

      onPressOut?.(e as unknown as GestureResponderEvent);
      onKeyUpPress?.(e);

      if (keyCode === ANDROID_SPACE_KEY_CODE) {
        if (isLongPress) {
          tresholdTime.current = e?.timeStamp;
          onLongPress?.({} as GestureResponderEvent);
        }
      }
    },
    [onPressOut, onKeyUpPress, onLongPress]
  );

  const onKeyDownPressHandler = useMemo(() => {
    if (!onPressIn) return onKeyDownPress;
    return (e: OnKeyPress) => {
      onKeyDownPress?.(e);
      if (e.nativeEvent.keyCode === ANDROID_SPACE_KEY_CODE) {
        onPressIn?.(e as unknown as GestureResponderEvent);
      }
    };
  }, [onKeyDownPress, onPressIn]);

  const onPressHandler = useCallback(
    (event: GestureResponderEvent) => {
      const pressThreshold = (event?.timeStamp ?? 0) - tresholdTime.current;
      if (pressThreshold > MILISECOND_THRESHOLD) {
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
