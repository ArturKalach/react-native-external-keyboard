package com.externalkeyboard;


import com.externalkeyboard.views.ExternalKeyboardLockView.ExternalKeyboardLockView;
import com.facebook.react.views.view.ReactViewManager;


public abstract class ExternalKeyboardLockViewManagerSpec<T extends ExternalKeyboardLockView> extends ReactViewManager {
  public abstract void setComponentType(T view, int value);
  public abstract void setLockDisabled(T view, boolean value);
}

