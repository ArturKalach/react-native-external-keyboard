import {
  TouchableOpacity as RNTouchableOpacity,
  TouchableWithoutFeedback as RNTouchableWithoutFeedback,
  Pressable as RNPressable,
} from 'react-native';

import { withKeyboardFocus } from '../../utils/withKeyboardFocus';

export const TouchableOpacity = withKeyboardFocus(RNTouchableOpacity);
export const TouchableWithoutFeedback = withKeyboardFocus(
  RNTouchableWithoutFeedback
);
export const Pressable = withKeyboardFocus(RNPressable);
