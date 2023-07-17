import type React from 'react';
import { findNodeHandle, InteractionManager } from 'react-native';
import type { IA11yModule } from './A11yModule.types';

import * as RCA11yModule from './RCA11yModule';

class A11yAndroidImpl implements IA11yModule {
  setKeyboardFocus(ref: React.RefObject<React.Component>) {
    const tag = findNodeHandle(ref.current);
    if (tag) {
      InteractionManager.runAfterInteractions(() => {
        RCA11yModule.setKeyboardFocus(tag);
      });
    }
  }

  setPreferredKeyboardFocus = () => {};
}

export const A11yModule = new A11yAndroidImpl();
