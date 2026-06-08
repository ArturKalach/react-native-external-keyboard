package com.externalkeyboard;

import android.view.View;

// Marker-free copy of the codegen com.facebook.react.viewmanagers interface.
// See ExternalKeyboardViewManagerInterface for rationale.
public interface ExternalKeyboardLockViewManagerInterface<T extends View> {
  void setComponentType(T view, int value);
  void setLockDisabled(T view, boolean value);
  void setForceLock(T view, boolean value);
}
