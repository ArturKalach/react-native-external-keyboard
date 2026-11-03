package com.externalkeyboard.views.KeyboardFocusGuide;

/**
 * Which inputs a guide redirects, and the one place that decides which input wins. Bit flags are sent from JS as one
 * integer (`guideMask`). Keep in sync with guideMask.ts.
 */
final class GuideMask {
  static final int ARROWS = 1;
  static final int TAB = 2;
  static final int SCREEN_READER = 4;
  static final int DEFAULT = ARROWS | TAB;

  private final int value;

  GuideMask(int value) {
    this.value = value;
  }

  int getValue() {
    return value;
  }

  boolean has(int flags) {
    return (value & flags) != 0;
  }

  boolean hasKeyboard() {
    return has(ARROWS | TAB);
  }

  boolean hasScreenReader() {
    return has(SCREEN_READER);
  }

  /** A guide for keyboard and screen reader uses the screen reader while one is running, the keyboard otherwise. */
  boolean redirectsScreenReader(boolean screenReaderRunning) {
    return hasScreenReader() && (!hasKeyboard() || screenReaderRunning);
  }

  boolean redirectsKeyboard(int flag, boolean screenReaderRunning) {
    return has(flag) && !(hasScreenReader() && screenReaderRunning);
  }
}
