package com.externalkeyboard;


import androidx.annotation.NonNull;
import androidx.annotation.Nullable;

import com.externalkeyboard.views.ExternalKeyboardView.ExternalKeyboardViewManager;
import com.externalkeyboard.views.KeyboardFocusGroup.KeyboardFocusGroupManager;
import com.externalkeyboard.views.TextInputFocusWrapper.TextInputFocusWrapperManager;
import com.facebook.react.BaseReactPackage;
import com.facebook.react.bridge.NativeModule;
import com.facebook.react.bridge.ReactApplicationContext;
import com.facebook.react.module.model.ReactModuleInfo;
import com.facebook.react.module.model.ReactModuleInfoProvider;
import com.facebook.react.uimanager.ViewManager;

import java.util.ArrayList;
import java.util.Collections;
import java.util.HashMap;
import java.util.List;
import java.util.Map;


public class ExternalKeyboardViewPackage extends BaseReactPackage {
  @Nullable
  @Override
  public NativeModule getModule(@NonNull String s, @NonNull ReactApplicationContext reactApplicationContext) {
    return null;
  }

  @Override
  public List<ViewManager> createViewManagers(ReactApplicationContext reactContext) {
    List<ViewManager> viewManagers = new ArrayList<>();
    viewManagers.add(new ExternalKeyboardViewManager());
    viewManagers.add(new TextInputFocusWrapperManager());
    viewManagers.add(new KeyboardFocusGroupManager());
    return viewManagers;
  }

  @Override
  public ReactModuleInfoProvider getReactModuleInfoProvider() {
    return null;
  }
}
