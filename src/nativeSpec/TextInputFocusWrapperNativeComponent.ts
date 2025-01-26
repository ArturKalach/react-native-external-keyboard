import codegenNativeComponent from 'react-native/Libraries/Utilities/codegenNativeComponent';
import type { ViewProps, ColorValue } from 'react-native';
import type {
  DirectEventHandler,
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
  haloEffect?: boolean;
  tintColor?: ColorValue;
  blurOnSubmit?: boolean;
  multiline?: boolean;
  groupIdentifier?: string;
}

export default codegenNativeComponent<TextInputFocusWrapperNativeComponent>(
  'TextInputFocusWrapper'
);
