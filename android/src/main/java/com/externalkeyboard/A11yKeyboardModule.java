package com.externalkeyboard;

import androidx.annotation.NonNull;

import com.externalkeyboard.services.KeyboardService;
import com.facebook.react.bridge.ReactApplicationContext;
import com.facebook.react.bridge.ReactMethod;

public class A11yKeyboardModule extends com.externalkeyboard.A11yKeyboardModuleSpec{
  public static final String NAME = "A11yKeyboardModule";
  private KeyboardService keyboardService;

  A11yKeyboardModule(ReactApplicationContext context) {
    super(context);
    keyboardService = new KeyboardService(context);
  }

  @Override
  @NonNull
  public String getName() {
    return NAME;
  }

  @ReactMethod
  public void setKeyboardFocus(double nativeTag, Double _nextTag) {
    this.keyboardService.setKeyboardFocus((int)nativeTag);
  }

  @ReactMethod
  public void setPreferredKeyboardFocus(double nativeTag, double nextTag) {
    //stub
  }

  // Required for rn built in EventEmitter Calls.
  @ReactMethod
  public void addListener(String eventName) {

  }

  @ReactMethod
  public void removeListeners(Integer count) {

  }
}
