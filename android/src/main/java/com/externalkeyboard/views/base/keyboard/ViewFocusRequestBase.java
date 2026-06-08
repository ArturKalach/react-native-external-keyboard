package com.externalkeyboard.views.base.keyboard;

import android.content.Context;
import android.view.View;
import android.view.ViewTreeObserver;
import android.view.accessibility.AccessibilityEvent;


public class ViewFocusRequestBase extends ViewFocusChangeBase {
  public boolean autoFocus = false;
  public boolean hasBeenFocused = false;
  public boolean hasBeenA11yFocused = false;

  public boolean screenAutoA11yFocus = false;

  public int screenAutoA11yFocusDelay = 500;

  public ViewFocusRequestBase(Context context) {
    super(context);
  }

  private void onRnScreenViewAppear() {
    boolean a11yAutoFocus = autoFocus && !hasBeenA11yFocused && screenAutoA11yFocus;
    if (!a11yAutoFocus) return;

    hasBeenA11yFocused = true;
    View focusingView = this.getFocusingView();
    focusingView.postDelayed(() -> focus(false, true), screenAutoA11yFocusDelay);
  }

  @Override
  protected void onAttachedToWindow() {
    super.onAttachedToWindow();

    if (autoFocus && !hasBeenFocused) {
      this.autoFocusOnDraw();
      hasBeenFocused = true;
    }
  }

  private void autoFocusOnDraw() {
    getViewTreeObserver().addOnPreDrawListener(new ViewTreeObserver.OnPreDrawListener() {
      @Override
      public boolean onPreDraw() {
        onRnScreenViewAppear();
        getViewTreeObserver().removeOnPreDrawListener(this);
        focus();

        return true;
      }
    });
  }

  public void a11yFocus() {
    View focusingView = this.getFocusingView();
    focusingView.sendAccessibilityEvent(AccessibilityEvent.TYPE_VIEW_FOCUSED);
  }

  public void focus(boolean keyboard, boolean a11y) {
    View focusingView = this.getFocusingView();
    if (keyboard) {
      focusingView.requestFocus();
    }
   if (a11y) {
     a11yFocus();
   }
  }


  public void focus() {
    this.focus(true, true);
  }

}
