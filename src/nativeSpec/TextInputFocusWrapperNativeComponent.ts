import codegenNativeComponent from 'react-native/Libraries/Utilities/codegenNativeComponent';
import type { ViewProps } from 'react-native';
import type {
  BubblingEventHandler,
  Int32,
} from 'react-native/Libraries/Types/CodegenTypes';

export type FocusChange = Readonly<{
  isFocused: boolean;
}>;

export interface TextInputFocusWrapperNativeComponent extends ViewProps {
  onFocusChange?: BubblingEventHandler<FocusChange>;
  focusType?: Int32;
  blurType?: Int32;
  canBeFocused?: boolean;
  haloEffect?: boolean;
}

export default codegenNativeComponent<TextInputFocusWrapperNativeComponent>(
  'TextInputFocusWrapper'
);
