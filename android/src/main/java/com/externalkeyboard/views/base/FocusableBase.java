package com.externalkeyboard.views.base;

import android.content.Context;
import android.view.View;

public class FocusableBase extends FocusHighlightBase {
  protected boolean canBeFocused = true;

  public FocusableBase(Context context) {
    super(context);
  }

  public void setCanBeFocused (boolean isCanBeFocused) {
    canBeFocused = isCanBeFocused;
    syncFocusable();
  }

  @Override
  public void setFocusableWrapper (boolean isFocusableWrapper) {
    super.setFocusableWrapper(isFocusableWrapper);
    syncFocusable();
  }

  @Override
  public void linkAddView(View child) {
    super.linkAddView(child);
    syncFocusable();
  }

  protected void syncFocusable () {
    View view = getFocusTargetView();
    if (view != null) {
      view.setFocusable(canBeFocused);
    }
  }
}
