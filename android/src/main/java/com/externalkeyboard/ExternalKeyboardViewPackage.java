package com.externalkeyboard;


import androidx.annotation.Nullable;

import com.externalkeyboard.views.ExternalKeyboardView.ExternalKeyboardViewManager;
import com.externalkeyboard.views.TextInputFocusWrapper.TextInputFocusWrapperManager;
import com.facebook.react.TurboReactPackage;
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


public class ExternalKeyboardViewPackage extends TurboReactPackage {
  @Nullable
  @Override
  public NativeModule getModule(String name, ReactApplicationContext reactContext) {
    if (name.equals(A11yKeyboardModule.NAME)) {
      return new A11yKeyboardModule(reactContext);
    } else {
      return null;
    }
  }

  @Override
  public ReactModuleInfoProvider getReactModuleInfoProvider() {
    return () -> {
      final Map<String, ReactModuleInfo> moduleInfos = new HashMap<>();
      boolean isTurboModule = BuildConfig.IS_NEW_ARCHITECTURE_ENABLED;
      moduleInfos.put(A11yKeyboardModule.NAME, new ReactModuleInfo(A11yKeyboardModule.NAME, A11yKeyboardModule.NAME, false, // canOverrideExistingModule
        false, // needsEagerInit
        true, // hasConstants
        false, // isCxxModule
        isTurboModule // isTurboModule
      ));
      return moduleInfos;
    };
  }

  @Override
  public List<ViewManager> createViewManagers(ReactApplicationContext reactContext) {
    List<ViewManager> viewManagers = new ArrayList<>();
    viewManagers.add(new ExternalKeyboardViewManager());
    viewManagers.add(new TextInputFocusWrapperManager());
    return viewManagers;
  }

  @Override
  public List<NativeModule> createNativeModules(ReactApplicationContext reactContext) {
    return Collections.emptyList();
  }
}
