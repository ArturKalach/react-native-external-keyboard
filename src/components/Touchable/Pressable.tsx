import {
  Pressable as RNPressable,
  type PressableProps,
  type ViewProps,
  type View,
} from 'react-native';

import { withKeyboardFocus } from '../../utils/withKeyboardFocus';
import type { WithKeyboardFocusPropsWithRef } from '../../types';

export const Pressable = withKeyboardFocus(RNPressable);

export type KeyboardPressableProps = WithKeyboardFocusPropsWithRef<
  PressableProps,
  ViewProps['style'],
  View
>;
