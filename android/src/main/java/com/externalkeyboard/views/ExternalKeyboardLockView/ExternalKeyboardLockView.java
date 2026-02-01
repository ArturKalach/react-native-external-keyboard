package com.externalkeyboard.views.ExternalKeyboardLockView;

import android.content.Context;
import android.view.View;
import android.view.ViewGroup;
import android.view.accessibility.AccessibilityEvent;

import com.externalkeyboard.helper.FocusHelper;
import com.facebook.react.views.view.ReactViewGroup;

public class ExternalKeyboardLockView extends ReactViewGroup {
  private int componentType;
  private Boolean lockDisable = false;

  public ExternalKeyboardLockView(Context context) {
    super(context);
  }

  public static boolean isParentOf(ViewGroup parent, View child) {
    View current = child;
    while (current.getParent() instanceof View) {
      current = (View) current.getParent();
      if (current == parent) {
        return true;
      }
    }
    return false;
  }

  public void setComponentType(int value) {
    this.componentType = value;
  }

  public void setLockDisabled(boolean lockDisabled) {
    this.lockDisable = lockDisabled;
  }

  @Override
  public View focusSearch(View focused, int direction) {
    try {
      LockService lockService = LockService.getInstance();

      if (componentType == 1) {
        View keyboardView = lockService.getKeyboardView();
        if (keyboardView != null && keyboardView != focused) {
          return keyboardView;
        }
        return super.focusSearch(focused, direction);
      }

      if (componentType == 0) {
        View nextView = super.focusSearch(focused, direction);
        View result = isParentOf(this, nextView) ? nextView : focused;
        lockService.setKeyboardView(result);
        return result;
      }

      return super.focusSearch(focused, direction);
    } catch (Exception e) {
      return focused;
    }
  }

  @Override
  public boolean onRequestSendAccessibilityEvent(View child, AccessibilityEvent event) {
    if (this.lockDisable) {
      return super.onRequestSendAccessibilityEvent(child, event);
    }

    if (event.getEventType() != AccessibilityEvent.TYPE_VIEW_ACCESSIBILITY_FOCUSED) {
      return super.onRequestSendAccessibilityEvent(child, event);
    }

    LockService lockService = LockService.getInstance();

    if (componentType == 0) {
      lockService.setView(child);
      return false;
    }

    if (componentType == 1) {
      View storedView = lockService.getView();
      if (storedView != null && storedView != child) {
        storedView.sendAccessibilityEvent(AccessibilityEvent.TYPE_VIEW_FOCUSED);
        return false;
      }
    }

    return super.onRequestSendAccessibilityEvent(child, event);
  }

  @Override
  protected void onAttachedToWindow() {
    super.onAttachedToWindow();
    this.post(this::focusFirstAccessible);
  }

  @Override
  protected void onDetachedFromWindow() {
    super.onDetachedFromWindow();
    LockService.getInstance().clear();
  }

  private void focusFirstAccessible() {
    View firstAccessible = FocusHelper.findFirstAccessible(this);
    if (firstAccessible != null) {
      firstAccessible.sendAccessibilityEvent(AccessibilityEvent.TYPE_VIEW_FOCUSED);
    }

    View firstFocusable = FocusHelper.findFirstFocusable(this);
    if (firstFocusable != null) {
      firstFocusable.requestFocus();
    }
  }
}
