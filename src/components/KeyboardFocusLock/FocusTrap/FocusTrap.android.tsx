import React from 'react';

import { FocusTrapMountWrapper } from './FocusTrapMountWrapper';
import { KeyboardFocusLockBase } from '../KeyboardFocusLockBase/KeyboardFocusLockBase';
import type { KeyboardFocusLockProps } from '../../../types/KeyboardFocusLock.types';

export const FocusTrap = React.memo<KeyboardFocusLockProps>(
  ({ lockDisabled = false, ...props }) => (
    <FocusTrapMountWrapper>
      <KeyboardFocusLockBase
        {...props}
        componentType={0}
        lockDisabled={lockDisabled}
      />
    </FocusTrapMountWrapper>
  )
);
