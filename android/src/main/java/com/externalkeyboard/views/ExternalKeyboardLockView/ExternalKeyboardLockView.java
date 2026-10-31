package com.externalkeyboard.views.ExternalKeyboardLockView;

import android.content.Context;
import android.view.View;
import android.view.ViewGroup;
import android.view.accessibility.AccessibilityEvent;

import androidx.annotation.NonNull;
import androidx.annotation.Nullable;

import com.externalkeyboard.views.ExternalKeyboardLockView.delegates.LockHost;
import com.externalkeyboard.views.ExternalKeyboardLockView.delegates.LockInitialFocus;
import com.externalkeyboard.views.ExternalKeyboardLockView.delegates.LockKeyboard;
import com.externalkeyboard.views.ExternalKeyboardLockView.delegates.LockScreenReader;
import com.externalkeyboard.views.ExternalKeyboardLockView.delegates.TrapRegistry;
import com.facebook.react.views.view.ReactViewGroup;

/** Native view behind `Focus.Trap` and `Focus.Frame`. The focus logic lives in {@code delegates/}. */
public class ExternalKeyboardLockView extends ReactViewGroup implements LockHost {
  private boolean isTrap = true;
  private boolean lockDisabled = false;

  private final LockKeyboard keyboard = new LockKeyboard(this);
  private final LockScreenReader screenReader = new LockScreenReader(this);
  private final LockInitialFocus initialFocus = new LockInitialFocus(this);

  public ExternalKeyboardLockView(Context context) {
    super(context);
  }

  // ---- Props ------------------------------------------------------------------------------------------------------

  public void setTrap(boolean isTrap) {
    if (this.isTrap == isTrap) {
      return;
    }
    unregisterTrap();
    this.isTrap = isTrap;
    initialFocus.reset();
    if (isAttachedToWindow()) {
      registerTrap();
    }
  }

  public void setLockDisabled(boolean lockDisabled) {
    this.lockDisabled = lockDisabled;
    initialFocus.schedule();
  }

  // ---- LockHost ---------------------------------------------------------------------------------------------------

  @NonNull
  @Override
  public ViewGroup getView() {
    return this;
  }

  @Override
  public boolean isTrap() {
    return isTrap;
  }

  @Override
  public boolean isActiveCandidate() {
    return isTrap && !lockDisabled;
  }

  @Nullable
  @Override
  public LockHost activeTrap() {
    return TrapRegistry.activeTrap(getRootView());
  }

  @NonNull
  @Override
  public LockKeyboard keyboard() {
    return keyboard;
  }

  @NonNull
  @Override
  public LockScreenReader screenReader() {
    return screenReader;
  }

  // ---- Lifecycle --------------------------------------------------------------------------------------------------

  @Override
  protected void onAttachedToWindow() {
    super.onAttachedToWindow();
    registerTrap();
  }

  private void registerTrap() {
    if (isTrap) {
      TrapRegistry.add(this);
      keyboard.attach();
      initialFocus.schedule();
    }
  }

  @Override
  protected void onDetachedFromWindow() {
    unregisterTrap();
    super.onDetachedFromWindow();
  }

  private void unregisterTrap() {
    initialFocus.cancel();
    TrapRegistry.remove(this);
    keyboard.detach();
    screenReader.clear();
  }

  // ---- Framework overrides ----------------------------------------------------------------------------------------

  @Override
  public View focusSearch(View focused, int direction) {
    try {
      View next = keyboard.focusSearch(focused, direction);
      return next != null ? next : super.focusSearch(focused, direction);
    } catch (RuntimeException e) {
      // FocusFinder can throw, e.g. for a view that is being removed: keep focus where it is instead of crashing.
      return focused;
    }
  }

  @Override
  public boolean onRequestSendAccessibilityEvent(View child, AccessibilityEvent event) {
    if (event.getEventType() == AccessibilityEvent.TYPE_VIEW_ACCESSIBILITY_FOCUSED
      && screenReader.dropsFocusEvent(child)) {
      return false;
    }
    return super.onRequestSendAccessibilityEvent(child, event);
  }
}
