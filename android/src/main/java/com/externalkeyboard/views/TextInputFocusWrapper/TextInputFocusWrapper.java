package com.externalkeyboard.views.TextInputFocusWrapper;

import android.content.Context;
import android.graphics.Rect;
import android.text.Editable;
import android.view.KeyEvent;
import android.view.View;
import android.widget.EditText;

import androidx.annotation.NonNull;

import com.externalkeyboard.events.EventHelper;
import com.externalkeyboard.modules.ExternalKeyboardModule;
import com.externalkeyboard.views.base.ViewOrderGroupBase;
import com.facebook.react.bridge.ReactContext;
import com.facebook.react.views.textinput.ReactEditText;

public class TextInputFocusWrapper extends ViewOrderGroupBase implements View.OnFocusChangeListener {
  private final Context context;
  public static final byte FOCUS_BY_PRESS = 1;
  private ReactEditText reactEditText = null;
  private boolean focusEventIgnore = false;
  private int focusType = 0;
  private View.OnAttachStateChangeListener onAttachListener;
  private boolean blurOnSubmit = true;
  private boolean multiline = false;
  private boolean keyboardFocusable = true;

  private boolean getIsNativelyFixedVersion() {
    try {
      Object minorValue = com.facebook.react.modules.systeminfo.ReactNativeVersion.VERSION.getOrDefault("minor", 0);
      int minor = (minorValue instanceof Integer) ? (int) minorValue : 0;
      return minor >= 79;
    } catch (Exception e) {
      return false;
    }
  }

  // For FOCUS_BY_PRESS: wrapper must always intercept focus (regardless of RN version)
  //   so the user navigates to the wrapper first, then presses to enter edit mode.
  // For regular focus: pre-0.79 had a backward-direction bug, so the wrapper handled
  //   focus transfer. In 0.79+ that is natively fixed and the EditText gets focus directly.
  private boolean shouldWrapperBeFocusable() {
    if (!keyboardFocusable) return false;
    if (focusType == FOCUS_BY_PRESS) return true;
    return !getIsNativelyFixedVersion();
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
  public View getFirstChild() {
    // In 0.79+ with regular focus, the EditText receives focus directly.
    // For FOCUS_BY_PRESS the wrapper itself is the focus target, so return this.
    if (this.getIsNativelyFixedVersion() && focusType != FOCUS_BY_PRESS && this.reactEditText != null) {
      return this.reactEditText;
    }
    return this;
  }

  public void setKeyboardFocusable(boolean canBeFocusable) {
    if (keyboardFocusable == canBeFocusable) {
      return;
    }
    keyboardFocusable = canBeFocusable;
    updateFocusability();
  }

  private View.OnAttachStateChangeListener getOnAttachListener() {
    if (onAttachListener == null) {
      onAttachListener = new View.OnAttachStateChangeListener() {
        @Override
        public void onViewAttachedToWindow(@NonNull View view) {
          focusOrderDelegate.link();
          view.setFocusable(shouldEditTextBeFocusable());
        }

        @Override
        public void onViewDetachedFromWindow(@NonNull View view) {
          focusOrderDelegate.unlink(view);
        }
      };
    }
    return onAttachListener;
  }

  private void clearEditText() {
    if (this.reactEditText != null) {
      focusOrderDelegate.unlink(this.reactEditText);

      this.reactEditText.setOnFocusChangeListener(null);
      this.reactEditText.setOnKeyListener(null);

      if (onAttachListener != null) {
        this.reactEditText.removeOnAttachStateChangeListener(onAttachListener);
      }
    }
    this.reactEditText = null;
  }

  public void setEditText(ReactEditText editText) {
    if (editText != null) {
      this.reactEditText = editText;
      updateFocusability();

      this.reactEditText.addOnAttachStateChangeListener(getOnAttachListener());
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
          // Restore idle focusability state: wrapper ready to receive focus again
          updateFocusability();
        }
      });
      onMultiplyBlurSubmitHandle();
    } else {
      this.clearEditText();
    }
  }

  @Override
  public void onFocusChange(View v, boolean hasFocus) {
    if (!this.focusEventIgnore) {
      EventHelper.focusChanged((ReactContext) context, this.getId(), hasFocus);
    }
  }

  public void subscribeOnFocus() {
    this.setOnFocusChangeListener(this);
  }

  public void setFocusType(int focusType) {
    this.focusType = focusType;
    updateFocusability();
  }

  public void setBlurType(int blurType) {
    // Stub, Android does not allow to type in EditField from another view. Even focus remains typing with soft or hard keyboard won't work
  }

  public TextInputFocusWrapper(Context context) {
    super(context);
    this.context = context;
    setFocusable(shouldWrapperBeFocusable());
  }

  public void setBlurOnSubmit(boolean blurOnSubmit) {
    this.blurOnSubmit = blurOnSubmit;
  }

  public void setMultiline(boolean multiline) {
    this.multiline = multiline;
    onMultiplyBlurSubmitHandle();
  }

  @Override
  public boolean onKeyDown(int keyCode, KeyEvent event) {
    if (isFocusLocked(event)) {
      return true;
    }
    if (focusType == FOCUS_BY_PRESS && this.reactEditText != null) {
      this.reactEditText.setFocusable(false);
    }
    if (keyCode == KeyEvent.KEYCODE_SPACE || keyCode == KeyEvent.KEYCODE_DPAD_CENTER || keyCode == KeyEvent.KEYCODE_ENTER) {
      this.handleTextInputFocus();
      return true;
    }
    return super.onKeyDown(keyCode, event);
  }

  public boolean requestFocus(int direction, Rect previouslyFocusedRect) {
    // In 0.79+ with regular focus, the wrapper is not focusable and this method is
    // unlikely to be called from normal navigation, but handle it defensively.
    if (getIsNativelyFixedVersion() && focusType != FOCUS_BY_PRESS) {
      return super.requestFocus(direction, previouslyFocusedRect);
    }
    // Pre-0.79: wrapper intercepts forward/backward focus and transfers it to EditText.
    if ((direction == View.FOCUS_FORWARD || direction == View.FOCUS_BACKWARD) && focusType != FOCUS_BY_PRESS) {
      this.handleTextInputFocus();
      return true;
    }
    return super.requestFocus(direction, previouslyFocusedRect);
  }

  private void onMultiplyBlurSubmitHandle() {
    if (this.reactEditText == null) return;
    if (this.multiline) {
      this.reactEditText.setOnKeyListener(new View.OnKeyListener() {
        @Override
        public boolean onKey(View v, int keyCode, KeyEvent event) {
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
        }
      });
    } else {
      this.reactEditText.setOnKeyListener(null);
    }
  }

  private void handleTextInputFocus() {
    this.focusEventIgnore = true;
    this.setFocusable(false);
    this.reactEditText.setFocusable(true);

    if (!this.reactEditText.hasFocus()) {
      this.reactEditText.requestFocusFromJS();
    }
  }
}
