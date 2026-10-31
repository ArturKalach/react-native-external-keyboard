package com.externalkeyboard.views.ExternalKeyboardLockView;

import com.externalkeyboard.specs.ExternalKeyboardLockViewManagerSpec;
import com.facebook.react.module.annotations.ReactModule;
import com.facebook.react.uimanager.ThemedReactContext;
import com.facebook.react.uimanager.annotations.ReactProp;

@ReactModule(name = ExternalKeyboardLockViewManager.NAME)
public class ExternalKeyboardLockViewManager extends ExternalKeyboardLockViewManagerSpec<ExternalKeyboardLockView> {
  public static final String NAME = "ExternalKeyboardLockView";
  // `componentType` values sent from JS. Keep in sync with `LockComponentType` in src/types/KeyboardFocusLock.types.ts.
  private static final int TYPE_TRAP = 0;

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
    view.setTrap(value == TYPE_TRAP);
  }

  @Override
  @ReactProp(name = "lockDisabled")
  public void setLockDisabled(ExternalKeyboardLockView view, boolean value) {
    view.setLockDisabled(value);
  }

  @Override
  @ReactProp(name = "forceLock")
  public void setForceLock(ExternalKeyboardLockView view, boolean value) {
    // Android already restores focus for every enabled trap; forceLock never overrides lockDisabled.
  }
}
