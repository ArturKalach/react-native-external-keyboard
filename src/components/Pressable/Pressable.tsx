import { Pressable as RNPressable } from 'react-native';

import { withKeyboardFocus } from '../../utils/withKeyboardFocus';

export const Pressable = withKeyboardFocus(RNPressable);
