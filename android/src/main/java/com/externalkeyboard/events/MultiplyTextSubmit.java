package com.externalkeyboard.events;

import com.facebook.react.bridge.Arguments;
import com.facebook.react.bridge.WritableMap;
import com.facebook.react.uimanager.events.Event;

public class MultiplyTextSubmit extends Event<MultiplyTextSubmit> {
  public static String EVENT_NAME = "topMultiplyTextSubmit";
  public WritableMap payload;

  public MultiplyTextSubmit(int surfaceId, int id, String text) {
    super(surfaceId, id);
    payload = Arguments.createMap();
    payload.putString("text", text);
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
