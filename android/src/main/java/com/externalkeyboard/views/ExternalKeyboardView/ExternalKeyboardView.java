package com.externalkeyboard.views.ExternalKeyboardView;

import android.content.Context;
import android.util.AttributeSet;
import android.view.ViewGroup;

import androidx.annotation.Nullable;

import com.facebook.react.views.view.ReactViewGroup;

public class ExternalKeyboardView extends ReactViewGroup {
  public boolean hasKeyDownListener = false;
  public boolean hasKeyUpListener = false;

  public ExternalKeyboardView(Context context) {
    super(context);
  }
}
