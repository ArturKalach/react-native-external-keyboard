package com.externalkeyboard.events;

import com.facebook.react.bridge.Arguments;
import com.facebook.react.bridge.WritableMap;
import com.facebook.react.uimanager.events.Event;

public class FocusChangeEvent extends Event<FocusChangeEvent> {
  public static String EVENT_NAME = "topFocusChange";
  public WritableMap payload;

  public FocusChangeEvent(int surfaceId, int id, Boolean hasFocus) {
    super(surfaceId, id);
    payload = Arguments.createMap();
    payload.putBoolean("isFocused", hasFocus);
  }

  @Override
  public String getEventName() {
    return EVENT_NAME;
  }

  @Override
  public WritableMap getEventData() {
    return payload;
  }
}
