import codegenNativeComponent from 'react-native/Libraries/Utilities/codegenNativeComponent';
import type { ViewProps, ColorValue } from 'react-native';
import type {
  DirectEventHandler,
  Int32,
} from 'react-native/Libraries/Types/CodegenTypes';

export type FocusChange = Readonly<{
  isFocused: boolean;
}>;

export interface TextInputFocusWrapperNativeComponent extends ViewProps {
  onFocusChange?: DirectEventHandler<FocusChange>;
  onMultiplyTextSubmit?: DirectEventHandler<{}>;
  focusType?: Int32;
  blurType?: Int32;
  canBeFocused?: boolean;
  haloEffect?: boolean;
  tintColor?: ColorValue;
  blurOnSubmit?: boolean;
  multiline?: boolean;
}

export default codegenNativeComponent<TextInputFocusWrapperNativeComponent>(
  'TextInputFocusWrapper'
);
