package com.externalkeyboard;

import android.view.ViewGroup;

import androidx.annotation.Nullable;

import com.externalkeyboard.views.KeyboardFocusGroup.KeyboardFocusGroup;
import com.facebook.react.uimanager.ViewGroupManager;

public abstract class KeyboardFocusGroupManagerSpec<T extends ViewGroup> extends ViewGroupManager<T> {
  public abstract void setTintColor(T wrapper, Integer value);
  public abstract void setGroupIdentifier(T wrapper, String groupIdentifier);

  public abstract void setOrderGroup(KeyboardFocusGroup view, @Nullable String value);
}
