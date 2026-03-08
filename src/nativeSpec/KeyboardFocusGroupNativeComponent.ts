import type { ViewProps, ColorValue } from 'react-native';
import type { DirectEventHandler } from 'react-native/Libraries/Types/CodegenTypes';
// eslint-disable-next-line @react-native/no-deep-imports
import codegenNativeComponent from 'react-native/Libraries/Utilities/codegenNativeComponent';

export type FocusChange = Readonly<{
  isFocused: boolean;
}>;

export interface KeyboardFocusGroupNativeComponentProps extends ViewProps {
  onGroupFocusChange?: DirectEventHandler<FocusChange>;
  tintColor?: ColorValue;
  groupIdentifier?: string;
  orderGroup?: string;
}

export default codegenNativeComponent<KeyboardFocusGroupNativeComponentProps>(
  'KeyboardFocusGroup'
);
