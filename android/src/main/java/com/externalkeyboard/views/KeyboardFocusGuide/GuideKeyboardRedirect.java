package com.externalkeyboard.views.KeyboardFocusGuide;

import android.view.View;

import androidx.annotation.NonNull;
import androidx.annotation.Nullable;

import com.externalkeyboard.helper.FocusHelper;

/** Decides whether a keyboard move onto the guide is handed to the target. */
final class GuideKeyboardRedirect {
  private final GuideHost host;

  GuideKeyboardRedirect(@NonNull GuideHost host) {
    this.host = host;
  }

  /** The view to focus instead of the guide, or null if the move should continue past it. */
  @Nullable
  View targetFor(int direction) {
    View target = host.getTarget();
    // A move that starts from the target must not bounce back to it (same as iOS).
    if (target == null || target.hasFocus()) return null;

    boolean isTab = direction == View.FOCUS_FORWARD || direction == View.FOCUS_BACKWARD;
    boolean screenReaderRunning = FocusHelper.isA11yServiceEnabled(host.getContext());
    boolean redirects = host.getMask().redirectsKeyboard(
      isTab ? GuideMask.TAB : GuideMask.ARROWS, screenReaderRunning);
    return redirects ? target : null;
  }
}
