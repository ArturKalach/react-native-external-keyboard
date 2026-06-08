package com.externalkeyboard.views.ExternalKeyboardView;

import android.content.Context;
import android.view.KeyEvent;

import com.externalkeyboard.views.base.keyboard.ViewKeyHandlerBase;

public class ExternalKeyboardView extends ViewKeyHandlerBase {

  public ExternalKeyboardView(Context context) {
    super(context);
  }

  @Override
  public boolean dispatchKeyEvent(KeyEvent keyEvent) {
    this.handleKeyPress(keyEvent);

    if (this.isFocusLocked(keyEvent)) {
      return true;
    }
    if (!this.hasKeyListener()) {
      return super.dispatchKeyEvent(keyEvent);
    }

    if (keyEvent.getKeyCode() == KeyEvent.KEYCODE_TAB) {
      return super.dispatchKeyEvent(keyEvent);
    }

    return super.dispatchKeyEvent(keyEvent);
  }
}
