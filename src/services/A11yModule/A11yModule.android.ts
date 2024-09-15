import type React from 'react';
import { findNodeHandle, InteractionManager } from 'react-native';
import type { IA11yModule } from './A11yModule.types';

import { A11yKeyboardModule } from '../../NativeModules';

class A11yAndroidImpl implements IA11yModule {
  //ToDo RNCEKV-DEPRICATED-0
  /**
   * @deprecated The method should not be used
   * This API is going to be removed in future releases
   */
  setKeyboardFocus(ref: React.RefObject<React.Component>) {
    const tag = findNodeHandle(ref.current);
    if (tag) {
      InteractionManager.runAfterInteractions(() => {
        A11yKeyboardModule.setKeyboardFocus(tag);
      });
    }
  }

  //ToDo RNCEKV-DEPRICATED-0
  /**
   * @deprecated The method should not be used
   * This API is going to be removed in future releases
   */
  setPreferredKeyboardFocus = () => {};
}

export const A11yModule = new A11yAndroidImpl();
