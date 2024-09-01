import type { View } from 'react-native';
import type { ExternalKeyboardNativeProps } from '../nativeSpec/ExternalKeyboardViewNativeComponent';

export type ExternalKeyboardViewType = Partial<View> & { focus: () => void };
export type ExternalKeyboardViewProps = Omit<
  ExternalKeyboardNativeProps,
  'autoFocus'
> & { autoFocus?: boolean; focusable?: boolean };
