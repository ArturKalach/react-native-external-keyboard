import type React from 'react';
import { findNodeHandle, InteractionManager } from 'react-native';
import type { IA11yModule } from './A11yModule.types';

import { A11yKeyboardModule } from '../../NativeModules';

class A11yAndroidImpl implements IA11yModule {
  setKeyboardFocus(ref: React.RefObject<React.Component>) {
    const tag = findNodeHandle(ref.current);
    if (tag) {
      InteractionManager.runAfterInteractions(() => {
        A11yKeyboardModule.setKeyboardFocus(tag);
      });
    }
  }

  setPreferredKeyboardFocus = () => {};
}

export const A11yModule = new A11yAndroidImpl();
