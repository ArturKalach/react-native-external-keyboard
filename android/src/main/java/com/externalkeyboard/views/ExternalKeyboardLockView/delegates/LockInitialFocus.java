package com.externalkeyboard.views.ExternalKeyboardLockView.delegates;

import androidx.annotation.NonNull;

/**
 * Moves focus inside a trap once, on first attach; later escapes restore the previous element, not the first one. The
 * screen-reader half only runs while TalkBack is on.
 */
public final class LockInitialFocus {
  private final LockHost host;
  private boolean done = false;
  private final Runnable task = this::run;

  public LockInitialFocus(@NonNull LockHost host) {
    this.host = host;
  }

  /** Posts the move if this is an enabled, attached trap that has not focused yet. */
  public void schedule() {
    cancel();
    if (host.isAttachedToWindow() && host.isActiveCandidate() && !done) {
      host.post(task);
    }
  }

  public void cancel() {
    host.removeCallbacks(task);
  }

  /** The next {@link #schedule()} focuses again, e.g. after the view changed between trap and frame. */
  public void reset() {
    done = false;
  }

  private void run() {
    if (host.activeTrap() != host) {
      return;
    }
    done = true;
    host.screenReader().focusFirst();
    host.keyboard().focusFirst();
  }
}
