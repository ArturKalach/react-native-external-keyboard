import codegenNativeComponent from 'react-native/Libraries/Utilities/codegenNativeComponent';
import type { ColorValue, ViewProps } from 'react-native';
import type {
  DirectEventHandler,
  Int32,
} from 'react-native/Libraries/Types/CodegenTypes';
import type { ComponentType } from 'react';
import codegenNativeCommands from 'react-native/Libraries/Utilities/codegenNativeCommands';

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
  onFocusChange?: DirectEventHandler<FocusChange>;
  onKeyUpPress?: DirectEventHandler<KeyPress>;
  onKeyDownPress?: DirectEventHandler<KeyPress>;
  onContextMenuPress?: DirectEventHandler<{}>;
  canBeFocused?: boolean;
  hasKeyDownPress?: boolean;
  hasKeyUpPress?: boolean;
  hasOnFocusChanged?: boolean;
  autoFocus?: boolean;
  haloEffect?: boolean;
  tintColor?: ColorValue;
  group?: boolean;
}

export interface NativeCommands {
  focus: (viewRef: React.ElementRef<ComponentType>) => void;
}

export const Commands: NativeCommands = codegenNativeCommands<NativeCommands>({
  supportedCommands: ['focus'],
});

export default codegenNativeComponent<ExternalKeyboardNativeProps>(
  'ExternalKeyboardView'
);
