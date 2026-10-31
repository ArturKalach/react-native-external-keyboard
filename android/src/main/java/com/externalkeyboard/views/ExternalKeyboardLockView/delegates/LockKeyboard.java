package com.externalkeyboard.views.ExternalKeyboardLockView.delegates;

import android.view.FocusFinder;
import android.view.View;
import android.view.ViewGroup;
import android.view.ViewTreeObserver;

import androidx.annotation.NonNull;
import androidx.annotation.Nullable;

import java.lang.ref.WeakReference;

/** Physical-keyboard half of the lock: records focus inside a trap, contains traversal and pulls escaped focus back. */
public final class LockKeyboard {
  private final LockHost host;

  // Where keyboard focus last was inside the trap.
  private WeakReference<View> focus = new WeakReference<>(null);
  private boolean restoring = false;
  private final ViewTreeObserver.OnGlobalFocusChangeListener focusChangeListener = this::onGlobalFocusChanged;

  public LockKeyboard(@NonNull LockHost host) {
    this.host = host;
  }

  public void attach() {
    host.getView().getViewTreeObserver().addOnGlobalFocusChangeListener(focusChangeListener);
  }

  public void detach() {
    ViewTreeObserver observer = host.getView().getViewTreeObserver();
    if (observer.isAlive()) {
      observer.removeOnGlobalFocusChangeListener(focusChangeListener);
    }
    focus.clear();
  }

  /** Moves keyboard focus to the first focusable view, unless something inside already has it. */
  void focusFirst() {
    if (host.getView().hasFocus()) {
      return;
    }
    View first = findFirstFocusable();
    if (first != null) {
      first.requestFocus();
    }
  }

  /**
   * Programmatic `requestFocus()` never goes through {@code focusSearch}, so a trap also watches focus changes and
   * pulls focus back when it lands outside: to the view that had it if that was inside, else to the recorded one.
   */
  private void onGlobalFocusChanged(@Nullable View oldFocus, @Nullable View newFocus) {
    ViewGroup lock = host.getView();
    if (newFocus == null || restoring) {
      return;
    }
    if (newFocus == lock || LockViews.isDescendant(lock, newFocus)) {
      focus = new WeakReference<>(newFocus);
      return;
    }
    if (host.activeTrap() != host) {
      return;
    }

    View target = isRestoreTarget(oldFocus) ? oldFocus : restoreTarget();
    if (target == null) {
      return;
    }

    restoring = true;
    try {
      target.requestFocus();
    } finally {
      restoring = false;
    }
  }

  /**
   * Where a keyboard move from {@code focused} must go, or null to let the view search normally. Only the active trap
   * constrains traversal; older traps must not fight it.
   */
  @Nullable
  public View focusSearch(View focused, int direction) {
    if (!host.isTrap()) {
      return frameRedirect(focused);
    }
    return host.activeTrap() == host ? trapFocusSearch(focused, direction) : null;
  }

  /**
   * Searches only the trap's subtree; the focus listener records where focus lands. Filtering a window-wide search instead would
   * block arrows whenever the nearest view in that direction is outside, e.g. behind an overlay. Tab and Shift-Tab
   * wrap around at the ends, as in a dialog window, including when the last view links outside via `nextFocusForward`.
   */
  private View trapFocusSearch(View focused, int direction) {
    ViewGroup lock = host.getView();
    FocusFinder finder = FocusFinder.getInstance();
    View next = finder.findNextFocus(lock, focused, direction);
    boolean inside = LockViews.isDescendant(lock, next);
    if (!inside && isTab(direction)) {
      next = finder.findNextFocus(lock, null, direction);
      inside = LockViews.isDescendant(lock, next);
    }
    return inside ? next : focused;
  }

  private static boolean isTab(int direction) {
    return direction == View.FOCUS_FORWARD || direction == View.FOCUS_BACKWARD;
  }

  /**
   * For a frame: the view in the newest trap that a move from {@code focused} must go to instead, or null if the
   * move may continue normally (no trap, focus already inside it, or nothing to restore to).
   */
  @Nullable
  private View frameRedirect(View focused) {
    LockHost trap = host.activeTrap();
    if (trap != null) {
      ViewGroup trapView = trap.getView();
      if (focused == trapView || LockViews.isDescendant(trapView, focused)) {
        return null;
      }
    }
    View target = trap != null ? trap.keyboard().restoreTarget() : null;
    return target != null && target != focused ? target : null;
  }

  /** The recorded keyboard focus if it is still inside, else the first focusable view. */
  @Nullable
  View restoreTarget() {
    View view = focus.get();
    if (isRestoreTarget(view)) {
      return view;
    }
    focus.clear();
    return findFirstFocusable();
  }

  private boolean isRestoreTarget(@Nullable View view) {
    return LockViews.isLiveInside(host.getView(), view) && view.isEnabled() && view.isFocusable();
  }

  /** The first view of the trap's own keyboard order, so visibility and `nextFocusForward` are honored. */
  @Nullable
  private View findFirstFocusable() {
    ViewGroup lock = host.getView();
    View first = FocusFinder.getInstance().findNextFocus(lock, null, View.FOCUS_FORWARD);
    return first == lock || LockViews.isDescendant(lock, first) ? first : null;
  }
}
