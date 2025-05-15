import type {
  View,
  ViewProps,
  NativeSyntheticEvent,
  ColorValue,
} from 'react-native';
import type { KeyPress } from '../nativeSpec/ExternalKeyboardViewNativeComponent';
import type { RefObject } from 'react';

export type OnKeyPress = NativeSyntheticEvent<KeyPress> & {
  nativeEvent?: { target?: number };
  currentTarget?: { _nativeTag?: number };
};

export type OnKeyPressFn = (e: OnKeyPress) => void;
export type KeyboardFocus = { focus: () => void };
export type BaseKeyboardViewType = Partial<View> & KeyboardFocus;

export type BaseFocusViewProps = {
  viewRef?: RefObject<View>;
  group?: boolean;
  onFocusChange?: (isFocused: boolean, tag?: number) => void;
  onKeyUpPress?: OnKeyPressFn;
  onKeyDownPress?: OnKeyPressFn;
  onContextMenuPress?: () => void;
  onBubbledContextMenuPress?: () => void;
  haloEffect?: boolean;
  autoFocus?: boolean;
  canBeFocused?: boolean;
  focusable?: boolean;
  onFocus?: () => void;
  onBlur?: () => void;
  tintColor?: ColorValue;
  haloCornerRadius?: number;
  haloExpendX?: number;
  haloExpendY?: number;
  groupIdentifier?: string;
  ignoreGroupFocusHint?: boolean;
  exposeMethods?: string[];
  enableA11yFocus?: boolean;
  screenAutoA11yFocus?: boolean;
  screenAutoA11yFocusDelay?: number;
};

export type BaseKeyboardViewProps = ViewProps & BaseFocusViewProps;
