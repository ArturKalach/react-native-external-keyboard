package com.externalkeyboard.views.KeyboardFocusGroup;

import androidx.annotation.Nullable;

import com.facebook.react.module.annotations.ReactModule;
import com.facebook.react.uimanager.ThemedReactContext;
import com.facebook.react.uimanager.annotations.ReactProp;

@ReactModule(name = KeyboardFocusGroupManager.NAME)
public class KeyboardFocusGroupManager extends com.externalkeyboard.KeyboardFocusGroupManagerSpec<KeyboardFocusGroup> {
  public static final String NAME = "KeyboardFocusGroup";

  @Override
  public String getName() {
    return NAME;
  }

  @Override
  public KeyboardFocusGroup createViewInstance(ThemedReactContext context) {
    return new KeyboardFocusGroup(context);
  }


  @Override
  @ReactProp(name = "tintColor")
  public void setTintColor(KeyboardFocusGroup view, @Nullable Integer value) {
    //stub
  }

  @Override
  @ReactProp(name = "groupIdentifier")
  public void setGroupIdentifier(KeyboardFocusGroup wrapper, String groupIdentifier) {
    //stub
  }

  @Override
  @ReactProp(name = "orderGroup")
  public void setOrderGroup(KeyboardFocusGroup view, @Nullable String value) {

  }
}
