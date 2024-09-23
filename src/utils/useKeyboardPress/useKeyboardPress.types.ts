import type { OnKeyPressFn } from '../../types/BaseKeyboardView';
import type { PressType } from '../../types/WithKeyboardFocus';

export type UseKeyboardPressProps = {
  onKeyUpPress?: OnKeyPressFn;
  onKeyDownPress?: OnKeyPressFn;
  onLongPress?: PressType;
  onPress?: PressType;
  onPressIn?: PressType;
  onPressOut?: PressType;
};
