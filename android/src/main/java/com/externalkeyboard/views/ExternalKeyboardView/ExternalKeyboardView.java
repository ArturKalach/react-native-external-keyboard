package com.externalkeyboard.views.ExternalKeyboardView;

import android.content.Context;
import android.util.AttributeSet;
import android.view.ViewGroup;

import androidx.annotation.Nullable;

public class ExternalKeyboardView extends ViewGroup {
  public boolean hasKeyDownListener = false;
  public boolean hasKeyUpListener = false;

  public ExternalKeyboardView(Context context) {
    super(context);
  }

  public ExternalKeyboardView(Context context, @Nullable AttributeSet attrs) {
    super(context, attrs);
  }

  public ExternalKeyboardView(Context context, @Nullable AttributeSet attrs, int defStyleAttr) {
    super(context, attrs, defStyleAttr);
  }

  @Override
  protected void onLayout(boolean changed, int left, int top, int right, int bottom) {
    // No-op since UIManagerModule handles actually laying out children.
  }

}
