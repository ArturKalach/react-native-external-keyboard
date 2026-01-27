package com.externalkeyboard;

import com.facebook.react.viewmanagers.ExternalKeyboardLockViewManagerInterface;
import com.facebook.react.views.view.ReactViewGroup;
import com.facebook.react.views.view.ReactViewManager;

public abstract class ExternalKeyboardLockViewManagerSpec<T extends ReactViewGroup> extends ReactViewManager implements ExternalKeyboardLockViewManagerInterface<T> {
}
