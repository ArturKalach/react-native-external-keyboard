import { TouchableOpacity as RNTouchableOpacity } from 'react-native';

import { withKeyboardFocus } from '../../utils/withKeyboardFocus';

export const TouchableOpacity = withKeyboardFocus(RNTouchableOpacity);
