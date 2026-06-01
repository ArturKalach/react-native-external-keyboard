import { useMemo } from 'react';
import type { UseKeyboardPressProps } from './useKeyboardPress.types';
import type { OnKeyPress } from '../../types';

const IOS_SPACE_KEY = 44;
const IOS_RETURN_OR_ENTER = 40;

const IOS_TRIGGER_CODES = [IOS_SPACE_KEY, IOS_RETURN_OR_ENTER];

export const useKeyboardPress = <
  T extends (event?: any) => void,
  K extends (event?: any) => void
>({
  onKeyUpPress,
  onKeyDownPress,
  onPress,
  onLongPress,
  onPressIn,
  onPressOut,
  triggerCodes = IOS_TRIGGER_CODES,
}: UseKeyboardPressProps<T, K>) => {
  const onKeyUpPressHandler = useMemo(() => {
    return (e: OnKeyPress) => {
      onKeyUpPress?.(e);
      if (triggerCodes.includes(e.nativeEvent.keyCode)) {
        onPressOut?.(e);
        if (e.nativeEvent.isLongPress) {
          onLongPress?.({} as any);
        } else {
          onPress?.({} as any);
        }
      }
    };
  }, [onKeyUpPress, onLongPress, onPress, onPressOut, triggerCodes]);

  const onKeyDownPressHandler = useMemo(() => {
    if (!onPressIn) return onKeyDownPress;
    return (e: OnKeyPress) => {
      onKeyDownPress?.(e);
      if (triggerCodes.includes(e.nativeEvent.keyCode)) {
        onPressIn?.(e);
      }
    };
  }, [onKeyDownPress, onPressIn, triggerCodes]);

  return {
    onKeyUpPressHandler,
    onKeyDownPressHandler,
    onPressHandler: onPress,
  };
};
