import type { OnKeyPressFn } from '../../types/BaseKeyboardView';
import type { PressType } from '../../types/WithKeyboardFocus';

export type UseKeyboardPressProps<T extends object> = {
  onKeyUpPress?: OnKeyPressFn;
  onKeyDownPress?: OnKeyPressFn;
  onLongPress?: PressType<T>;
  onPress?: PressType<T>;
  onPressIn?: PressType<T>;
  onPressOut?: PressType<T>;
};
