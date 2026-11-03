package com.externalkeyboard;

import android.view.View;
import androidx.annotation.Nullable;

// Marker-free copy of the codegen com.facebook.react.viewmanagers interface.
// See ExternalKeyboardViewManagerInterface for rationale.
public interface KeyboardFocusGuideManagerInterface<T extends View> {
  void setPreferredFocusOrderId(T view, @Nullable String value);
  void setEnabled(T view, boolean value);
  void setGuideMask(T view, int value);
  void setGroupIdentifier(T view, @Nullable String value);
  void setUniqueGroupIdentifierEnabled(T view, boolean value);
}
