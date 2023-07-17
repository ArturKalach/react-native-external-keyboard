import type { RefObject } from 'react';

export type A11yNativeModule = {
  setKeyboardFocus: (nativeTag: number, nextTag?: number) => void;
  setPreferredKeyboardFocus: (nativeTag: number, nextTag: number) => void;
};

export type RefObjType = RefObject<React.Component<{}, {}, unknown>>;

export interface IA11yModule {
  currentFocusedTag?: number;

  setPreferredKeyboardFocus: (nativeTag: number, nextTag: number) => void;
  setKeyboardFocus: (ref: RefObjType) => void;
}
