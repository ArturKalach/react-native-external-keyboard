import { View, PressableProps } from 'react-native';

import type { KeyboardFocusViewProps } from '../../types';

export const Pressable = View as unknown as React.ForwardRefExoticComponent<
  PressableProps & KeyboardFocusViewProps & React.RefAttributes<View>
>;
