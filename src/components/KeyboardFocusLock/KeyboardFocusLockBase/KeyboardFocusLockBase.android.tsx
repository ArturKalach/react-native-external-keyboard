import React from 'react';
import ExternalKeyboardLockView from '../../../nativeSpec/ExternalKeyboardLockViewNativeComponent';

import type { KeyboardFocusLockProps } from '../../../types/KeyboardFocusLock.types';

export const KeyboardFocusLockBase = React.memo<KeyboardFocusLockProps>(
  ({ lockDisabled = false, componentType = 0, ...props }) => {
    return (
      <ExternalKeyboardLockView
        {...props}
        componentType={componentType}
        lockDisabled={lockDisabled}
      />
    );
  }
);
