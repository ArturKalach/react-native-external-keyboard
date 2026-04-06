package com.externalkeyboard;

import android.view.ViewGroup;

import androidx.annotation.Nullable;

import com.externalkeyboard.views.TextInputFocusWrapper.TextInputFocusWrapper;
import com.facebook.react.uimanager.ViewGroupManager;

public abstract class TextInputFocusWrapperManagerSpec<T extends ViewGroup> extends ViewGroupManager<T> {
  public abstract void setCanBeFocused(T wrapper, boolean canBeFocused);

  public abstract void setFocusType(T wrapper, int focusType);

  public abstract void setBlurType(T wrapper, int blurType);

  public abstract void setHaloEffect(TextInputFocusWrapper view, boolean value);

  public abstract void setTintColor(TextInputFocusWrapper view, Integer value);

  public abstract void setBlurOnSubmit(TextInputFocusWrapper view, boolean value);

  public abstract void setMultiline(TextInputFocusWrapper view, boolean value);

  public abstract void setGroupIdentifier(TextInputFocusWrapper view, @Nullable String value);

  public abstract void setOrderGroup(TextInputFocusWrapper view, @Nullable String value);

  public abstract void setOrderIndex(TextInputFocusWrapper view, int value);

  public abstract void setOrderId(TextInputFocusWrapper view, @Nullable String value);

  public abstract void setOrderLeft(TextInputFocusWrapper view, @Nullable String value);

  public abstract void setOrderRight(TextInputFocusWrapper view, @Nullable String value);

  public abstract void setOrderUp(TextInputFocusWrapper view, @Nullable String value);

  public abstract void setOrderDown(TextInputFocusWrapper view, @Nullable String value);

  public abstract void setOrderForward(TextInputFocusWrapper view, @Nullable String value);

  public abstract void setOrderBackward(TextInputFocusWrapper view, @Nullable String value);

  public abstract void setLockFocus(TextInputFocusWrapper view, int value);

  public abstract void setOrderFirst(TextInputFocusWrapper view, @Nullable String value);

  public abstract void setOrderLast(TextInputFocusWrapper view, @Nullable String value);
}
