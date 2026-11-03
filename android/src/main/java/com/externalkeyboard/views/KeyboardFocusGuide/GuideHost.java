package com.externalkeyboard.views.KeyboardFocusGuide;

import android.content.Context;
import android.view.View;

import androidx.annotation.NonNull;
import androidx.annotation.Nullable;

/** What the guide delegates read from the view. */
interface GuideHost {
  Context getContext();
  boolean post(Runnable action);
  @NonNull GuideMask getMask();
  boolean isGuideEnabled();
  /** The attached link target, or null. */
  @Nullable View getTarget();
}
