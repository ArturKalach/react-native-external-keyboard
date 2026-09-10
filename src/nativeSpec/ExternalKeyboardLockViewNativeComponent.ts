import { codegenNativeComponent, type ViewProps } from 'react-native';
import type { Int32 } from 'react-native/Libraries/Types/CodegenTypes';

export interface ExternalKeyboardLockViewNativeComponentProps extends ViewProps {
  componentType: Int32;
  lockDisabled?: boolean;
  forceLock?: boolean;
}

export default codegenNativeComponent<ExternalKeyboardLockViewNativeComponentProps>(
  'ExternalKeyboardLockView'
);
