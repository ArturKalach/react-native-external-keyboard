import { findNodeHandle } from 'react-native';

import type { IA11yModule, RefObjType } from './A11yModule.types';
import * as RCA11yModule from './RCA11yModule';

class A11yModuleIOSImpl implements IA11yModule {
  private _currentFocusedTag: number | null = null;

  set currentFocusedTag(value: number) {
    this._currentFocusedTag = value;
  }

  setPreferredKeyboardFocus = (tag: number, targetTag: number) => {
    if (Number.isInteger(tag) && Number.isInteger(targetTag)) {
      RCA11yModule.setPreferredKeyboardFocus(tag, targetTag);
    }
  };

  setKeyboardFocus = (ref: RefObjType) => {
    const tag = findNodeHandle(ref.current);

    if (
      this._currentFocusedTag &&
      tag &&
      Number.isInteger(this._currentFocusedTag) &&
      Number.isInteger(tag)
    ) {
      RCA11yModule.setKeyboardFocus(this._currentFocusedTag, tag);
    }
  };
}

export const A11yModule = new A11yModuleIOSImpl();
