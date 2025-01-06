package com.externalkeyboard;

import android.view.ViewGroup;

import androidx.annotation.Nullable;

import com.externalkeyboard.views.ExternalKeyboardView.ExternalKeyboardView;
import com.facebook.react.views.view.ReactViewManager;

public abstract class ExternalKeyboardViewManagerSpec<T extends ViewGroup> extends ReactViewManager {
  public abstract void setCanBeFocused(T wrapper, boolean canBeFocused);

  public abstract void setHasKeyDownPress(T view, boolean value);

  public abstract void setHasKeyUpPress(T view, boolean value);

  public abstract void focus(ExternalKeyboardView view);

  public abstract void setAutoFocus(ExternalKeyboardView view, @Nullable boolean value);

  public abstract void setTintColor(ExternalKeyboardView view, @Nullable Integer value);

  public abstract void setHasOnFocusChanged(ExternalKeyboardView view, boolean value);

  public abstract void setHaloEffect(ExternalKeyboardView view, boolean value);

  public abstract void setGroup(ExternalKeyboardView view, boolean value);

  public abstract void setHaloCornerRadius(ExternalKeyboardView view, float value);

  public abstract void setHaloExpendX(ExternalKeyboardView view, float value);

  public abstract void setHaloExpendY(ExternalKeyboardView view, float value);
}
