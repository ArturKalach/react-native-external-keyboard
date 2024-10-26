import type { RefObject } from 'react';
import type { KeyboardFocus } from '../../types/BaseKeyboardView';

export type A11yNativeModule = {
  setKeyboardFocus: (nativeTag: number, nextTag?: number) => void;
  setPreferredKeyboardFocus: (nativeTag: number, nextTag: number) => void;
};

export interface IA11yModule {
  currentFocusedTag?: number;

  //ToDo RNCEKV-DEPRICATED-0
  /**
   * @deprecated The method should not be used
   * This API is going to be removed in future releases
   */
  setPreferredKeyboardFocus: (nativeTag: number, nextTag: number) => void;

  //ToDo RNCEKV-DEPRICATED-0
  /**
   * @deprecated The method should not be used
   * This API is going to be removed in future releases
   */
  setKeyboardFocus: (ref: RefObject<KeyboardFocus>) => void;
}
