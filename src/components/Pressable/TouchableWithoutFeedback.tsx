import { TouchableWithoutFeedback as RNTouchableWithoutFeedback } from 'react-native';

import { withKeyboardFocus } from '../../utils/withKeyboardFocus';

export const TouchableWithoutFeedback = withKeyboardFocus(
  RNTouchableWithoutFeedback
);
