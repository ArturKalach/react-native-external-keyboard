import { View } from 'react-native';

import type { KeyboardFocusViewProps } from '../../types';

export const KeyboardFocusView =
  View as unknown as React.ForwardRefExoticComponent<
    KeyboardFocusViewProps & { autoFocus?: boolean } & React.RefAttributes<View>
  >;
