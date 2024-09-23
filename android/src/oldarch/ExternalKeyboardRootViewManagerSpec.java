package com.externalkeyboard;

import android.view.View;

import androidx.annotation.Nullable;

import com.facebook.react.views.view.ReactViewManager;

public abstract class ExternalKeyboardRootViewManagerSpec extends ReactViewManager {
  public abstract void setViewId(View view, @Nullable String value);
}
