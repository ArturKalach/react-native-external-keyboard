import type { UseKeyboardPressProps } from './useKeyboardPress.types';

export const useKeyboardPress = ({
  onKeyUpPress,
  onPress,
}: UseKeyboardPressProps) => ({
  onKeyUpPressHandler: onKeyUpPress,
  onPressHandler: onPress,
});
