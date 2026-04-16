package com.externalkeyboard.views.TextInputFocusWrapper;

import android.content.Context;
import android.graphics.Rect;
import android.os.Build;
import android.text.Editable;
import android.view.KeyEvent;
import android.view.MotionEvent;
import android.view.View;
import android.widget.EditText;

import androidx.annotation.NonNull;

import com.externalkeyboard.events.EventHelper;
import com.externalkeyboard.modules.ExternalKeyboardModule;
import com.externalkeyboard.views.base.FocusHighlightBase;
import com.facebook.react.bridge.ReactContext;
import com.facebook.react.views.textinput.ReactEditText;

public class TextInputFocusWrapper extends FocusHighlightBase implements View.OnFocusChangeListener {
  private final Context context;
  public static final byte FOCUS_BY_PRESS = 1;

  // RN version is a compile-time constant — cache it once instead of re-reading on every call.
  private static final boolean IS_NATIVELY_FIXED_VERSION = resolveIsNativelyFixedVersion();

  private ReactEditText reactEditText = null;
  private boolean focusEventIgnore = false;
  private int focusType = 0;
  // Used only to re-apply focusability after React Native attaches the EditText to the window.
  private View.OnAttachStateChangeListener focusabilityListener;
  private boolean blurOnSubmit = true;
  private boolean multiline = false;
  private boolean keyboardFocusable = true;

  private static boolean resolveIsNativelyFixedVersion() {
    try {
      Object minorValue = com.facebook.react.modules.systeminfo.ReactNativeVersion.VERSION.containsKey("minor")
          ? com.facebook.react.modules.systeminfo.ReactNativeVersion.VERSION.get("minor")
          : 0;
      int minor = (minorValue instanceof Integer) ? (int) minorValue : 0;
      return minor >= 79;
    } catch (Exception e) {
      return false;
    }
  }

  // For FOCUS_BY_PRESS: wrapper must always intercept focus so the user navigates
  //   to the wrapper first, then presses Enter/Space to enter edit mode.
  // For regular focus: pre-0.79 had a backward-direction bug, so the wrapper handled
  //   focus transfer. In 0.79+ that is natively fixed and the EditText gets focus directly.
  private boolean shouldWrapperBeFocusable() {
    if (!keyboardFocusable) return false;
    if (focusType == FOCUS_BY_PRESS) return true;
    return !IS_NATIVELY_FIXED_VERSION;
  }

  private boolean shouldEditTextBeFocusable() {
    return keyboardFocusable && !shouldWrapperBeFocusable();
  }

  private void updateFocusability() {
    this.setFocusable(shouldWrapperBeFocusable());
    if (this.reactEditText != null) {
      this.reactEditText.setFocusable(shouldEditTextBeFocusable());
    }
  }

  @Override
  protected void syncFocusHighlight () {
    if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.O) {

      this.setDefaultFocusHighlightEnabled(focusHighlight);
      if(this.reactEditText != null) {
        reactEditText.setDefaultFocusHighlightEnabled(focusHighlight);
      }
    }
  }


  @Override
  public View getFirstChild() {
    // In 0.79+ with regular focus, the EditText receives focus directly.
    // For FOCUS_BY_PRESS the wrapper itself is the focus target.
    if (IS_NATIVELY_FIXED_VERSION && focusType != FOCUS_BY_PRESS && this.reactEditText != null) {
      return this.reactEditText;
    }
    return this;
  }

  // --- Child lifecycle (mirrors ExternalKeyboardView pattern) ---

  // Overrides ViewOrderGroupBase.linkAddView so the manager can call it uniformly
  // for all children — the ReactEditText filter lives here, not in the manager.
  @Override
  public void linkAddView(View child) {
    if (!(child instanceof ReactEditText)) return;
    setEditText((ReactEditText) child);  // configure listeners before linking
    this.syncFocusHighlight();
    super.linkAddView(child);            // store firstChild + call focusOrderDelegate.link()
  }

  // Symmetric to linkAddView: manager calls linkRemoveView for all children.
  @Override
  public void linkRemoveView(View view) {
    if (view != this.reactEditText) return;
    super.linkRemoveView(view);  // call focusOrderDelegate.unlink() + clear firstChild
    setEditText(null);
  }

  // --- EditText setup / teardown ---

  public void setEditText(ReactEditText editText) {
    if (editText != null) {
      this.reactEditText = editText;
      updateFocusability();
      this.reactEditText.addOnAttachStateChangeListener(getFocusabilityListener());
      subscribeEditTextFocusListener();
      onMultiplyBlurSubmitHandle();
    } else {
      clearEditText();
    }
  }

  private View.OnAttachStateChangeListener getFocusabilityListener() {
    if (focusabilityListener == null) {
      focusabilityListener = new View.OnAttachStateChangeListener() {
        @Override
        public void onViewAttachedToWindow(@NonNull View view) {
          // Re-apply focusability after React Native attaches the view; the
          // framework may reset it during the layout/commit phase.
          view.setFocusable(shouldEditTextBeFocusable());
        }
        @Override
        public void onViewDetachedFromWindow(@NonNull View view) {}
      };
    }
    return focusabilityListener;
  }

  private void clearEditText() {
    if (this.reactEditText != null) {
      focusOrderDelegate.unlink();
      if (focusabilityListener != null) {
        this.reactEditText.removeOnAttachStateChangeListener(focusabilityListener);
      }
      this.reactEditText.setOnFocusChangeListener(null);
      this.reactEditText.setOnKeyListener(null);
    }
    this.reactEditText = null;
  }

  private void subscribeEditTextFocusListener() {
    OnFocusChangeListener reactListener = this.reactEditText.getOnFocusChangeListener();
    this.reactEditText.setOnFocusChangeListener((textInput, hasTextEditFocus) -> {
      reactListener.onFocusChange(textInput, hasTextEditFocus);
      this.focusEventIgnore = false;
      if (focusType != FOCUS_BY_PRESS || !hasTextEditFocus) {
        onFocusChange(textInput, hasTextEditFocus);
      }
      if (hasTextEditFocus) {
        ExternalKeyboardModule.setFocusedTextInput(textInput);
      }
      if (!hasTextEditFocus) {
        updateFocusability();
        if (focusType == FOCUS_BY_PRESS) {
          post(() -> TextInputFocusWrapper.this.requestFocus());
        }
      }
    });
  }

  // --- Focus change event ---

  @Override
  public void onFocusChange(View v, boolean hasFocus) {
    if (!this.focusEventIgnore) {
      EventHelper.focusChanged((ReactContext) context, this.getId(), hasFocus);
    }
  }

  public void subscribeOnFocus() {
    this.setOnFocusChangeListener(this);
  }

  // --- Props ---

  public void setKeyboardFocusable(boolean canBeFocusable) {
    if (keyboardFocusable == canBeFocusable) return;
    keyboardFocusable = canBeFocusable;
    updateFocusability();
  }

  public void setFocusType(int focusType) {
    if (this.focusType == focusType) return;
    this.focusType = focusType;
    updateFocusability();
    // On 0.79+ getFirstChild() switches between wrapper and reactEditText based on
    // focusType. If the EditText is already attached, re-link so the delegate
    // registers the correct child for the new mode.
    if (reactEditText != null && reactEditText.isAttachedToWindow()) {
      focusOrderDelegate.unlink();
      focusOrderDelegate.link();
    }
  }

  public void setBlurType(int blurType) {
    // Stub: Android does not allow typing in an EditText from another view.
  }

  public void setBlurOnSubmit(boolean blurOnSubmit) {
    this.blurOnSubmit = blurOnSubmit;
  }

  public void setMultiline(boolean multiline) {
    this.multiline = multiline;
    onMultiplyBlurSubmitHandle();
  }

  // --- Constructor ---

  public TextInputFocusWrapper(Context context) {
    super(context);
    this.context = context;
    setFocusable(shouldWrapperBeFocusable());
  }

  // --- Key handling ---

  @Override
  public boolean onKeyDown(int keyCode, KeyEvent event) {
    if (isFocusLocked(event)) return true;
    if (focusType == FOCUS_BY_PRESS && this.reactEditText != null) {
      this.reactEditText.setFocusable(false);
    }
    if (keyCode == KeyEvent.KEYCODE_SPACE || keyCode == KeyEvent.KEYCODE_DPAD_CENTER || keyCode == KeyEvent.KEYCODE_ENTER) {
      this.handleTextInputFocus();
      return true;
    }
    return super.onKeyDown(keyCode, event);
  }

  // --- Touch handling ---

  @Override
  public boolean onInterceptTouchEvent(MotionEvent ev) {
    // In FOCUS_BY_PRESS mode the EditText is non-focusable (wrapper holds focus).
    // Intercept the down event so a tap activates edit mode, same as a keyboard press.
    if (focusType == FOCUS_BY_PRESS && ev.getAction() == MotionEvent.ACTION_DOWN) {
      handleTextInputFocus();
    }
    return false; // don't consume — let the touch reach the EditText for cursor positioning
  }

  // --- Focus search / request ---

  @Override
  public View focusSearch(int direction) {
    // focusSearch(View, int) is only called when a descendant is focused.
    // When the wrapper itself is focused (FOCUS_BY_PRESS idle state), we must
    // handle orderForward/orderBackward here instead.

      if (focusType == FOCUS_BY_PRESS) {
      if (direction == FOCUS_FORWARD && orderForward != null) {
        View next = focusOrderDelegate.getLink(orderForward);
        if (next != null && next.isAttachedToWindow()) return next;
      }
      if (direction == FOCUS_BACKWARD && orderBackward != null) {
        View prev = focusOrderDelegate.getLink(orderBackward);
        if (prev != null && prev.isAttachedToWindow()) return prev;
      }
    }
    return super.focusSearch(direction);
  }

  @Override
  public boolean requestFocus(int direction, Rect previouslyFocusedRect) {
    if (focusType != FOCUS_BY_PRESS) {
      // 0.79+: wrapper is not focusable, pass through.
      if (IS_NATIVELY_FIXED_VERSION) return super.requestFocus(direction, previouslyFocusedRect);
      // Pre-0.79: intercept forward/backward and transfer focus directly to EditText.
      if (direction == View.FOCUS_FORWARD || direction == View.FOCUS_BACKWARD) {
        this.handleTextInputFocus();
        return true;
      }
    }
    return super.requestFocus(direction, previouslyFocusedRect);
  }

  // --- Internal helpers ---

  private void onMultiplyBlurSubmitHandle() {
    if (this.reactEditText == null) return;
    if (this.multiline) {
      this.reactEditText.setOnKeyListener((v, keyCode, event) -> {
        if (event.getAction() == KeyEvent.ACTION_DOWN && keyCode == KeyEvent.KEYCODE_ENTER && !event.isShiftPressed()) {
          Editable editableText = reactEditText.getText();
          String text = editableText == null ? "" : String.valueOf(editableText);
          EventHelper.multiplyTextSubmit((ReactContext) context, getId(), text);
          if (blurOnSubmit && v instanceof EditText) {
            v.clearFocus();
            return true;
          }
        }
        return false;
      });
    } else {
      this.reactEditText.setOnKeyListener(null);
    }
  }

  private void handleTextInputFocus() {
    this.focusEventIgnore = true;
    this.setFocusable(false);
    this.reactEditText.setFocusable(true);
    // focusableInTouchMode is required for requestFocus() to succeed when the device
    // is in touch mode (canTakeFocus() returns false without it).
    this.reactEditText.setFocusableInTouchMode(true);
    if (!this.reactEditText.hasFocus()) {
      this.reactEditText.requestFocusFromJS();
    }
  }
}
