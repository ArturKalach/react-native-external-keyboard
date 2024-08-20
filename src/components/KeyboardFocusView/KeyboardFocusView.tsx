import { View } from 'react-native';

import type { ExternalKeyboardViewType } from '../../types/ExternalKeyboardView';
import type { KeyboardFocusViewProps } from '../../types';

export const KeyboardFocusView =
  View as unknown as React.ForwardRefExoticComponent<
    KeyboardFocusViewProps & React.RefAttributes<ExternalKeyboardViewType>
  >;
