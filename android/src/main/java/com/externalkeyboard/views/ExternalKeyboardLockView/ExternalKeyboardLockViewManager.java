package com.externalkeyboard.views.ExternalKeyboardLockView;

import com.facebook.react.module.annotations.ReactModule;
import com.facebook.react.uimanager.ThemedReactContext;
import com.facebook.react.uimanager.annotations.ReactProp;

@ReactModule(name = ExternalKeyboardLockViewManager.NAME)
public class ExternalKeyboardLockViewManager extends com.externalkeyboard.ExternalKeyboardLockViewManagerSpec<ExternalKeyboardLockView> {
  public static final String NAME = "ExternalKeyboardLockView";

  @Override
  public String getName() {
    return NAME;
  }

  @Override
  public ExternalKeyboardLockView createViewInstance(ThemedReactContext context) {
    return new ExternalKeyboardLockView(context);
  }

  @Override
  @ReactProp(name = "componentType")
  public void setComponentType(ExternalKeyboardLockView view, int value) {
    view.setComponentType(value);
  }

  @Override
  @ReactProp(name = "lockDisabled")
  public void setLockDisabled(ExternalKeyboardLockView view, boolean value) {
    view.setLockDisabled(value);
  }
}
