import { findNodeHandle } from 'react-native';

import type { IA11yModule, RefObjType } from './A11yModule.types';
import { A11yKeyboardModule } from '../../NativeModules';

class A11yModuleIOSImpl implements IA11yModule {
  private _currentFocusedTag: number | null = null;

  set currentFocusedTag(value: number) {
    this._currentFocusedTag = value;
  }

  /**
   * @deprecated The method should not be used
   * This API is going to be removed in future releases
   */
  setPreferredKeyboardFocus = (tag: number, targetTag: number) => {
    if (Number.isInteger(tag) && Number.isInteger(targetTag)) {
      A11yKeyboardModule.setPreferredKeyboardFocus(tag, targetTag);
    }
  };

  /**
   * @deprecated The method should not be used
   * This API is going to be removed in future releases
   */
  setKeyboardFocus = (ref: RefObjType) => {
    const tag = findNodeHandle(ref.current);

    if (
      this._currentFocusedTag &&
      tag &&
      Number.isInteger(this._currentFocusedTag) &&
      Number.isInteger(tag)
    ) {
      A11yKeyboardModule.setKeyboardFocus(this._currentFocusedTag, tag);
    }
  };
}

export const A11yModule = new A11yModuleIOSImpl();
