package com.externalkeyboard.views.KeyboardFocusGuide;

import android.view.View;
import android.view.accessibility.AccessibilityEvent;
import android.view.accessibility.AccessibilityNodeInfo;

import androidx.annotation.NonNull;

import com.externalkeyboard.helper.FocusHelper;

/** Moves TalkBack focus from the guide (or one of its children) to the target. */
final class GuideScreenReaderRedirect {
  private final GuideHost host;

  GuideScreenReaderRedirect(@NonNull GuideHost host) {
    this.host = host;
  }

  void onAccessibilityEvent(int eventType) {
    if (eventType != AccessibilityEvent.TYPE_VIEW_ACCESSIBILITY_FOCUSED || !host.isGuideEnabled()) return;
    if (!host.getMask().redirectsScreenReader(FocusHelper.isA11yServiceEnabled(host.getContext()))) return;

    View target = host.getTarget();
    if (target == null) return;

    // Immediately, so the guide is not shown as focused for a frame; deferred only if refused.
    if (!requestFocus(target)) {
      host.post(() -> {
        View current = host.getTarget();
        if (current != null && !requestFocus(current)) FocusHelper.focus(current);
      });
    }
  }

  private static boolean requestFocus(View view) {
    return view.performAccessibilityAction(AccessibilityNodeInfo.ACTION_ACCESSIBILITY_FOCUS, null);
  }
}
