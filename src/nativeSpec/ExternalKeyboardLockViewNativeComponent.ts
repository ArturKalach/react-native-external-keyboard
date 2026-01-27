import type { ViewProps } from 'react-native';
import type { Int32 } from 'react-native/Libraries/Types/CodegenTypes';
import codegenNativeComponent from 'react-native/Libraries/Utilities/codegenNativeComponent';

export interface ExternalKeyboardLockViewNativeComponentProps
  extends ViewProps {
  componentType: Int32;
  lockDisabled?: boolean;
}

export default codegenNativeComponent<ExternalKeyboardLockViewNativeComponentProps>(
  'ExternalKeyboardLockView'
);
