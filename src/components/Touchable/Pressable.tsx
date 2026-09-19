import {
  Pressable as RNPressable,
  type PressableProps,
  type ViewProps,
  type ViewInstance,
} from 'react-native';

import { withKeyboardFocus } from '../../utils/withKeyboardFocus';
import type { WithKeyboardFocusPropsWithRef } from '../../types';

export const Pressable: ReturnType<
  typeof withKeyboardFocus<PressableProps, unknown, ViewInstance>
> = withKeyboardFocus(RNPressable);

export type KeyboardPressableProps = WithKeyboardFocusPropsWithRef<
  PressableProps,
  ViewProps['style'],
  ViewInstance
>;
