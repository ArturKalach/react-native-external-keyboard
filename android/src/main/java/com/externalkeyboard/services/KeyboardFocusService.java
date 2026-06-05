package com.externalkeyboard.services;

import android.os.Handler;
import android.os.Looper;
import android.view.View;

import androidx.annotation.Nullable;

/**
 * Public entry point for driving the Android focus engine from custom native code.
 * All methods are static — this service holds no state.
 */
public class KeyboardFocusService {

  private KeyboardFocusService() {
  }

  /**
   * Returns the view currently focused within the given environment's window, or null.
   */
  @Nullable
  public static View getFocusedItem(@Nullable View environment) {
    if (environment == null) {
      return null;
    }

    View root = environment.getRootView();
    return root != null ? root.findFocus() : environment.findFocus();
  }

  /**
   * Requests focus on the given view on the main thread.
   */
  public static void focus(@Nullable final View view) {
    if (view == null) {
      return;
    }

    new Handler(Looper.getMainLooper()).post(view::requestFocus);
  }
}
