import { View, PressableProps } from 'react-native';

import { KeyboardFocusViewProps } from '../KeyboardFocusView';

declare const Pressable: React.ForwardRefExoticComponent<
  PressableProps & KeyboardFocusViewProps & React.RefAttributes<View>
>;
