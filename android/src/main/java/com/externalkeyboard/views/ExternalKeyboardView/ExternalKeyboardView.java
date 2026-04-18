package com.externalkeyboard.views.ExternalKeyboardView;

import android.content.Context;
import android.view.KeyEvent;
import android.view.ViewGroup;

import com.externalkeyboard.views.base.keyboard.ViewKeyHandlerBase;

public class ExternalKeyboardView extends ViewKeyHandlerBase {

  public ExternalKeyboardView(Context context) {
    super(context);
  }

  @Override
  public boolean dispatchKeyEvent(KeyEvent keyEvent) {
    if (this.isFocusLocked(keyEvent)) {
      return true;
    }
    if (!this.hasKeyListener()) {
      return super.dispatchKeyEvent(keyEvent);
    }

    if (keyEvent.getKeyCode() == KeyEvent.KEYCODE_TAB) {
      return super.dispatchKeyEvent(keyEvent);
    }

    this.handleKeyPress(keyEvent);

    return super.dispatchKeyEvent(keyEvent);
  }

  public void setCanBeFocused(boolean canBeFocused) {
    int descendantFocusability = canBeFocused ? ViewGroup.FOCUS_BEFORE_DESCENDANTS : ViewGroup.FOCUS_BLOCK_DESCENDANTS;
    this.setDescendantFocusability(descendantFocusability);
  }
}
