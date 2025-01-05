package com.externalkeyboard;

import com.facebook.react.viewmanagers.ExternalKeyboardViewManagerInterface;
import com.facebook.react.views.view.ReactViewGroup;
import com.facebook.react.views.view.ReactViewManager;

public abstract class ExternalKeyboardViewManagerSpec<T extends ReactViewGroup> extends ReactViewManager implements ExternalKeyboardViewManagerInterface<T> {
}
