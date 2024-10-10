package com.externalkeyboard.events;

import com.facebook.react.bridge.Arguments;
import com.facebook.react.bridge.WritableMap;
import com.facebook.react.uimanager.events.Event;
import com.facebook.react.uimanager.events.RCTEventEmitter;


public class FocusChangeEvent extends Event<FocusChangeEvent> {
  public static String EVENT_NAME = "topFocusChange";
  public WritableMap mExtraData;

  public FocusChangeEvent(int id, Boolean hasFocus) {
    super(id);
    WritableMap eventPayload = Arguments.createMap();
    eventPayload.putBoolean("isFocused", hasFocus);
    this.mExtraData = eventPayload;
  }

  @Override
  public void dispatch(RCTEventEmitter rCTEventEmitter) {
    rCTEventEmitter.receiveEvent(this.getViewTag(), this.getEventName(), this.mExtraData);
  }

  @Override
  public short getCoalescingKey() {
    return 0;
  }

  @Override
  public boolean canCoalesce() {
    return false;
  }

  @Override
  public String getEventName() {
    return EVENT_NAME;
  }
}
