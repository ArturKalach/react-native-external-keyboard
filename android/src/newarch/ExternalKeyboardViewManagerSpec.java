package com.externalkeyboard;

import androidx.annotation.Nullable;

import com.facebook.react.viewmanagers.ExternalKeyboardViewManagerInterface;
import com.facebook.react.viewmanagers.ExternalKeyboardViewManagerDelegate;
import com.facebook.react.uimanager.ViewManagerDelegate;
import com.facebook.react.views.view.ReactViewGroup;
import com.facebook.react.views.view.ReactViewManager;

public abstract class ExternalKeyboardViewManagerSpec<T extends ReactViewGroup> extends ReactViewManager implements ExternalKeyboardViewManagerInterface<T> {
  private final ViewManagerDelegate<T> mDelegate;

  public ExternalKeyboardViewManagerSpec() {
    mDelegate = new ExternalKeyboardViewManagerDelegate(this);
  }

  @Nullable
  @Override
  protected ViewManagerDelegate<T> getDelegate() {
    return mDelegate;
  }
}