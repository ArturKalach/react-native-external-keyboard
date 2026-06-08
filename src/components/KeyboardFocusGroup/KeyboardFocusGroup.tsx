import { View } from 'react-native';
import type { KeyboardFocusGroupProps } from './KeyboardFocusGroup.types';

export type { KeyboardFocusGroupProps };

export const KeyboardFocusGroup =
  View as unknown as React.FC<KeyboardFocusGroupProps>;
