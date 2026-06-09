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

  // canBeFocused (and focusableWrapper) own this view's keyboard focusability.
  // Clamp every setFocusable() call so external mutators can't force it on: RN's
  // `accessible` prop (ReactViewManager#setAccessible -> setFocusable(true)) and the
  // AndroidX ExploreByTouchHelper delegate that accessibilityRole/accessibilityActions
  // installs (it sets focusable=true in its constructor). The child focus target is a
  // separate view, so this only governs the container itself.
  @Override
  public void setFocusable(boolean focusable) {
    super.setFocusable(focusable && canBeFocused && !focusableWrapper);
  }

  @Override
  public void setFocusable(int focusable) {
    super.setFocusable(canBeFocused && !focusableWrapper ? focusable : View.NOT_FOCUSABLE);
  }

  protected void syncFocusable () {
    View view = getFocusTargetView();
    boolean containerFocus = !focusableWrapper && canBeFocused;
    this.setFocusable(containerFocus);
    if (view != null) {
      view.setFocusable(canBeFocused);
    }
  }
}
