package com.externalkeyboard.views.TextInputFocusWrapper;

import android.content.Context;
import android.graphics.Rect;
import android.text.Editable;
import android.view.KeyEvent;
import android.view.View;
import android.view.ViewGroup;
import android.widget.EditText;

import androidx.annotation.NonNull;

import com.externalkeyboard.delegates.FocusOrderDelegate;
import com.externalkeyboard.delegates.FocusOrderDelegateHost;
import com.externalkeyboard.events.EventHelper;
import com.externalkeyboard.helper.FocusHelper;
import com.externalkeyboard.helper.ReactNativeVersionChecker;
import com.externalkeyboard.modules.ExternalKeyboardModule;
import com.facebook.react.bridge.ReactContext;
import com.facebook.react.views.textinput.ReactEditText;

import java.lang.reflect.Field;

public class TextInputFocusWrapper extends ViewGroup implements View.OnFocusChangeListener, FocusOrderDelegateHost {
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

  public int lockFocus = 0;
  public String orderForward;
  public String orderBackward;
  public String orderId;

  private Integer orderIndex;
  private String orderGroup;
  private String orderUp;
  private String orderDown;
  private String orderLeft;
  private String orderRight;

  private FocusOrderDelegate focusOrderDelegate;
  private boolean isLinked = false;

  public boolean getIsFocusByPress() {
    return focusType == FOCUS_BY_PRESS;
  }

  // FocusOrderDelegateHost implementation
  @Override
  public View getFirstChild() {
    return this.reactEditText;
  }

  @Override
  public String getOrderGroup() {
    return orderGroup;
  }

  @Override
  public Integer getOrderIndex() {
    return orderIndex;
  }

  @Override
  public String getOrderId() {
    return orderId;
  }

  @Override
  public String getOrderLeft() {
    return orderLeft;
  }

  @Override
  public String getOrderRight() {
    return orderRight;
  }

  @Override
  public String getOrderUp() {
    return orderUp;
  }

  @Override
  public String getOrderDown() {
    return orderDown;
  }

  public void setOrderGroup(String orderGroup) {
    focusOrderDelegate.updateOrderGroup(this.orderGroup, orderGroup);
    this.orderGroup = orderGroup;
  }

  public void setOrderIndex(int orderIndex) {
    if (this.orderIndex == null) {
      this.orderIndex = orderIndex;
    } else {
      this.orderIndex = orderIndex;
      focusOrderDelegate.refreshOrder();
    }
  }

  public void setOrderLeft(String orderLeft) {
    focusOrderDelegate.refreshLeft(this.orderLeft, orderLeft);
    this.orderLeft = orderLeft;
  }

  public void setOrderRight(String orderRight) {
    focusOrderDelegate.refreshRight(this.orderRight, orderRight);
    this.orderRight = orderRight;
  }

  public void setOrderUp(String orderUp) {
    focusOrderDelegate.refreshUp(this.orderUp, orderUp);
    this.orderUp = orderUp;
  }

  public void setOrderDown(String orderDown) {
    focusOrderDelegate.refreshDown(this.orderDown, orderDown);
    this.orderDown = orderDown;
  }

  private boolean getIsNativelyFixedVersion () {
    try {
      Object minorValue = com.facebook.react.modules.systeminfo.ReactNativeVersion.VERSION.getOrDefault("minor", 0);
      int minor = (minorValue instanceof Integer) ? (int) minorValue : 0;
      return minor >= 79;
    } catch (Exception e) {
      return false;
    }
  }

  public void setKeyboardFocusable(boolean canBeFocusable) {
    if (keyboardFocusable == canBeFocusable) {
      return;
    }

    keyboardFocusable = canBeFocusable;

    this.setFocusable(keyboardFocusable);
    if (this.reactEditText != null) {
      boolean isAlreadyFixed = getIsNativelyFixedVersion();
      this.reactEditText.setFocusable(isAlreadyFixed);
    }
  }

  private View.OnAttachStateChangeListener getOnAttachListener() {
    if (onAttachListener == null) {
      onAttachListener = new View.OnAttachStateChangeListener() {
        @Override
        public void onViewAttachedToWindow(@NonNull View view) {
          focusOrderDelegate.link();
          boolean isAlreadyFixed = getIsNativelyFixedVersion();
          view.setFocusable(isAlreadyFixed);
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
      boolean isAlreadyFixed = getIsNativelyFixedVersion();
      if(isAlreadyFixed) {
        this.setFocusable(false);
      }

      this.reactEditText.addOnAttachStateChangeListener(getOnAttachListener());
      if (focusType == FOCUS_BY_PRESS) {
        this.reactEditText.setFocusable(isAlreadyFixed);
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
          this.setFocusable(!isAlreadyFixed);
          this.reactEditText.setFocusable(isAlreadyFixed);
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
    this.focusOrderDelegate = new FocusOrderDelegate(this);

    if (keyboardFocusable) {
      boolean isAlreadyFixed = getIsNativelyFixedVersion();
      setFocusable(!isAlreadyFixed);
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
  public View focusSearch(View focused, int direction) {
    if (lockFocus == 0 && orderForward == null && orderBackward == null) {
      return super.focusSearch(focused, direction);
    }

    boolean isLocked = FocusHelper.isLocked(direction, lockFocus);
    if (isLocked) {
      return this;
    }

    if (direction == FOCUS_FORWARD && orderForward != null) {
      View nextView = this.focusOrderDelegate.getLink(orderForward);
      if (isValidLinkedFocusTarget(nextView)) {
        return nextView;
      }
    }

    if (direction == FOCUS_BACKWARD && orderBackward != null) {
      View prevView = this.focusOrderDelegate.getLink(orderBackward);
      if (isValidLinkedFocusTarget(prevView)) {
        return prevView;
      }
    }

    return super.focusSearch(focused, direction);
  }

  @Override
  public boolean onKeyDown(int keyCode, KeyEvent event) {
    if (lockFocus != 0) {
      boolean isLocked = FocusHelper.isKeyLocked(keyCode, lockFocus);
      if (isLocked) {
        return true;
      }
    }
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
    boolean isAlreadyFixed = getIsNativelyFixedVersion();
    if(isAlreadyFixed) {
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

  private boolean isValidLinkedFocusTarget(View target) {
    if (target == null || !target.isAttachedToWindow() || !this.isAttachedToWindow()) {
      return false;
    }

    if (target.getWindowToken() == null || this.getWindowToken() == null) {
      return false;
    }

    if (target.getWindowToken() != this.getWindowToken()) {
      return false;
    }

    return target.getRootView() == this.getRootView();
  }

  @Override
  protected void onLayout(boolean changed, int left, int top, int right, int bottom) {
    // No-op since UIManagerModule handles actually laying out children.
  }
}
