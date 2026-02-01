import type { ViewProps } from 'react-native';

export type KeyboardFocusLockProps = ViewProps & {
  componentType?: number;
  lockDisabled?: boolean;
};
