package com.externalkeyboard.services;

import android.view.View;

import androidx.annotation.Nullable;

import java.lang.ref.WeakReference;

/**
 * Remembers the focused view inside an environment and restores it later.
 *
 * Reusable for any "leave then come back" flow — modal presentation, screen
 * navigation, etc. The owner decides <em>when</em> to call store / restore; the
 * only difference between flows is the ordering of those two calls:
 *
 * <pre>
 *   Modal:      store on present, restore on dismiss.
 *   Navigation: store on disappear, restore on appear.
 * </pre>
 *
 * The stored view is held weakly, so it never keeps a detached view alive.
 */
public class FocusMemoryService {
  private WeakReference<View> storedView = new WeakReference<>(null);

  /**
   * Captures the currently focused view in the environment's window.
   */
  public void store(@Nullable View environment) {
    if (environment == null) {
      return;
    }

    storedView = new WeakReference<>(KeyboardFocusService.getFocusedItem(environment));
  }

  /**
   * Restores focus to the stored view (if any) and clears the stored reference.
   */
  public void restore() {
    View view = storedView.get();
    if (view == null) {
      return;
    }

    KeyboardFocusService.focus(view);
    storedView.clear();
  }

  /**
   * Returns the currently stored view without consuming it, or null.
   */
  @Nullable
  public View get() {
    return storedView.get();
  }

  /**
   * Drops the stored reference without restoring focus.
   */
  public void clean() {
    storedView.clear();
  }
}
