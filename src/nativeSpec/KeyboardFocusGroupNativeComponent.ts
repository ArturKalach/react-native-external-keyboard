import {
  codegenNativeComponent,
  type ViewProps,
  type ColorValue,
  type HostComponent,
} from 'react-native';
import type { DirectEventHandler } from 'react-native/Libraries/Types/CodegenTypes';

export type FocusChange = Readonly<{
  isFocused: boolean;
}>;

export interface KeyboardFocusGroupNativeComponentProps extends ViewProps {
  onGroupFocusChange?: DirectEventHandler<FocusChange>;
  tintColor?: ColorValue;
  groupIdentifier?: string;
  orderGroup?: string;
}

const KeyboardFocusGroupNativeComponent: HostComponent<KeyboardFocusGroupNativeComponentProps> =
  codegenNativeComponent<KeyboardFocusGroupNativeComponentProps>(
    'KeyboardFocusGroup'
  );

export default KeyboardFocusGroupNativeComponent;
