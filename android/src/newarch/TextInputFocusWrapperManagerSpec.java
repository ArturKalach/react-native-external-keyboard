package com.externalkeyboard;

import android.view.ViewGroup;

import com.facebook.react.views.view.ReactViewManager;
import com.facebook.react.viewmanagers.TextInputFocusWrapperManagerInterface;

public abstract class TextInputFocusWrapperManagerSpec<T extends ViewGroup> extends ReactViewManager implements TextInputFocusWrapperManagerInterface<T> {
}
