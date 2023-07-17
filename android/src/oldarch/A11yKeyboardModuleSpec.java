package com.externalkeyboard;

import com.facebook.react.bridge.ReactApplicationContext;
import com.facebook.react.bridge.ReactContextBaseJavaModule;
import com.facebook.react.bridge.Promise;
import com.facebook.react.bridge.ReadableArray;

import androidx.annotation.NonNull;

abstract class A11yKeyboardModuleSpec extends ReactContextBaseJavaModule {
  A11yKeyboardModuleSpec(ReactApplicationContext context) {
    super(context);
  }

  public abstract void setKeyboardFocus(double nativeTag, Double nextTag);
  public abstract void setPreferredKeyboardFocus(double nativeTag, double nextTag);
}

