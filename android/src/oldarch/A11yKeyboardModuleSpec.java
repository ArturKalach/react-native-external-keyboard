package com.externalkeyboard;

import com.facebook.react.bridge.ReactApplicationContext;
import com.facebook.react.bridge.ReactContextBaseJavaModule;

public abstract class A11yKeyboardModuleSpec extends ReactContextBaseJavaModule {
  protected A11yKeyboardModuleSpec(ReactApplicationContext context) {
    super(context);
  }

  public abstract void setKeyboardFocus(double nativeTag, double nextTag);

  public abstract void setPreferredKeyboardFocus(double nativeTag, double nextTag);
}

