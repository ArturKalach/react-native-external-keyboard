package com.externalkeyboard;

import android.view.View;
import androidx.annotation.Nullable;

// Marker-free copy of the codegen com.facebook.react.viewmanagers interface.
// See ExternalKeyboardViewManagerInterface for rationale.
public interface KeyboardFocusGroupManagerInterface<T extends View> {
  void setTintColor(T view, @Nullable Integer value);
  void setGroupIdentifier(T view, @Nullable String value);
  void setOrderGroup(T view, @Nullable String value);
}
