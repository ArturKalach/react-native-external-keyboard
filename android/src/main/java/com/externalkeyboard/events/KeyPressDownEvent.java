package com.externalkeyboard.events;

import android.view.KeyEvent;

import com.facebook.react.bridge.Arguments;
import com.facebook.react.bridge.WritableMap;
import com.facebook.react.uimanager.events.Event;
import com.facebook.react.uimanager.events.RCTEventEmitter;

public class KeyPressDownEvent extends Event<KeyPressDownEvent> {
  public WritableMap mExtraData;

  public static String EVENT_NAME = "topOnKeyDownPress";

  public KeyPressDownEvent(int id, int keyCode, KeyEvent keyEvent) {
    super(id);

    WritableMap eventPayload = Arguments.createMap();
    eventPayload.putInt("keyCode", keyCode);
    eventPayload.putBoolean("isLongPress", keyEvent.isLongPress());
    eventPayload.putBoolean("isAltPressed", keyEvent.isAltPressed());
    eventPayload.putBoolean("isShiftPressed", keyEvent.isShiftPressed());
    eventPayload.putBoolean("isCtrlPressed", keyEvent.isCtrlPressed());
    eventPayload.putBoolean("isCapsLockOn", keyEvent.isCapsLockOn());
    eventPayload.putBoolean("hasNoModifiers", keyEvent.hasNoModifiers());

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
