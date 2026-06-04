package com.externalkeyboard;


import com.externalkeyboard.modules.ExternalKeyboardModule;
import com.externalkeyboard.views.ExternalKeyboardLockView.ExternalKeyboardLockViewManager;
import com.externalkeyboard.views.ExternalKeyboardView.ExternalKeyboardViewManager;
import com.externalkeyboard.views.KeyboardFocusGroup.KeyboardFocusGroupManager;
import com.externalkeyboard.views.TextInputFocusWrapper.TextInputFocusWrapperManager;
import com.facebook.react.BaseReactPackage;
import com.facebook.react.bridge.NativeModule;
import com.facebook.react.bridge.ReactApplicationContext;
import com.facebook.react.module.model.ReactModuleInfo;
import com.facebook.react.module.model.ReactModuleInfoProvider;
import com.facebook.react.uimanager.ViewManager;

import java.util.Arrays;
import java.util.List;
import java.util.HashMap;
import java.util.Map;

public class ExternalKeyboardViewPackage extends BaseReactPackage {
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
    return new ReactModuleInfoProvider() {
      @Override
      public Map<String, ReactModuleInfo> getReactModuleInfos() {
        Map<String, ReactModuleInfo> map = new HashMap<>();

        map.put(ExternalKeyboardModule.NAME, new ReactModuleInfo(
          ExternalKeyboardModule.NAME, // name
          ExternalKeyboardModule.NAME, // className
          false,                   // canOverrideExistingModule
          false,                   // needsEagerInit
          false,                   // isCxxModule
          BuildConfig.IS_NEW_ARCHITECTURE_ENABLED // isTurboModule
        ));
        return map;
      }
    };
  }

  @Override
  public List<ViewManager> createViewManagers(ReactApplicationContext reactContext) {
    return Arrays.asList(
      new ExternalKeyboardViewManager(),
      new TextInputFocusWrapperManager(),
      new KeyboardFocusGroupManager(),
      new ExternalKeyboardLockViewManager()
    );
  }
}
