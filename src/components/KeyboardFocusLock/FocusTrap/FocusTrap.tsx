import { View } from 'react-native';
import { FocusTrapMountWrapper } from './FocusTrapMountWrapper';
import type { KeyboardFocusLockProps } from '../../../types/KeyboardFocusLock.types';
import { KeyboardFocusLockBase } from '../KeyboardFocusLockBase/KeyboardFocusLockBase';

export const FocusTrap = ({
  forceLock = false,
  ...props
}: KeyboardFocusLockProps) => {
  if (forceLock) {
    return (
      <FocusTrapMountWrapper>
        <KeyboardFocusLockBase
          collapsable={false}
          accessibilityViewIsModal={true}
          forceLock={forceLock}
          {...props}
        />
      </FocusTrapMountWrapper>
    );
  }

  return (
    <View collapsable={false} accessibilityViewIsModal={true} {...props} />
  );
};
