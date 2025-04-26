import { useMemo } from 'react';
import type { UseKeyboardPressProps } from './useKeyboardPress.types';
import type { OnKeyPress } from '../../types/BaseKeyboardView';

const IOS_SPACE_KEY = 44;
const IOS_RETURN_OR_ENTER = 40;

const IOS_TRIGGER_CODES = [IOS_SPACE_KEY, IOS_RETURN_OR_ENTER];

export const useKeyboardPress = <
  T extends (event?: any) => void,
  K extends (event?: any) => void,
>({
  onKeyUpPress,
  onKeyDownPress,
  onPress,
  onPressIn,
  onPressOut,
  triggerCodes = IOS_TRIGGER_CODES,
}: UseKeyboardPressProps<T, K>) => {
  const onKeyUpPressHandler = useMemo(() => {
    if (!onPressOut) return onKeyUpPress;
    return (e: OnKeyPress) => {
      onKeyUpPress?.(e);
      if (triggerCodes.includes(e.nativeEvent.keyCode)) {
        onPressOut?.(e);
      }
    };
  }, [onKeyUpPress, onPressOut, triggerCodes]);

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
