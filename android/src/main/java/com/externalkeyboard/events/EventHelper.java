package com.externalkeyboard.events;

import android.view.KeyEvent;

import com.facebook.react.bridge.ReactContext;
import com.facebook.react.uimanager.UIManagerHelper;
import com.facebook.react.uimanager.events.EventDispatcher;

public class EventHelper {
  public static void focusChanged(ReactContext context, int id, boolean hasFocus) {
    int surfaceId = UIManagerHelper.getSurfaceId(context);
    FocusChangeEvent event = new FocusChangeEvent(surfaceId, id, hasFocus);
    EventDispatcher eventDispatcher = UIManagerHelper.getEventDispatcherForReactTag(context, id);
    if (eventDispatcher != null) {
      eventDispatcher.dispatchEvent(event);
    }
  }

  public static void pressDown(ReactContext context, int id, int keyCode, KeyEvent keyEvent) {
    int surfaceId = UIManagerHelper.getSurfaceId(context);
    KeyPressDownEvent keyPressDownEvent = new KeyPressDownEvent(surfaceId, id, keyCode, keyEvent);
    EventDispatcher eventDispatcher = UIManagerHelper.getEventDispatcherForReactTag(context, id);
    if (eventDispatcher != null) {
      eventDispatcher.dispatchEvent(keyPressDownEvent);
    }
  }

  public static void pressUp(ReactContext context, int id, int keyCode, KeyEvent keyEvent, boolean isLongPress) {
    int surfaceId = UIManagerHelper.getSurfaceId(context);
    KeyPressUpEvent keyPressUpEvent = new KeyPressUpEvent(surfaceId, id, keyCode, keyEvent, isLongPress);
    EventDispatcher eventDispatcher = UIManagerHelper.getEventDispatcherForReactTag(context, id);
    if (eventDispatcher != null) {
      eventDispatcher.dispatchEvent(keyPressUpEvent);
    }
  }
}
