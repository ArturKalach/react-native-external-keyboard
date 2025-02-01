package com.externalkeyboard;

import android.view.ViewGroup;

import androidx.annotation.Nullable;

import com.facebook.react.uimanager.ViewGroupManager;
import com.facebook.react.uimanager.ViewManagerDelegate;
import com.facebook.react.viewmanagers.TextInputFocusWrapperManagerDelegate;
import com.facebook.react.viewmanagers.TextInputFocusWrapperManagerInterface;

public abstract class TextInputFocusWrapperManagerSpec<T extends ViewGroup> extends ViewGroupManager<T> implements TextInputFocusWrapperManagerInterface<T> {
  private final ViewManagerDelegate<T> mDelegate;

  public TextInputFocusWrapperManagerSpec() {
    mDelegate = new TextInputFocusWrapperManagerDelegate(this);
  }

  @Nullable
  @Override
  protected ViewManagerDelegate<T> getDelegate() {
    return mDelegate;
  }
}
