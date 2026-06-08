package com.externalkeyboard.views.base;

import android.content.Context;
import android.os.Build;
import android.view.View;

public class FocusHighlightBase extends ViewOrderGroupBase {
  protected boolean focusHighlight = true;
  protected boolean focusableWrapper = true;

  public void setFocusHighlight (boolean defaultFocusHighlightEnabled) {
    focusHighlight = defaultFocusHighlightEnabled;
    syncFocusHighlight();
  }

  public void setFocusableWrapper (boolean isFocusableWrapper) {
    focusableWrapper = isFocusableWrapper;
    syncFocusHighlight();
  }

  protected View getFocusTargetView () {
    return focusableWrapper ? this.getFirstChild() : this;
  }

  protected void syncFocusHighlight () {
    if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.O) {
      View view = getFocusTargetView();
      if(view != null) {
        view.setDefaultFocusHighlightEnabled(focusHighlight);
      }
    }
  }

  @Override
  public void linkAddView(View child) {
    super.linkAddView(child);
    syncFocusHighlight();
  }

  public FocusHighlightBase(Context context) {
    super(context);
  }

}
