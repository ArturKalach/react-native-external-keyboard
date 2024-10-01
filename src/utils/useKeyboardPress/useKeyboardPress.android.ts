import { useCallback, useMemo } from 'react';
import type { GestureResponderEvent } from 'react-native';
import type { UseKeyboardPressProps } from './useKeyboardPress.types';

//ToDo RNCEKV-5
import type { OnKeyPress, OnKeyPressFn } from '../../types/BaseKeyboardView';

export const ANDROID_SPACE_KEY_CODE = 62;

export const useKeyboardPress = ({
  onKeyUpPress,
  onKeyDownPress,
  onPressIn,
  onPressOut,
  onPress,
  onLongPress,
}: UseKeyboardPressProps<(e?: object) => void>) => {
  const onKeyUpPressHandler = useCallback<OnKeyPressFn>(
    (e) => {
      const {
        nativeEvent: { keyCode, isLongPress },
      } = e;

      onPressOut?.(e as unknown as GestureResponderEvent);
      onKeyUpPress?.(e);

      if (keyCode === ANDROID_SPACE_KEY_CODE) {
        if (isLongPress) {
          onLongPress?.({} as GestureResponderEvent);
        } else {
          onPress?.({} as GestureResponderEvent);
        }
      }
    },
    [onPressOut, onKeyUpPress, onLongPress, onPress]
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
      if (event.nativeEvent.identifier !== undefined) {
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
