import type { OnKeyPressFn } from '../../types/BaseKeyboardView';

export type UseKeyboardPressProps<T, K> = {
  onKeyUpPress?: OnKeyPressFn;
  onKeyDownPress?: OnKeyPressFn;
  onLongPress?: T;
  onPress?: T;
  onPressIn?: K;
  onPressOut?: K;
};
