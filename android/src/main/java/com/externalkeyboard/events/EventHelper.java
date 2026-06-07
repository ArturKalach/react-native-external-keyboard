package com.externalkeyboard.events;

import android.view.KeyEvent;

import com.externalkeyboard.helper.ReactNativeEventDispatcher;
import com.facebook.react.bridge.ReactContext;
import com.facebook.react.uimanager.UIManagerHelper;
import com.facebook.react.uimanager.events.Event;
import com.facebook.react.uimanager.events.EventDispatcher;

public class EventHelper {
  public static void focusChanged(ReactContext context, int id, boolean hasFocus) {
    int surfaceId = UIManagerHelper.getSurfaceId(context);
    FocusChangeEvent event = new FocusChangeEvent(surfaceId, id, hasFocus);
    dispatch(context, id, event);
  }

  public static void pressDown(ReactContext context, int id, int keyCode, KeyEvent keyEvent) {
    int surfaceId = UIManagerHelper.getSurfaceId(context);
    KeyPressDownEvent keyPressDownEvent = new KeyPressDownEvent(surfaceId, id, keyCode, keyEvent);
    dispatch(context, id, keyPressDownEvent);
  }

  public static void pressUp(ReactContext context, int id, int keyCode, KeyEvent keyEvent, boolean isLongPress) {
    int surfaceId = UIManagerHelper.getSurfaceId(context);
    KeyPressUpEvent keyPressUpEvent = new KeyPressUpEvent(surfaceId, id, keyCode, keyEvent, isLongPress);
    dispatch(context, id, keyPressUpEvent);
  }

  public static void multiplyTextSubmit(ReactContext context, int id, String text) {
    int surfaceId = UIManagerHelper.getSurfaceId(context);
    MultiplyTextSubmit event = new MultiplyTextSubmit(surfaceId, id, text);
    dispatch(context, id, event);
  }

  private static void dispatch(ReactContext context, int id, Event<?> event) {
    EventDispatcher eventDispatcher = ReactNativeEventDispatcher.getEventDispatcher(context, id);
    if (eventDispatcher != null) {
      eventDispatcher.dispatchEvent(event);
    }
  }
}
