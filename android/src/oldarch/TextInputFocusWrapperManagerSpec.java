package com.externalkeyboard;

import android.view.ViewGroup;

import com.facebook.react.uimanager.ViewGroupManager;

public abstract class TextInputFocusWrapperManagerSpec<T extends ViewGroup> extends ViewGroupManager<T> {
  public abstract void setCanBeFocused(T wrapper, boolean canBeFocused);

  public abstract void setFocusType(T wrapper, int focusType);

  public abstract void setBlurType(T wrapper, int blurType);
}
