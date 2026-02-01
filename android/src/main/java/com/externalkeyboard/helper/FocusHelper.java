package com.externalkeyboard.helper;

import android.view.KeyEvent;
import android.view.View;
import android.view.ViewGroup;

import java.util.HashMap;
import java.util.Map;

import androidx.annotation.Nullable;
import androidx.core.view.ViewCompat;

public class FocusHelper {
  private static final int MASK_FOCUS_UP = 0b1;
  private static final int MASK_FOCUS_DOWN = 0b10;
  private static final int MASK_FOCUS_LEFT = 0b100;
  private static final int MASK_FOCUS_RIGHT = 0b1000;
  private static final int MASK_FOCUS_FORWARD = 0b10000;
  private static final int MASK_FOCUS_BACKWARD = 0b100000;

  private static final Map<Integer, Integer> DIRECTION_MASK_MAP = new HashMap<>();
  private static final Map<Integer, Integer> DIRECTION_KEY_MASK_MAP = new HashMap<>();

  static {
    DIRECTION_MASK_MAP.put(View.FOCUS_UP, MASK_FOCUS_UP);
    DIRECTION_MASK_MAP.put(View.FOCUS_DOWN, MASK_FOCUS_DOWN);
    DIRECTION_MASK_MAP.put(View.FOCUS_LEFT, MASK_FOCUS_LEFT);
    DIRECTION_MASK_MAP.put(View.FOCUS_RIGHT, MASK_FOCUS_RIGHT);
    DIRECTION_MASK_MAP.put(View.FOCUS_FORWARD, MASK_FOCUS_FORWARD);
    DIRECTION_MASK_MAP.put(View.FOCUS_BACKWARD, MASK_FOCUS_BACKWARD);

    DIRECTION_KEY_MASK_MAP.put(KeyEvent.KEYCODE_DPAD_LEFT, MASK_FOCUS_LEFT);
    DIRECTION_KEY_MASK_MAP.put(KeyEvent.KEYCODE_DPAD_RIGHT, MASK_FOCUS_RIGHT);
    DIRECTION_KEY_MASK_MAP.put(KeyEvent.KEYCODE_DPAD_UP, MASK_FOCUS_UP);
    DIRECTION_KEY_MASK_MAP.put(KeyEvent.KEYCODE_DPAD_DOWN, MASK_FOCUS_DOWN);
  }

  public static boolean isLocked(int direction, int lockFocus) {
    Integer mask = DIRECTION_MASK_MAP.get(direction);
    if (mask != null) {
      return (lockFocus & mask) != 0;
    }
    return false;
  }

  public static boolean isKeyLocked(int direction, int lockFocus) {
    Integer mask = DIRECTION_KEY_MASK_MAP.get(direction);
    if (mask != null) {
      return (lockFocus & mask) != 0;
    }
    return false;
  }

  public static View getFocusableView(ViewGroup viewGroup) {
    if (viewGroup.getChildCount() > 0) {
      View subView = viewGroup.getChildAt(0);
      if (subView.isFocusable()) {
        return subView;
      } else if (subView instanceof ViewGroup) {
        return getFocusableView((ViewGroup) subView);
      }
    }

    return null;
  }
  public static boolean isAccessible(@Nullable View view) {
    return view != null && ViewCompat.isImportantForAccessibility(view);
  }

  public static View findFirstAccessible(@Nullable ViewGroup viewGroup, boolean ignoreRoot) {
    if (viewGroup == null) {
      return null;
    }

    if (!ignoreRoot && isAccessible(viewGroup)) {
      return viewGroup;
    }

    for (int i = 0; i < viewGroup.getChildCount(); i++) {
      View child = viewGroup.getChildAt(i);
      if (isAccessible(child)) {
        return child;
      }

      if (child instanceof ViewGroup) {
        View accessibleChild = findFirstAccessible((ViewGroup) child, true);
        if (accessibleChild != null) {
          return accessibleChild;
        }
      }
    }

    return null;
  }

  public static View findFirstAccessible(@Nullable ViewGroup viewGroup) {
    return findFirstAccessible(viewGroup, false);
  }

  public static View findFirstFocusable(@Nullable ViewGroup viewGroup, boolean ignoreRoot) {
    if (viewGroup == null) {
      return null;
    }

    if (!ignoreRoot && isKeyboardFocusable(viewGroup)) {
      return viewGroup;
    }

    for (int i = 0; i < viewGroup.getChildCount(); i++) {
      View child = viewGroup.getChildAt(i);
      if (isKeyboardFocusable(child)) {
        return child;
      }

      if (child instanceof ViewGroup) {
        View focusableChild = findFirstFocusable((ViewGroup) child, true);
        if (focusableChild != null) {
          return focusableChild;
        }
      }
    }

    return null;
  }

  public static View findFirstFocusable(@Nullable ViewGroup viewGroup) {
    return findFirstFocusable(viewGroup, false);
  }

  private static boolean isKeyboardFocusable(View view) {
    return view.isFocusable() && view.getVisibility() == View.VISIBLE && view.isEnabled();
  }
}
