import type { GestureResponderEvent } from 'react-native';

import type { NativeSyntheticEvent, ViewProps } from 'react-native';
import type { FocusStyle } from './FocusStyle';

export type KeyboardFocusEvent = NativeSyntheticEvent<{
  isFocused: boolean;
}>;

export type OnKeyPress = NativeSyntheticEvent<{
  keyCode: number;
  isLongPress: boolean;
  isAltPressed: boolean;
  isShiftPressed: boolean;
  isCtrlPressed: boolean;
  isCapsLockOn: boolean;
  hasNoModifiers: boolean;
}>;

export type OnKeyPressFn = (e: OnKeyPress) => void;
export type OnFocusChangeFn = (e: KeyboardFocusEvent) => void;

export type FocusWrapperProps = ViewProps & {
  onFocusChange?: OnFocusChangeFn;
  onKeyUpPress?: OnKeyPressFn;
  onKeyDownPress?: OnKeyPressFn;
  canBeFocused?: boolean;
};

export type FocusStateCallbackType = {
  readonly focused: boolean;
};

export type KeyboardFocusViewProps = FocusWrapperProps & {
  focusStyle?: FocusStyle;
  onPress?: (e: GestureResponderEvent | OnKeyPress) => void;
  onLongPress?: (e: GestureResponderEvent | OnKeyPress) => void;
  onContextMenuPress?: () => void;
  /**
   * @platform android
   */
  withView?: boolean;
};
