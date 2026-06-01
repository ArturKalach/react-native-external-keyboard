import React from 'react';
import { FrameProvider } from '../../../context/FocusFrameProviderContext';
import { KeyboardFocusLockBase } from '../KeyboardFocusLockBase/KeyboardFocusLockBase';
import { LockComponentType, type KeyboardFocusLockProps } from '../../../types';

export const FocusFrame = React.memo<KeyboardFocusLockProps>(
  ({ lockDisabled = false, ...props }) => {
    return (
      <FrameProvider>
        <KeyboardFocusLockBase
          {...props}
          componentType={LockComponentType.Frame}
          lockDisabled={lockDisabled}
        />
      </FrameProvider>
    );
  }
);
