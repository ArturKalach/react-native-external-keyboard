package com.externalkeyboard.events;

import com.facebook.react.bridge.ReactContext;
import com.facebook.react.uimanager.UIManagerHelper;

public class EventHelper {
  public static void focusChanged(ReactContext context, int id, boolean hasFocus) {
    FocusChangeEvent event = new FocusChangeEvent(id, hasFocus);
    UIManagerHelper.getEventDispatcherForReactTag(context, id).dispatchEvent(event);
  }
}
