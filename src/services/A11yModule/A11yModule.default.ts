import type { IA11yModule } from './A11yModule.types';
import type { KeyboardFocus } from '../../types/BaseKeyboardView';

class A11yModuleStub implements IA11yModule {
  //ToDo RNCEKV-DEPRICATED-0
  /**
   * @deprecated The method should not be used
   * This API is going to be removed in future releases
   */
  setPreferredKeyboardFocus = (_tag: number, _targetTag: number) => {};

  //ToDo RNCEKV-DEPRICATED-0
  /**
   * @deprecated The method should not be used
   * This API is going to be removed in future releases
   */
  setKeyboardFocus = (_ref: React.RefObject<KeyboardFocus>) => {};
}

export const A11yModule = new A11yModuleStub();
