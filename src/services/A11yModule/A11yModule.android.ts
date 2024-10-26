import type React from 'react';
import type { IA11yModule } from './A11yModule.types';
import type { KeyboardFocus } from '../../types/BaseKeyboardView';

class A11yAndroidImpl implements IA11yModule {
  //ToDo RNCEKV-DEPRICATED-0
  /**
   * @deprecated The method should not be used
   * This API is going to be removed in future releases
   */
  setKeyboardFocus = (ref: React.RefObject<KeyboardFocus>) => {
    ref.current?.focus();
  };

  //ToDo RNCEKV-DEPRICATED-0
  /**
   * @deprecated The method should not be used
   * This API is going to be removed in future releases
   */
  setPreferredKeyboardFocus = () => {};
}

export const A11yModule = new A11yAndroidImpl();
