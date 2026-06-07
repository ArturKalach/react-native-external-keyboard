package com.externalkeyboard;

import android.view.View;
import androidx.annotation.Nullable;

// Marker-free copy of the codegen com.facebook.react.viewmanagers interface.
// See ExternalKeyboardViewManagerInterface for rationale.
public interface TextInputFocusWrapperManagerInterface<T extends View> {
  void setFocusType(T view, int value);
  void setBlurType(T view, int value);
  void setCanBeFocused(T view, boolean value);
  void setHasOnFocusChanged(T view, boolean value);
  void setHaloEffect(T view, boolean value);
  void setHaloCornerRadius(T view, float value);
  void setHaloExpendX(T view, float value);
  void setHaloExpendY(T view, float value);
  void setRoundedHaloFix(T view, boolean value);
  void setTintColor(T view, @Nullable Integer value);
  void setBlurOnSubmit(T view, boolean value);
  void setMultiline(T view, boolean value);
  void setGroupIdentifier(T view, @Nullable String value);
  void setLockFocus(T view, int value);
  void setOrderGroup(T view, @Nullable String value);
  void setOrderIndex(T view, int value);
  void setOrderId(T view, @Nullable String value);
  void setOrderLeft(T view, @Nullable String value);
  void setOrderRight(T view, @Nullable String value);
  void setOrderUp(T view, @Nullable String value);
  void setOrderDown(T view, @Nullable String value);
  void setOrderForward(T view, @Nullable String value);
  void setOrderBackward(T view, @Nullable String value);
  void setOrderFirst(T view, @Nullable String value);
  void setOrderLast(T view, @Nullable String value);
}
