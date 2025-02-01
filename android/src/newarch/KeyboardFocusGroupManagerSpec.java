package com.externalkeyboard;

import com.facebook.react.viewmanagers.KeyboardFocusGroupManagerInterface;
import com.facebook.react.views.view.ReactViewGroup;
import com.facebook.react.views.view.ReactViewManager;

public abstract class KeyboardFocusGroupManagerSpec<T extends ReactViewGroup> extends ReactViewManager implements KeyboardFocusGroupManagerInterface<T> {
}
