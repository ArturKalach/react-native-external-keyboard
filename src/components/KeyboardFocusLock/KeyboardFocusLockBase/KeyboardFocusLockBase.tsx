import React from 'react';
import ExternalKeyboardLockView from '../../../nativeSpec/ExternalKeyboardLockViewNativeComponent';

import { LockComponentType, type KeyboardFocusLockProps } from '../../../types';

export const KeyboardFocusLockBase = React.memo<KeyboardFocusLockProps>(
  ({
    lockDisabled = false,
    componentType = LockComponentType.Trap,
    forceLock = false,
    ...props
  }) => {
    return (
      <ExternalKeyboardLockView
        {...props}
        componentType={componentType}
        lockDisabled={lockDisabled}
        forceLock={forceLock}
      />
    );
  }
);
