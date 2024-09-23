package com.externalkeyboard.views.ExternalKeyboardRootView;

import android.view.View;

import androidx.annotation.NonNull;
import androidx.annotation.Nullable;

import com.facebook.react.uimanager.ThemedReactContext;
import com.facebook.react.views.view.ReactViewGroup;

public class ExternalKeyboardRootViewManager extends com.externalkeyboard.ExternalKeyboardRootViewManagerSpec {
  public static final String REACT_CLASS = "ExternalKeyboardRootView";

  @NonNull
  public String getName() {
    return REACT_CLASS;
  }

  @NonNull
  public ReactViewGroup createViewInstance(@NonNull ThemedReactContext context) {
    return new ReactViewGroup(context);
  }

  @Override
  public void setViewId(View view, @Nullable String value) {
    //stub
  }
}
