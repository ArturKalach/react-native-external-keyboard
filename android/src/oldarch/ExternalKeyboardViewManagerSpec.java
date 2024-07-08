package com.externalkeyboard;

import android.view.ViewGroup;
import com.facebook.react.views.view.ReactViewManager;

public abstract class ExternalKeyboardViewManagerSpec<T extends ViewGroup> extends ReactViewManager {
  public abstract void setCanBeFocused(T wrapper, boolean canBeFocused);

  public abstract void setHasKeyDownPress(T view, boolean value);

  public abstract void setHasKeyUpPress(T view, boolean value);
}
