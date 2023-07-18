package com.externalkeyboard;

import android.view.ViewGroup;

import com.facebook.react.uimanager.ViewGroupManager;

public abstract class ExternalKeyboardViewManagerSpec<T extends ViewGroup> extends ViewGroupManager<T> {
  public abstract void setCanBeFocused(T wrapper, boolean canBeFocused);
}
