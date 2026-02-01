import React from 'react';
import { FrameProvider } from '../../../context/FocusFrameProviderContext';
import { KeyboardFocusLockBase } from '../KeyboardFocusLockBase/KeyboardFocusLockBase';
import type { KeyboardFocusLockProps } from '../../../types/KeyboardFocusLock.types';

export const FocusFrame = React.memo<KeyboardFocusLockProps>(
  ({ lockDisabled = false, ...props }) => {
    return (
      <FrameProvider>
        <KeyboardFocusLockBase
          {...props}
          componentType={1}
          lockDisabled={lockDisabled}
        />
      </FrameProvider>
    );
  }
);
