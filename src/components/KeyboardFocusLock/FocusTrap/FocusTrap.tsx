import { View } from 'react-native';
import { FocusTrapMountWrapper } from './FocusTrapMountWrapper';
import type { KeyboardFocusLockProps } from '../../../types/KeyboardFocusLock.types';

export const FocusTrap = (props: KeyboardFocusLockProps) => (
  <FocusTrapMountWrapper>
    <View collapsable={false} accessibilityViewIsModal={true} {...props} />
  </FocusTrapMountWrapper>
);
