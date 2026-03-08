import { Pressable as RNPressable, type PressableProps } from 'react-native';

import { withKeyboardFocus } from '../../utils/withKeyboardFocus';
import type { WithKeyboardPropsTypeDeclaration } from '../../types/WithKeyboardFocus';

export const Pressable = withKeyboardFocus(RNPressable);

export type KeyboardPressableProps =
  WithKeyboardPropsTypeDeclaration<PressableProps>;
