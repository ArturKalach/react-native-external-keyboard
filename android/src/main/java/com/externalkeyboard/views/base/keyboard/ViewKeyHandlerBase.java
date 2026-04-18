package com.externalkeyboard.views.base.keyboard;

import android.content.Context;
import android.view.KeyEvent;

import com.externalkeyboard.events.EventHelper;
import com.externalkeyboard.services.KeyboardKeyPressHandler;
import com.facebook.react.bridge.ReactContext;

public class ViewKeyHandlerBase extends ViewFocusRequestBase {
  public boolean hasKeyDownListener = false;
  public boolean hasKeyUpListener = false;
  private final Context context;

  private final KeyboardKeyPressHandler keyboardKeyPressHandler;

  public ViewKeyHandlerBase(Context context) {
    super(context);
    this.context = context;

    this.keyboardKeyPressHandler = new KeyboardKeyPressHandler();
  }

  protected boolean hasKeyListener() {
    return this.hasKeyUpListener || this.hasKeyDownListener;
  }

  protected void handleKeyPress(KeyEvent keyEvent) {
    int keyCode = keyEvent.getKeyCode();
    KeyboardKeyPressHandler.PressInfo pressInfo = keyboardKeyPressHandler.getEventsFromKeyPress(keyCode, keyEvent);

    if (pressInfo.firePressDownEvent && this.hasKeyDownListener) {
      EventHelper.pressDown((ReactContext) context, this.getId(), keyCode, keyEvent);
    }

    if (pressInfo.firePressUpEvent && this.hasKeyUpListener) {
      EventHelper.pressUp((ReactContext) context, this.getId(), keyCode, keyEvent, pressInfo.isLongPress);
    }
  }
}
