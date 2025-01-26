package com.externalkeyboard;

import android.view.ViewGroup;

import com.facebook.react.uimanager.ViewGroupManager;

public abstract class KeyboardFocusGroupManagerSpec<T extends ViewGroup> extends ViewGroupManager<T> {
  public abstract void setTintColor(T wrapper, Integer value);
  public abstract void setGroupIdentifier(T wrapper, String groupIdentifier);
}
