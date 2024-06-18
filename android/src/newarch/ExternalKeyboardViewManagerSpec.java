package com.externalkeyboard;

import com.facebook.react.viewmanagers.ExternalKeyboardViewManagerInterface;
import com.facebook.react.views.view.ReactViewGroup;
import com.facebook.react.views.view.ReactViewManager;
import com.facebook.soloader.SoLoader;

public abstract class ExternalKeyboardViewManagerSpec<T extends ReactViewGroup> extends ReactViewManager implements ExternalKeyboardViewManagerInterface<T> {
  static {
    if (BuildConfig.CODEGEN_MODULE_REGISTRATION != null) {
      SoLoader.loadLibrary(BuildConfig.CODEGEN_MODULE_REGISTRATION);
    }
  }
}
