package com.externalkeyboard.views.TextInputFocusWrapper;

import android.content.Context;
import android.graphics.Rect;
import android.text.Editable;
import android.view.KeyEvent;
import android.view.View;
import android.view.ViewGroup;
import android.widget.EditText;

import androidx.annotation.NonNull;

import com.externalkeyboard.events.EventHelper;
import com.externalkeyboard.helper.ReactNativeVersionChecker;
import com.externalkeyboard.modules.ExternalKeyboardModule;
import com.facebook.react.bridge.ReactContext;
import com.facebook.react.views.textinput.ReactEditText;

import java.lang.reflect.Field;

public class TextInputFocusWrapper extends ViewGroup implements View.OnFocusChangeListener {
  private final Context context;
  public static final byte FOCUS_BY_PRESS = 1;
  private ReactEditText reactEditText = null;
  private boolean focusEventIgnore = false;
  private int focusType = 0;
  private View.OnAttachStateChangeListener onAttachListener;
  private boolean blurOnSubmit = true;
  private boolean multiline = false;
  private boolean keyboardFocusable = true;
  private static View focusedView = null;
  public boolean getIsFocusByPress() {
    return focusType == FOCUS_BY_PRESS;
  }

  private boolean getIs80Version () {
    return ReactNativeVersionChecker.isReactNative80OrLater();
  }

  public void setKeyboardFocusable(boolean canBeFocusable) {
    if (keyboardFocusable == canBeFocusable) {
      return;
    }

    keyboardFocusable = canBeFocusable;

    this.setFocusable(keyboardFocusable);
    if (this.reactEditText != null) {
      boolean is80 = getIs80Version();
      this.reactEditText.setFocusable(is80);
    }
  }

  private View.OnAttachStateChangeListener getOnAttachListener() {
    if (onAttachListener == null) {
      onAttachListener = new View.OnAttachStateChangeListener() {
        @Override
        public void onViewAttachedToWindow(@NonNull View view) {
          boolean is80 = getIs80Version();
          view.setFocusable(is80);
        }

        @Override
        public void onViewDetachedFromWindow(@NonNull View view) {
        }
      };
    }
    return onAttachListener;
  }

  private void clearEditText() {
    if (this.reactEditText != null) {
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
      boolean is80 = getIs80Version();
      if(is80) {
        this.setFocusable(false);
      }

      this.reactEditText.addOnAttachStateChangeListener(getOnAttachListener());
      if (focusType == FOCUS_BY_PRESS) {
        this.reactEditText.setFocusable(is80);
      }
      OnFocusChangeListener reactListener = this.reactEditText.getOnFocusChangeListener();
      this.reactEditText.setOnFocusChangeListener((textInput, hasTextEditFocus) -> {
        reactListener.onFocusChange(textInput, hasTextEditFocus);
        focusedView = textInput;
        this.focusEventIgnore = false;
        if (focusType != FOCUS_BY_PRESS || !hasTextEditFocus) {
          onFocusChange(textInput, hasTextEditFocus);
        }

        if (hasTextEditFocus) {
          ExternalKeyboardModule.setFocusedTextInput(textInput);
        }
        if (!hasTextEditFocus) {
          this.setFocusable(!is80);
          this.reactEditText.setFocusable(is80);
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
  }

  public void setBlurType(int blurType) {
    // Stub, Android does not allow to type in EditField from another view. Even focus remains typing with soft or hard keyboard won't work
  }

  public TextInputFocusWrapper(Context context) {
    super(context);
    this.context = context;

    if (keyboardFocusable) {
      boolean is80 = getIs80Version();
      setFocusable(!is80);
    }
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
    if (focusType == FOCUS_BY_PRESS) {
      this.reactEditText.setFocusable(false);
    }
    if (keyCode == KeyEvent.KEYCODE_SPACE || keyCode == KeyEvent.KEYCODE_DPAD_CENTER || keyCode == KeyEvent.KEYCODE_ENTER) {
      this.handleTextInputFocus();
      return true;
    }
    return super.onKeyDown(keyCode, event);
  }

  public boolean requestFocus(int direction, Rect previouslyFocusedRect) {
    boolean is80 = getIs80Version();
    if(is80) {
      return super.requestFocus(direction, previouslyFocusedRect);
    }
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

  @Override
  protected void onLayout(boolean changed, int left, int top, int right, int bottom) {
    // No-op since UIManagerModule handles actually laying out children.
  }
}
