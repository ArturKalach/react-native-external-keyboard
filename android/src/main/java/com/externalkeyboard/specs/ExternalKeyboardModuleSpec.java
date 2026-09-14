package com.externalkeyboard.specs;

import com.externalkeyboard.NativeExternalKeyboardModuleSpec;
import com.facebook.react.bridge.ReactApplicationContext;

public abstract class ExternalKeyboardModuleSpec extends NativeExternalKeyboardModuleSpec {
  protected ExternalKeyboardModuleSpec(ReactApplicationContext context) {
    super(context);
  }
}
