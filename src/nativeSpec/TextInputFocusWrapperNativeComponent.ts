import type { ViewProps, ColorValue } from 'react-native';
import type {
  DirectEventHandler,
  Int32,
} from 'react-native/Libraries/Types/CodegenTypes';
// eslint-disable-next-line @react-native/no-deep-imports
import codegenNativeComponent from 'react-native/Libraries/Utilities/codegenNativeComponent';

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
  haloEffect?: boolean;
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

export default codegenNativeComponent<TextInputFocusWrapperNativeComponent>(
  'TextInputFocusWrapper'
);
