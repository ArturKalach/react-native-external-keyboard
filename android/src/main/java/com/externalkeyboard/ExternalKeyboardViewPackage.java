package com.externalkeyboard;


import com.externalkeyboard.views.ExternalKeyboardView.ExternalKeyboardViewManager;
import com.externalkeyboard.views.KeyboardFocusGroup.KeyboardFocusGroupManager;
import com.externalkeyboard.views.TextInputFocusWrapper.TextInputFocusWrapperManager;
import com.facebook.react.ReactPackage;
import com.facebook.react.bridge.NativeModule;
import com.facebook.react.bridge.ReactApplicationContext;
import com.facebook.react.uimanager.ViewManager;

import java.util.ArrayList;
import java.util.List;

public class ExternalKeyboardViewPackage implements ReactPackage {

    @Override
    public List<ViewManager> createViewManagers(ReactApplicationContext reactContext) {
        List<ViewManager> viewManagers = new ArrayList<>();
        viewManagers.add(new ExternalKeyboardViewManager());
        viewManagers.add(new TextInputFocusWrapperManager());
        viewManagers.add(new KeyboardFocusGroupManager());

        return viewManagers;
    }

    @Override
    public List<NativeModule> createNativeModules(ReactApplicationContext reactContext) {
        return new ArrayList<>();
    }
}
