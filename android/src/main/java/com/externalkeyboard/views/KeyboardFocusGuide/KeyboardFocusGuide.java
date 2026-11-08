package com.externalkeyboard.views.KeyboardFocusGuide;

import android.content.Context;
import android.graphics.Rect;
import android.os.Build;
import android.view.View;
import android.view.accessibility.AccessibilityEvent;

import androidx.annotation.NonNull;
import androidx.annotation.Nullable;
import androidx.core.view.ViewCompat;

import com.facebook.react.views.view.ReactViewGroup;

/** `KeyboardFocusGuide` (`K.Guide`): an area that sends keyboard or TalkBack focus on to the target view (like iOS `UIFocusGuide`). */
public class KeyboardFocusGuide extends ReactViewGroup implements GuideHost {
  public static final int DEFAULT_GUIDE_MASK = GuideMask.DEFAULT;

  private boolean guideEnabled = true;
  private GuideMask mask = new GuideMask(DEFAULT_GUIDE_MASK);
  private boolean redirecting = false;

  private final GuideTargetLink link = new GuideTargetLink(this, target -> updateFocusable());
  private final GuideKeyboardRedirect keyboard = new GuideKeyboardRedirect(this);
  private final GuideScreenReaderRedirect screenReader = new GuideScreenReaderRedirect(this);

  public KeyboardFocusGuide(Context context) {
    super(context);
    setFocusableInTouchMode(false);
    setImportantForAccessibility(IMPORTANT_FOR_ACCESSIBILITY_NO);
    if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.O) {
      setDefaultFocusHighlightEnabled(false);
    }
    updateFocusable();
  }

  // GuideHost

  @NonNull
  @Override
  public GuideMask getMask() {
    return mask;
  }

  @Override
  public boolean isGuideEnabled() {
    return guideEnabled;
  }

  @Nullable
  @Override
  public View getTarget() {
    return link.getTarget();
  }

  // Props

  public void setPreferredFocusOrderId(@Nullable String id) {
    link.setPreferredId(id);
  }

  /**
   * Which inputs are redirected. Keyboard: the guide is a focus stop that hands focus to the target (arrow keys
   * and/or Tab). Screen reader: the guide is exposed to TalkBack, which moves on to the target.
   */
  public void setGuideMask(int value) {
    if (value == mask.getValue()) return;
    mask = new GuideMask(value);
    // The view's own state follows the mask alone: exposed to TalkBack for a screen-reader mask (no effect while
    // TalkBack is off), a keyboard stop for a keyboard mask. Whether a move is redirected is decided at use time.
    boolean screenReaderMask = mask.hasScreenReader();
    setImportantForAccessibility(
      screenReaderMask ? IMPORTANT_FOR_ACCESSIBILITY_YES : IMPORTANT_FOR_ACCESSIBILITY_NO);
    ViewCompat.setScreenReaderFocusable(this, screenReaderMask);
    updateFocusable();
  }

  public void setGuideEnabled(boolean enabled) {
    guideEnabled = enabled;
    updateFocusable();
  }

  // Lifecycle

  @Override
  protected void onAttachedToWindow() {
    super.onAttachedToWindow();
    link.attach();
  }

  @Override
  protected void onDetachedFromWindow() {
    link.detach();
    super.onDetachedFromWindow();
  }

  // Keyboard

  /** Redirects synchronously, so there is no "guide focused" state for a key repeat to start from. */
  @Override
  public boolean requestFocus(int direction, @Nullable Rect previouslyFocusedRect) {
    // Re-entrancy guard: chained guides call each other through focusSearch.
    if (redirecting) {
      return false;
    }
    redirecting = true;
    try {
      if (!isFocusable()) {
        // Not a focus stop: only programmatic requests reach here, so behave like a plain view.
        return super.requestFocus(direction, previouslyFocusedRect);
      }

      View target = keyboard.targetFor(direction);
      if (target != null) {
        return target.requestFocus();
      }

      View next = focusSearch(direction);
      if (next == null || next == this) {
        return false;
      }
      return next.requestFocus(direction);
    } finally {
      redirecting = false;
    }
  }

  // Screen reader

  @Override
  public void sendAccessibilityEvent(int eventType) {
    super.sendAccessibilityEvent(eventType);
    screenReader.onAccessibilityEvent(eventType);
  }

  /** TalkBack may focus a child of the guide (its text) instead of the guide itself. */
  @Override
  public boolean onRequestSendAccessibilityEvent(View child, AccessibilityEvent event) {
    screenReader.onAccessibilityEvent(event.getEventType());
    return super.onRequestSendAccessibilityEvent(child, event);
  }

  private void updateFocusable() {
    boolean focusable = guideEnabled && mask.hasKeyboard() && link.hasTarget();
    if (isFocusable() != focusable) {
      setFocusable(focusable);
    }
  }
}
