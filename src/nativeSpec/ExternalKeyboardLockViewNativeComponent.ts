import {
  codegenNativeComponent,
  type HostComponent,
  type ViewProps,
} from 'react-native';
import type { Int32 } from 'react-native/Libraries/Types/CodegenTypes';

export interface ExternalKeyboardLockViewNativeComponentProps extends ViewProps {
  componentType: Int32;
  lockDisabled?: boolean;
  forceLock?: boolean;
}

const ExternalKeyboardLockViewNativeComponent: HostComponent<ExternalKeyboardLockViewNativeComponentProps> =
  codegenNativeComponent<ExternalKeyboardLockViewNativeComponentProps>(
    'ExternalKeyboardLockView'
  );

export default ExternalKeyboardLockViewNativeComponent;
