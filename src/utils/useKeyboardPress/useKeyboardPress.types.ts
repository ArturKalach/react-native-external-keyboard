import type { OnKeyPressFn } from '../../types';

export type UseKeyboardPressProps<T, K> = {
  triggerCodes?: number[];
  onKeyUpPress?: OnKeyPressFn;
  onKeyDownPress?: OnKeyPressFn;
  onLongPress?: T;
  onPress?: T;
  onPressIn?: K;
  onPressOut?: K;
};
