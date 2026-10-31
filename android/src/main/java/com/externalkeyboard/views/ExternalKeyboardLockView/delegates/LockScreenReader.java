package com.externalkeyboard.views.ExternalKeyboardLockView.delegates;

import android.view.View;
import android.view.ViewGroup;
import android.view.accessibility.AccessibilityNodeInfo;

import androidx.annotation.NonNull;
import androidx.annotation.Nullable;

import com.externalkeyboard.helper.FocusHelper;

import java.lang.ref.WeakReference;

/** TalkBack half of the lock: records accessibility focus inside a trap and sends escaped focus back from a frame. */
public final class LockScreenReader {
  // Set while a frame moves TalkBack focus back, so no frame treats that move as another escape. Static because the
  // restoring frame and the frames that see the resulting event are different instances.
  private static boolean restoring = false;

  private final LockHost host;

  // Where TalkBack focus last was inside the trap.
  private WeakReference<View> focus = new WeakReference<>(null);

  public LockScreenReader(@NonNull LockHost host) {
    this.host = host;
  }

  public void clear() {
    focus.clear();
  }

  /** Moves TalkBack focus to the first accessible view, only while a screen reader runs. */
  void focusFirst() {
    if (!FocusHelper.isA11yServiceEnabled(host.getContext())) {
      return;
    }
    View first = FocusHelper.findFirstAccessible(host.getView());
    if (first != null) {
      first.performAccessibilityAction(AccessibilityNodeInfo.ACTION_ACCESSIBILITY_FOCUS, null);
    }
  }

  /**
   * Handles a TalkBack "accessibility focused" event from {@code child}; returns true if it must be dropped. A trap
   * remembers where focus is. A frame whose focus landed outside the newest trap moves it back and drops the event.
   */
  public boolean dropsFocusEvent(View child) {
    View focused = findAccessibilityFocused(child);
    if (host.isTrap()) {
      if (focused != null && host.isActiveCandidate()) {
        focus = new WeakReference<>(focused);
      }
      return false;
    }
    return restoreIfEscaped(child, focused);
  }

  private boolean restoreIfEscaped(View child, @Nullable View focused) {
    LockHost trap = host.activeTrap();
    if (trap == null || restoring) {
      return false;
    }
    // Check the actual focused node, not a posted flag: nested frames see the event before ancestor traps do.
    ViewGroup trapView = trap.getView();
    if (focused == trapView || LockViews.isDescendant(trapView, focused)
      || child == trapView || LockViews.isDescendant(trapView, child)) {
      return false;
    }
    View target = trap.screenReader().restoreTarget();
    if (target == null || target.isAccessibilityFocused()) {
      return false;
    }

    restoring = true;
    try {
      return target.performAccessibilityAction(AccessibilityNodeInfo.ACTION_ACCESSIBILITY_FOCUS, null);
    } finally {
      restoring = false;
    }
  }

  /** The recorded TalkBack focus if it is still inside and shown, else the first accessible view. */
  @Nullable
  View restoreTarget() {
    View view = focus.get();
    if (LockViews.isLiveInside(host.getView(), view) && FocusHelper.isAccessible(view)) {
      return view;
    }
    focus.clear();
    return FocusHelper.findFirstAccessible(host.getView());
  }

  /** The event's child is an immediate child, not necessarily the node that received focus. */
  @Nullable
  private static View findAccessibilityFocused(View view) {
    if (view.getVisibility() != View.VISIBLE) {
      return null;
    }
    if (view.isAccessibilityFocused()) {
      return view;
    }
    if (view instanceof ViewGroup) {
      ViewGroup group = (ViewGroup) view;
      for (int i = 0; i < group.getChildCount(); i++) {
        View focused = findAccessibilityFocused(group.getChildAt(i));
        if (focused != null) {
          return focused;
        }
      }
    }
    return null;
  }
}
