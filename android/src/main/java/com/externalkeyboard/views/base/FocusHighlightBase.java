package com.externalkeyboard.views.base;

import android.content.Context;
import android.os.Build;
import android.view.View;

public class FocusHighlightBase extends ViewOrderGroupBase {
  protected boolean focusHighlight = true;

  public void setFocusHighlight (boolean defaultFocusHighlightEnabled) {
    focusHighlight = defaultFocusHighlightEnabled;
    syncFocusHighlight();
  }

  protected View getFocusHighlightView () {
    return this.getFirstChild();
  }

  protected void syncFocusHighlight () {
    if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.O) {
      View child = this.getFocusHighlightView();
      if(child != null) {
        child.setDefaultFocusHighlightEnabled(focusHighlight);
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
