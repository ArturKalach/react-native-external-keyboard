import { useMemo } from 'react';
import type { UseKeyboardPressProps } from './useKeyboardPress.types';
import type { OnKeyPress } from '../../types/BaseKeyboardView';

const IOS_SPACE_KEY = 44;

export const useKeyboardPress = <
  T extends (event?: any) => void,
  K extends (event?: any) => void,
>({
  onKeyUpPress,
  onKeyDownPress,
  onPress,
  onPressIn,
  onPressOut,
}: UseKeyboardPressProps<T, K>) => {
  const onKeyUpPressHandler = useMemo(() => {
    if (!onPressOut) return onKeyUpPress;
    return (e: OnKeyPress) => {
      onKeyUpPress?.(e);
      if (e.nativeEvent.keyCode === IOS_SPACE_KEY) {
        onPressOut?.(e);
      }
    };
  }, [onKeyUpPress, onPressOut]);

  const onKeyDownPressHandler = useMemo(() => {
    if (!onPressIn) return onKeyDownPress;
    return (e: OnKeyPress) => {
      onKeyDownPress?.(e);
      if (e.nativeEvent.keyCode === IOS_SPACE_KEY) {
        onPressIn?.(e);
      }
    };
  }, [onKeyDownPress, onPressIn]);

  return {
    onKeyUpPressHandler,
    onKeyDownPressHandler,
    onPressHandler: onPress,
  };
};
