import { useCallback } from 'react';
import type { GestureResponderEvent } from 'react-native';
import type { UseKeyboardPressProps } from './useKeyboardPress.types';

//ToDo RNCEKV-5
import type { OnKeyPressFn } from 'src/types/BaseKeyboardView';

export const ANDROID_SPACE_KEY_CODE = 62;

export const useKeyboardPress = ({
  onKeyUpPress,
  onLongPress,
  onPress,
}: UseKeyboardPressProps) => {
  const onKeyUpPressHandler = useCallback<OnKeyPressFn>(
    (e) => {
      const {
        nativeEvent: { keyCode, isLongPress },
      } = e;
      onKeyUpPress?.(e);
      if (keyCode === ANDROID_SPACE_KEY_CODE) {
        if (isLongPress) {
          onLongPress?.({} as GestureResponderEvent);
        } else {
          onPress?.({} as GestureResponderEvent);
        }
      }
    },
    [onLongPress, onPress, onKeyUpPress]
  );

  const onPressHandler = useCallback(
    (event: GestureResponderEvent) => {
      if (event.nativeEvent.identifier !== undefined) {
        onPress?.(event);
      }
    },
    [onPress]
  );

  const hasHandler = onKeyUpPress || onLongPress || onPress;
  return {
    onKeyUpPressHandler: hasHandler && onKeyUpPressHandler,
    onPressHandler: onPress && onPressHandler,
  };
};
