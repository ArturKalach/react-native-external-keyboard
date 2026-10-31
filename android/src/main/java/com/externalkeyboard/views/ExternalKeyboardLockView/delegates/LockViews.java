package com.externalkeyboard.views.ExternalKeyboardLockView.delegates;

import android.view.View;
import android.view.ViewParent;

import androidx.annotation.NonNull;
import androidx.annotation.Nullable;

final class LockViews {
  private LockViews() {
  }

  /** Whether {@code view} is below {@code lock}; the lock itself does not count. */
  static boolean isDescendant(@NonNull View lock, @Nullable View view) {
    if (view == null) {
      return false;
    }
    for (ViewParent parent = view.getParent(); parent != null; parent = parent.getParent()) {
      if (parent == lock) {
        return true;
      }
    }
    return false;
  }

  /** The lock or a view below it that is attached and shown. */
  static boolean isLiveInside(@NonNull View lock, @Nullable View view) {
    return view != null && (view == lock || isDescendant(lock, view))
      && view.isAttachedToWindow() && view.isShown();
  }
}
