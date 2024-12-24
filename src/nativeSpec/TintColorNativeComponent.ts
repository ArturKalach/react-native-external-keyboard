import codegenNativeComponent from 'react-native/Libraries/Utilities/codegenNativeComponent';
import type { ViewProps, ColorValue } from 'react-native';

export interface TintColorNativeProps extends ViewProps {
  tintColor?: ColorValue;
}

export default codegenNativeComponent<TintColorNativeProps>('TintColorView');
