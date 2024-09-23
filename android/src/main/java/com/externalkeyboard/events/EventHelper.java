package com.externalkeyboard.events;

import android.view.KeyEvent;

import com.facebook.react.bridge.ReactContext;
import com.facebook.react.uimanager.UIManagerHelper;

public class EventHelper {
  public static void focusChanged(ReactContext context, int id, boolean hasFocus) {
    FocusChangeEvent event = new FocusChangeEvent(id, hasFocus);
    UIManagerHelper.getEventDispatcherForReactTag(context, id).dispatchEvent(event);
  }

  public static void pressDown(ReactContext context, int id, int keyCode, KeyEvent keyEvent) {
    KeyPressDownEvent keyPressDownEvent = new KeyPressDownEvent(id, keyCode, keyEvent);
    UIManagerHelper.getEventDispatcherForReactTag(context, id).dispatchEvent(keyPressDownEvent);
  }

  public static void pressUp(ReactContext context, int id, int keyCode, KeyEvent keyEvent, boolean isLongPress) {
    KeyPressUpEvent keyPressUpEvent = new KeyPressUpEvent(id, keyCode, keyEvent, isLongPress);
    UIManagerHelper.getEventDispatcherForReactTag(context, id).dispatchEvent(keyPressUpEvent);
  }
}
