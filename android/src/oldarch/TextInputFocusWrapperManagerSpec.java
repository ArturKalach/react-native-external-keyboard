package com.externalkeyboard;

import android.view.ViewGroup;

import com.externalkeyboard.views.TextInputFocusWrapper.TextInputFocusWrapper;
import com.facebook.react.uimanager.ViewGroupManager;

public abstract class TextInputFocusWrapperManagerSpec<T extends ViewGroup> extends ViewGroupManager<T> {
  public abstract void setCanBeFocused(T wrapper, boolean canBeFocused);

  public abstract void setFocusType(T wrapper, int focusType);

  public abstract void setBlurType(T wrapper, int blurType);

  public abstract void setHaloEffect(TextInputFocusWrapper view, boolean value);

  public abstract void setTintColor(TextInputFocusWrapper view, String value);
}
