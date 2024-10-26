import type { IA11yModule } from './A11yModule.types';
import type { KeyboardFocus } from '../../types/BaseKeyboardView';
import { A11yKeyboardModule } from '../../NativeModules';

class A11yModuleIOSImpl implements IA11yModule {
  //ToDo RNCEKV-DEPRICATED-0
  /**
   * @deprecated The method should not be used
   * This API is going to be removed in future releases
   */
  setPreferredKeyboardFocus = (tag: number, targetTag: number) => {
    if (Number.isInteger(tag) && Number.isInteger(targetTag)) {
      A11yKeyboardModule.setPreferredKeyboardFocus(tag, targetTag);
    }
  };

  //ToDo RNCEKV-DEPRICATED-0
  /**
   * @deprecated The method should not be used
   * This API is going to be removed in future releases
   */
  setKeyboardFocus = (ref: React.RefObject<KeyboardFocus>) => {
    ref.current?.focus();
  };
}

export const A11yModule = new A11yModuleIOSImpl();
