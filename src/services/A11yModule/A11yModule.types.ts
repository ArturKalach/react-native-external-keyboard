import type { RefObject } from 'react';

export type A11yNativeModule = {
  setKeyboardFocus: (nativeTag: number, nextTag?: number) => void;
  setPreferredKeyboardFocus: (nativeTag: number, nextTag: number) => void;
};

export type RefObjType = RefObject<React.Component<{}, {}, unknown>>;

export interface IA11yModule {
  currentFocusedTag?: number;

  /**
   * @deprecated The method should not be used
   * This API is going to be removed in future releases
   */
  setPreferredKeyboardFocus: (nativeTag: number, nextTag: number) => void;
  /**
   * @deprecated The method should not be used
   * This API is going to be removed in future releases
   */
  setKeyboardFocus: (ref: RefObjType) => void;
}
