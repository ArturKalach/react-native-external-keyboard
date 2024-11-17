package com.externalkeyboard.events;

import android.view.KeyEvent;

import com.facebook.react.bridge.Arguments;
import com.facebook.react.bridge.WritableMap;
import com.facebook.react.uimanager.events.Event;

public class KeyPressUpEvent extends Event<KeyPressUpEvent> {
  public static String EVENT_NAME = "topKeyUpPress";
  public WritableMap payload;

  public KeyPressUpEvent(int surfaceId, int id, int keyCode, KeyEvent keyEvent, boolean isLongPress) {
    super(surfaceId, id);

    int unicode = keyEvent.getUnicodeChar();
    payload = Arguments.createMap();
    payload.putInt("keyCode", keyCode);
    payload.putInt("unicode", unicode);
    payload.putString("unicodeChar", String.valueOf((char) unicode));
    payload.putBoolean("isLongPress", isLongPress);
    payload.putBoolean("isAltPressed", keyEvent.isAltPressed());
    payload.putBoolean("isShiftPressed", keyEvent.isShiftPressed());
    payload.putBoolean("isCtrlPressed", keyEvent.isCtrlPressed());
    payload.putBoolean("isCapsLockOn", keyEvent.isCapsLockOn());
    payload.putBoolean("hasNoModifiers", keyEvent.hasNoModifiers());
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
