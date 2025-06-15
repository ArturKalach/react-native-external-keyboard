import codegenNativeComponent from 'react-native/Libraries/Utilities/codegenNativeComponent';
import type { ColorValue, ViewProps } from 'react-native';
import type {
  BubblingEventHandler,
  DirectEventHandler,
  Float,
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
  onBubbledContextMenuPress?: BubblingEventHandler<{}>;
  canBeFocused?: boolean;
  hasKeyDownPress?: boolean;
  hasKeyUpPress?: boolean;
  hasOnFocusChanged?: boolean;
  autoFocus?: boolean;
  haloEffect?: boolean;
  haloCornerRadius?: Float;
  haloExpendX?: Float;
  haloExpendY?: Float;
  tintColor?: ColorValue;
  group?: boolean;
  groupIdentifier?: string;
  enableA11yFocus?: boolean;
  screenAutoA11yFocus?: boolean;
  screenAutoA11yFocusDelay?: Int32;
  orderGroup?: string;
  orderIndex?: Int32;
  lockFocus?: Int32;
  orderId?: string;
  orderLeft?: string;
  orderRight?: string;
  orderUp?: string;
  orderDown?: string;
  orderForward?: string;
  orderBackward?: string;
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
