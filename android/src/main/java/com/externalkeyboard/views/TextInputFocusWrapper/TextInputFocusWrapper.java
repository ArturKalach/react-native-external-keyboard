package com.externalkeyboard.views.TextInputFocusWrapper;

import android.content.Context;
import android.graphics.Rect;
import android.util.AttributeSet;
import android.view.KeyEvent;
import android.view.View;
import android.view.ViewGroup;

import androidx.annotation.NonNull;
import androidx.annotation.Nullable;

import com.externalkeyboard.events.EventHelper;
import com.facebook.react.bridge.ReactContext;
import com.facebook.react.views.textinput.ReactEditText;

public class TextInputFocusWrapper extends ViewGroup implements View.OnFocusChangeListener {
  private final Context context;
  public static final byte FOCUS_BY_PRESS = 1;
  private ReactEditText reactEditText = null;
  private boolean focusEventIgnore = false;
  private int focusType = 0;

  public void setEditText(ReactEditText editText) {
    if(editText != null) {
      this.reactEditText = editText;
      this.reactEditText.addOnAttachStateChangeListener(new View.OnAttachStateChangeListener() {
        @Override
        public void onViewAttachedToWindow(@NonNull View view) {
          reactEditText.setFocusable(false);
        }

        @Override
        public void onViewDetachedFromWindow(@NonNull View view) {

        }
      });
      if(focusType == FOCUS_BY_PRESS) {
        this.reactEditText.setFocusable(false);
      }
    } else {
      this.reactEditText.setOnFocusChangeListener(null);
      this.reactEditText.addOnAttachStateChangeListener(null);
    }
  }

  @Override
  public void onFocusChange(View v, boolean hasFocus) {
    if(!this.focusEventIgnore){
      EventHelper.focusChanged((ReactContext)  context, this.getId(), hasFocus);
    }
  }

  public void subscribeOnFocus () {
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
  }

  public TextInputFocusWrapper(Context context, @Nullable AttributeSet attrs) {
    super(context, attrs);
    this.context = context;
  }

  public TextInputFocusWrapper(Context context, @Nullable AttributeSet attrs, int defStyleAttr) {
    super(context, attrs, defStyleAttr);
    this.context = context;
  }


  @Override
  public boolean onKeyDown(int keyCode, KeyEvent event) {
    if(focusType == FOCUS_BY_PRESS) {
      this.reactEditText.setFocusable(false);
    }
    if(keyCode == KeyEvent.KEYCODE_SPACE) {
      this.handleTextInputFocus();
    }
    return super.onKeyDown(keyCode, event);
  }

  @Override
  public boolean requestFocus(int direction, Rect previouslyFocusedRect) {
    if ((direction == View.FOCUS_FORWARD || direction == View.FOCUS_BACKWARD) && focusType != FOCUS_BY_PRESS) {
        this.handleTextInputFocus();
        return true;
    }

    return super.requestFocus(direction, previouslyFocusedRect);
  }

  private void handleTextInputFocus () {
    this.focusEventIgnore = true;
    this.reactEditText.setOnFocusChangeListener((textInput, hasTextEditFocus) -> {
      this.focusEventIgnore = false;
      if(focusType != FOCUS_BY_PRESS || !hasTextEditFocus) {
        onFocusChange(textInput, hasTextEditFocus);
      }

      if(!hasTextEditFocus) {
        this.setFocusable(true);
        this.reactEditText.setFocusable(false);
      }
    });
    this.reactEditText.setFocusable(true);
    this.reactEditText.requestFocusFromJS();
    this.setFocusable(false);
  }

  @Override
  protected void onLayout(boolean changed, int left, int top, int right, int bottom) {
    // No-op since UIManagerModule handles actually laying out children.
  }
}
