package com.externalkeyboard;

import androidx.annotation.Nullable;

import com.facebook.react.views.view.ReactViewGroup;
import com.facebook.react.views.view.ReactViewManager;

public abstract class KeyboardFocusGuideManagerSpec<T extends ReactViewGroup> extends ReactViewManager {
  public abstract void setPreferredFocusOrderId(T view, @Nullable String value);
  public abstract void setEnabled(T view, boolean value);
  public abstract void setGuideMask(T view, int value);
  public abstract void setGroupIdentifier(T view, @Nullable String value);
  public abstract void setUniqueGroupIdentifierEnabled(T view, boolean value);
}
