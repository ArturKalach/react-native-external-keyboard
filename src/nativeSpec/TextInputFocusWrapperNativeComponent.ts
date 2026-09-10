import {
  codegenNativeComponent,
  type ViewProps,
  type ColorValue,
  type HostComponent,
} from 'react-native';
import type {
  DirectEventHandler,
  Float,
  Int32,
} from 'react-native/Libraries/Types/CodegenTypes';

export type FocusChange = Readonly<{
  isFocused: boolean;
}>;

export type MultiplyTextSubmit = Readonly<{
  text: string;
}>;

export interface TextInputFocusWrapperNativeComponent extends ViewProps {
  onFocusChange?: DirectEventHandler<FocusChange>;
  onMultiplyTextSubmit?: DirectEventHandler<MultiplyTextSubmit>;
  focusType?: Int32;
  blurType?: Int32;
  canBeFocused?: boolean;
  hasOnFocusChanged?: boolean;
  haloEffect?: boolean;
  haloCornerRadius?: Float;
  haloExpendX?: Float;
  haloExpendY?: Float;
  roundedHaloFix?: boolean;
  tintColor?: ColorValue;
  blurOnSubmit?: boolean;
  multiline?: boolean;
  groupIdentifier?: string;
  lockFocus?: Int32;
  orderGroup?: string;
  orderIndex?: Int32;
  orderId?: string;
  orderLeft?: string;
  orderRight?: string;
  orderUp?: string;
  orderDown?: string;
  orderForward?: string;
  orderBackward?: string;
  orderFirst?: string;
  orderLast?: string;
}

const TextInputFocusWrapperHostComponent: HostComponent<TextInputFocusWrapperNativeComponent> =
  codegenNativeComponent<TextInputFocusWrapperNativeComponent>(
    'TextInputFocusWrapper'
  );

export default TextInputFocusWrapperHostComponent;
