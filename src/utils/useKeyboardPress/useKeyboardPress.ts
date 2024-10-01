import { useMemo } from 'react';
import type { GestureResponderEvent } from 'react-native';
import type { UseKeyboardPressProps } from './useKeyboardPress.types';
import type { OnKeyPress } from '../../types/BaseKeyboardView';

const IOS_SPACE_KEY = 44;

export const useKeyboardPress = ({
  onKeyUpPress,
  onKeyDownPress,
  onPress,
  onPressIn,
  onPressOut,
}: UseKeyboardPressProps<(e?: any) => void>) => {
  const onKeyUpPressHandler = useMemo(() => {
    if (!onPressOut) return onKeyUpPress;
    return (e: OnKeyPress) => {
      onKeyUpPress?.(e);
      if (e.nativeEvent.keyCode === IOS_SPACE_KEY) {
        onPressOut?.(e as unknown as GestureResponderEvent);
      }
    };
  }, [onKeyUpPress, onPressOut]);

  const onKeyDownPressHandler = useMemo(() => {
    if (!onPressIn) return onKeyDownPress;
    return (e: OnKeyPress) => {
      onKeyDownPress?.(e);
      if (e.nativeEvent.keyCode === IOS_SPACE_KEY) {
        onPressIn?.(e as unknown as GestureResponderEvent);
      }
    };
  }, [onKeyDownPress, onPressIn]);

  return {
    onKeyUpPressHandler,
    onKeyDownPressHandler,
    onPressHandler: onPress,
  };
};
