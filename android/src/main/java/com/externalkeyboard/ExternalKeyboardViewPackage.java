package com.externalkeyboard;


import com.externalkeyboard.modules.ExternalKeyboardModule;
import com.externalkeyboard.views.ExternalKeyboardView.ExternalKeyboardViewManager;
import com.externalkeyboard.views.KeyboardFocusGroup.KeyboardFocusGroupManager;
import com.externalkeyboard.views.TextInputFocusWrapper.TextInputFocusWrapperManager;
import com.facebook.react.TurboReactPackage;
import com.facebook.react.bridge.NativeModule;
import com.facebook.react.bridge.ReactApplicationContext;
import com.facebook.react.module.model.ReactModuleInfo;
import com.facebook.react.module.model.ReactModuleInfoProvider;
import com.facebook.react.uimanager.ViewManager;

import java.util.ArrayList;
import java.util.List;
import java.util.HashMap;
import java.util.Map;

public class ExternalKeyboardViewPackage extends TurboReactPackage {
  @Override
  public NativeModule getModule(String name, ReactApplicationContext reactContext) {
    if (name.equals(ExternalKeyboardModule.NAME)) {
      return new ExternalKeyboardModule(reactContext);
    } else {
      return null;
    }
  }

  @Override
  public ReactModuleInfoProvider getReactModuleInfoProvider() {
    return () -> {
      Map<String, ReactModuleInfo> map = new HashMap<>();
      boolean isTurboModule = BuildConfig.IS_NEW_ARCHITECTURE_ENABLED;
      map.put(ExternalKeyboardModule.NAME, new ReactModuleInfo(ExternalKeyboardModule.NAME, // name
        ExternalKeyboardModule.NAME, // className
        false,                           // canOverrideExistingModule
        false,                           // needsEagerInit
        true,                            // hasConstants
        false,                           // isCxxModule
        isTurboModule                    // isTurboModule
      ));
      return map;
    };
  }

  @Override
  public List<ViewManager> createViewManagers(ReactApplicationContext reactContext) {
    List<ViewManager> viewManagers = new ArrayList<>();
    viewManagers.add(new ExternalKeyboardViewManager());
    viewManagers.add(new TextInputFocusWrapperManager());
    viewManagers.add(new KeyboardFocusGroupManager());

    return viewManagers;
  }
}
