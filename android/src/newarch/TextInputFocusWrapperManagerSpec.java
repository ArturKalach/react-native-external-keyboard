package com.externalkeyboard;

import android.view.ViewGroup;

import androidx.annotation.Nullable;

import com.facebook.react.views.view.ReactViewManager;
import com.facebook.react.viewmanagers.TextInputFocusWrapperManagerDelegate;

public abstract class TextInputFocusWrapperManagerSpec<T extends ViewGroup> extends ReactViewManager implements TextInputFocusWrapperManagerInterface<T> {
}
