package com.externalkeyboard;

import com.facebook.react.bridge.Promise;
import com.facebook.react.bridge.ReactApplicationContext;
import com.facebook.react.bridge.ReactContextBaseJavaModule;

public abstract class ExternalKeyboardModuleSpec extends ReactContextBaseJavaModule {
  protected ExternalKeyboardModuleSpec(ReactApplicationContext context) {
    super(context);
  }

  public abstract void dismissKeyboard(Promise promise);
}
