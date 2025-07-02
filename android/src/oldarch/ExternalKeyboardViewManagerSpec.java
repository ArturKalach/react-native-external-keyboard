package com.externalkeyboard;

import android.view.ViewGroup;

import androidx.annotation.Nullable;

import com.externalkeyboard.views.ExternalKeyboardView.ExternalKeyboardView;
import com.facebook.react.uimanager.annotations.ReactProp;
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

  public abstract void setGroupIdentifier(ExternalKeyboardView view, @Nullable String value);

  public abstract void setEnableA11yFocus(ExternalKeyboardView wrapper, boolean enableA11yFocus);

  public abstract void setScreenAutoA11yFocus(ExternalKeyboardView wrapper, boolean enableA11yFocus);

  public abstract void setScreenAutoA11yFocusDelay(ExternalKeyboardView wrapper, int value);

  public abstract void setOrderGroup(ExternalKeyboardView view, @Nullable String value);

  public abstract void setOrderIndex(ExternalKeyboardView view, int value);

  public abstract void setLockFocus(ExternalKeyboardView view, int value);

  public abstract void setOrderId(ExternalKeyboardView view, @Nullable String value);

  public abstract void setOrderLeft(ExternalKeyboardView view, @Nullable String value);

  public abstract void setOrderRight(ExternalKeyboardView view, @Nullable String value);

  public abstract void setOrderUp(ExternalKeyboardView view, @Nullable String value);

  public abstract void setOrderDown(ExternalKeyboardView view, @Nullable String value);

  public abstract void setOrderForward(ExternalKeyboardView view, @Nullable String value);

  public abstract void setOrderBackward(ExternalKeyboardView view, @Nullable String value);

  public abstract void setOrderFirst(ExternalKeyboardView view, @Nullable String value);

  public abstract void setOrderLast(ExternalKeyboardView view, @Nullable String value);
}
