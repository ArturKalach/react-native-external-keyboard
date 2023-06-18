package com.externalkeyboard;

import android.graphics.Color;

import androidx.annotation.Nullable;

import com.facebook.react.module.annotations.ReactModule;
import com.facebook.react.uimanager.ThemedReactContext;
import com.facebook.react.uimanager.annotations.ReactProp;

@ReactModule(name = ExternalKeyboardViewManager.NAME)
public class ExternalKeyboardViewManager extends ExternalKeyboardViewManagerSpec<ExternalKeyboardView> {

  public static final String NAME = "ExternalKeyboardView";

  @Override
  public String getName() {
    return NAME;
  }

  @Override
  public ExternalKeyboardView createViewInstance(ThemedReactContext context) {
    return new ExternalKeyboardView(context);
  }

  @Override
  @ReactProp(name = "color")
  public void setColor(ExternalKeyboardView view, @Nullable String color) {
    view.setBackgroundColor(Color.parseColor(color));
  }
}
