package com.externalkeyboard.services;

import android.os.Build;
import android.view.KeyEvent;

import java.util.HashMap;

public class KeyboardKeyPressHandler {
  public class PressInfo {
    public boolean firePressDownEvent = false;
    public boolean firePressUpEvent = false;
    public boolean isLongPress = false;
  }

  private final HashMap<Integer, Boolean> pressedKeys = new HashMap<Integer, Boolean>();
  private final HashMap<Integer, Boolean> longPress = new HashMap<Integer, Boolean>();


  private boolean actionDownHandler (int keyCode, KeyEvent keyEvent) {
    boolean wasAlreadyPressed = false;
    if(pressedKeys.containsKey(keyCode)) {
      wasAlreadyPressed = pressedKeys.get(keyCode);
    }
    pressedKeys.put(keyCode, true);
    if(Build.VERSION.SDK_INT >= Build.VERSION_CODES.ECLAIR && keyEvent.isLongPress()) {
      longPress.put(keyCode, keyEvent.isLongPress());
    }

    return !wasAlreadyPressed;
  }

  private boolean actionUpHandler (int keyCode, KeyEvent keyEvent) {
    pressedKeys.put(keyCode, false);

    boolean isLongPress = false;
    if(longPress.containsKey(keyCode)) {
      isLongPress = longPress.get(keyCode);
    }
    longPress.put(keyCode, false);

    return isLongPress;
  }

  public PressInfo getEventsFromKeyPress(int keyCode, KeyEvent keyEvent) {
    PressInfo pressInfo = new PressInfo();

    if(keyEvent.getAction() == KeyEvent.ACTION_DOWN) {
      pressInfo.firePressDownEvent = actionDownHandler(keyCode, keyEvent);
    }
    if(keyEvent.getAction() == KeyEvent.ACTION_UP){
      pressInfo.firePressUpEvent = true;
      pressInfo.isLongPress = actionUpHandler(keyCode, keyEvent);
    }

    return pressInfo;
  }
}
