import codegenNativeComponent from 'react-native/Libraries/Utilities/codegenNativeComponent';
import type { ViewProps } from 'react-native';
import type {
  BubblingEventHandler,
  Int32,
} from 'react-native/Libraries/Types/CodegenTypes';

export type FocusChange = Readonly<{
  isFocused: boolean;
}>;

export type EnterPress = Readonly<{
  isShiftPressed: boolean;
  isAltPressed: boolean;
  isEnterPress: boolean;
}>;

export type KeyPress = Readonly<{
  keyCode: Int32;
  unicode: Int32;
  unicodeChar: string;
  isLongPress: boolean;
  isAltPressed: boolean;
  isShiftPressed: boolean;
  isCtrlPressed: boolean;
  isCapsLockOn: boolean;
  hasNoModifiers: boolean;
}>;

export interface ExternalKeyboardNativeProps extends ViewProps {
  onFocusChange?: BubblingEventHandler<FocusChange>;
  onKeyUpPress?: BubblingEventHandler<KeyPress>;
  onKeyDownPress?: BubblingEventHandler<KeyPress>;
  canBeFocused?: boolean;
}

export default codegenNativeComponent<ExternalKeyboardNativeProps>(
  'ExternalKeyboardView'
);
