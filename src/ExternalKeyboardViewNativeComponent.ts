import type { ViewProps } from 'react-native';
import codegenNativeComponent from 'react-native/Libraries/Utilities/codegenNativeComponent';
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
  isLongPress: boolean;
  isAltPressed: boolean;
  isShiftPressed: boolean;
  isCtrlPressed: boolean;
  isCapsLockOn: boolean;
  hasNoModifiers: boolean;
}>;

export interface NativeProps extends ViewProps {
  onFocusChange?: BubblingEventHandler<FocusChange>;
  onKeyUpPress?: BubblingEventHandler<KeyPress>;
  onKeyDownPress?: BubblingEventHandler<KeyPress>;
  canBeFocused?: boolean;
}
export default codegenNativeComponent<NativeProps>('ExternalKeyboardView');
