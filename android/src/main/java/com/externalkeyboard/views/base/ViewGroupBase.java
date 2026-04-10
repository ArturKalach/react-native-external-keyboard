package com.externalkeyboard.views.base;

import android.content.Context;
import android.view.View;

import com.externalkeyboard.helper.FocusHelper;
import com.facebook.react.views.view.ReactViewGroup;

public class ViewGroupBase extends ReactViewGroup {

  public ViewGroupBase(Context context) {
    super(context);
  }

  protected View getFocusingView() {
    View focusableView = FocusHelper.getFocusableView(this);
    return focusableView != null ? focusableView : this;
  }
}
