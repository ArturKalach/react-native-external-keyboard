import React from 'react';

import { FocusTrapMountWrapper } from './FocusTrapMountWrapper';
import { KeyboardFocusLockBase } from '../KeyboardFocusLockBase/KeyboardFocusLockBase';
import { LockComponentType, type KeyboardFocusLockProps } from '../../../types';

export const FocusTrap = React.memo<KeyboardFocusLockProps>(
  ({ lockDisabled = false, ...props }) => (
    <FocusTrapMountWrapper>
      <KeyboardFocusLockBase
        {...props}
        componentType={LockComponentType.Trap}
        lockDisabled={lockDisabled}
      />
    </FocusTrapMountWrapper>
  )
);
