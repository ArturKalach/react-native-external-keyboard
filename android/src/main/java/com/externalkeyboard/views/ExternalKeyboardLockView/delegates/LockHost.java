package com.externalkeyboard.views.ExternalKeyboardLockView.delegates;

import android.content.Context;
import android.view.ViewGroup;

import androidx.annotation.NonNull;
import androidx.annotation.Nullable;

/** What the lock delegates read from the view, and what a frame reads from the active trap. */
public interface LockHost {
  Context getContext();
  boolean post(Runnable action);
  boolean removeCallbacks(Runnable action);
  boolean isAttachedToWindow();
  @NonNull ViewGroup getView();
  /** Trap or frame, as sent from JS. */
  boolean isTrap();
  /** A trap that is not disabled; frames and disabled traps never are. */
  boolean isActiveCandidate();
  /** The newest enabled trap in this view's window, or null. */
  @Nullable LockHost activeTrap();
  @NonNull LockKeyboard keyboard();
  @NonNull LockScreenReader screenReader();
}
