package com.externalkeyboard;

import androidx.annotation.Nullable;

import android.content.Context;
import android.util.AttributeSet;

import android.view.ViewGroup;

public class ExternalKeyboardView extends ViewGroup {

  @Override
  protected void onLayout(boolean changed, int left, int top, int right, int bottom) {
    // No-op since UIManagerModule handles actually laying out children.
  }

  public ExternalKeyboardView(Context context) {
    super(context);
  }

  public ExternalKeyboardView(Context context, @Nullable AttributeSet attrs) {
    super(context, attrs);
  }

  public ExternalKeyboardView(Context context, @Nullable AttributeSet attrs, int defStyleAttr) {
    super(context, attrs, defStyleAttr);
  }

}
