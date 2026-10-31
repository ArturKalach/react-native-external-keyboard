package com.externalkeyboard.views.ExternalKeyboardLockView.delegates;

import android.view.View;

import androidx.annotation.NonNull;
import androidx.annotation.Nullable;

import java.util.ArrayList;

/** Attached traps, oldest first. Like all view state, only touched on the UI thread. */
public final class TrapRegistry {
  private static final ArrayList<LockHost> traps = new ArrayList<>();

  private TrapRegistry() {
  }

  public static void add(@NonNull LockHost trap) {
    traps.add(trap);
  }

  public static void remove(@NonNull LockHost trap) {
    traps.remove(trap);
  }

  /** Disabled traps and traps in other windows must not shadow this window's active trap. */
  @Nullable
  public static LockHost activeTrap(@NonNull View root) {
    for (int i = traps.size() - 1; i >= 0; i--) {
      LockHost trap = traps.get(i);
      View view = trap.getView();
      if (trap.isActiveCandidate() && view.isShown() && view.getRootView() == root) {
        return trap;
      }
    }
    return null;
  }
}
