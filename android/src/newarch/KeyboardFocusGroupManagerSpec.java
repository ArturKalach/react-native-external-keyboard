package com.externalkeyboard;

import androidx.annotation.Nullable;

import com.facebook.react.viewmanagers.KeyboardFocusGroupManagerInterface;
import com.facebook.react.viewmanagers.KeyboardFocusGroupManagerDelegate;
import com.facebook.react.uimanager.ViewManagerDelegate;
import com.facebook.react.views.view.ReactViewGroup;
import com.facebook.react.views.view.ReactViewManager;

public abstract class KeyboardFocusGroupManagerSpec<T extends ReactViewGroup> extends ReactViewManager implements KeyboardFocusGroupManagerInterface<T> {
  private final ViewManagerDelegate<T> mDelegate;

  public KeyboardFocusGroupManagerSpec() {
    mDelegate = new KeyboardFocusGroupManagerDelegate(this);
  }

  @Nullable
  @Override
  protected ViewManagerDelegate<T> getDelegate() {
    return mDelegate;
  }
}