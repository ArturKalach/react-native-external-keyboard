package com.externalkeyboard;

import android.view.View;
import androidx.annotation.Nullable;

// Marker-free copy of the codegen com.facebook.react.viewmanagers interface.
// Intentionally does NOT extend ViewManagerWithGeneratedInterface so that
// ViewManager#getDelegate() takes its default (reflection-based) path instead of
// logging a ReactNoCrashSoftException, while still covering the full @ReactProp
// hierarchy (BaseViewManager + ReactViewManager extras + our props).
public interface ExternalKeyboardViewManagerInterface<T extends View> {
  void setCanBeFocused(T view, boolean value);
  void setHasKeyDownPress(T view, boolean value);
  void setHasKeyUpPress(T view, boolean value);
  void setHasOnFocusChanged(T view, boolean value);
  void setAutoFocus(T view, boolean value);
  void setHaloEffect(T view, boolean value);
  void setHaloCornerRadius(T view, float value);
  void setHaloExpendX(T view, float value);
  void setHaloExpendY(T view, float value);
  void setRoundedHaloFix(T view, boolean value);
  void setTintColor(T view, @Nullable Integer value);
  void setFocusableWrapper(T view, boolean value);
  void setGroupIdentifier(T view, @Nullable String value);
  void setScreenAutoA11yFocus(T view, boolean value);
  void setScreenAutoA11yFocusDelay(T view, int value);
  void setOrderGroup(T view, @Nullable String value);
  void setOrderIndex(T view, int value);
  void setLockFocus(T view, int value);
  void setOrderId(T view, @Nullable String value);
  void setOrderLeft(T view, @Nullable String value);
  void setOrderRight(T view, @Nullable String value);
  void setOrderUp(T view, @Nullable String value);
  void setOrderDown(T view, @Nullable String value);
  void setOrderForward(T view, @Nullable String value);
  void setOrderBackward(T view, @Nullable String value);
  void setOrderFirst(T view, @Nullable String value);
  void setOrderLast(T view, @Nullable String value);
  void setEnableContextMenu(T view, boolean value);
  void rnekKeyboardFocus(T view);
  void rnekScreenReaderFocus(T view);
}
