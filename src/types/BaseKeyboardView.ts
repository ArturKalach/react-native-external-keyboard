import type { View, ViewProps, NativeSyntheticEvent } from 'react-native';
import type { KeyPress } from '../nativeSpec/ExternalKeyboardViewNativeComponent';

export type OnKeyPress = NativeSyntheticEvent<KeyPress>;

export type OnKeyPressFn = (e: OnKeyPress) => void;
export type KeyboardFocus = { focus: () => void };
export type BaseKeyboardViewType = Partial<View> & KeyboardFocus;
export type BaseKeyboardViewProps = ViewProps & {
  onFocusChange?: (isFocused: boolean) => void;
  onKeyUpPress?: OnKeyPressFn;
  onKeyDownPress?: OnKeyPressFn;
  onContextMenuPress?: () => void;
  haloEffect?: boolean;
  autoFocus?: boolean;
  canBeFocused?: boolean;
  focusable?: boolean;
  onFocus?: () => void;
  onBlur?: () => void;
  tintColor?: string;
};
