import codegenNativeComponent from 'react-native/Libraries/Utilities/codegenNativeComponent';
import type { ViewProps } from 'react-native';

export interface ExternalKeyboardRootViewProps extends ViewProps {
  viewId: string;
}

export default codegenNativeComponent<ExternalKeyboardRootViewProps>(
  'ExternalKeyboardRootView'
);
