package com.externalkeyboard.views.ExternalKeyboardView;

import android.content.Context;
import android.util.Log;
import android.view.KeyEvent;
import android.view.View;
import android.view.ViewGroup;
import android.view.ViewTreeObserver;

import com.externalkeyboard.events.EventHelper;

import com.externalkeyboard.helper.FocusHelper;
import com.externalkeyboard.services.KeyboardKeyPressHandler;
import com.facebook.react.bridge.ReactContext;
import com.facebook.react.uimanager.ThemedReactContext;
import com.facebook.react.views.view.ReactViewGroup;

public class ExternalKeyboardView extends ReactViewGroup {
  public boolean hasKeyDownListener = false;
  public boolean hasKeyUpListener = false;
  public boolean autoFocus = false;
  public boolean hasBeenFocused = false;

  private final KeyboardKeyPressHandler keyboardKeyPressHandler;
  private final Context context;
  private View listeningView;

  public ExternalKeyboardView(Context context) {
    super(context);
    this.context = context;
    this.keyboardKeyPressHandler = new KeyboardKeyPressHandler();
  }

  @Override
  public boolean dispatchKeyEvent(KeyEvent keyEvent) {
    if (!this.hasKeyUpListener && !this.hasKeyDownListener) {
      return super.dispatchKeyEvent(keyEvent);
    }

    int keyCode = keyEvent.getKeyCode();
    if (keyCode == KeyEvent.KEYCODE_TAB) {
      return super.dispatchKeyEvent(keyEvent); //?
    }

    KeyboardKeyPressHandler.PressInfo pressInfo = keyboardKeyPressHandler.getEventsFromKeyPress(keyCode, keyEvent);

    if (pressInfo.firePressDownEvent && this.hasKeyDownListener) {
      EventHelper.pressDown((ReactContext) context, this.getId(), keyCode, keyEvent);
      return super.dispatchKeyEvent(keyEvent);
    }

    if (pressInfo.firePressUpEvent && this.hasKeyUpListener) {
      EventHelper.pressUp((ReactContext) context, this.getId(), keyCode, keyEvent, pressInfo.isLongPress);
      return super.dispatchKeyEvent(keyEvent);
    }

    return super.dispatchKeyEvent(keyEvent);
  }

  @Override
  protected void onAttachedToWindow() {
    super.onAttachedToWindow();

    this.listeningView = getFocusingView();
    setFocusable(this.listeningView == this);

    this.listeningView.setOnFocusChangeListener((focusedView, hasFocus) -> {
      EventHelper.focusChanged((ReactContext) context, this.getId(), hasFocus);
    });

    if (autoFocus && !hasBeenFocused) {
      this.autoFocusOnDraw();
      hasBeenFocused = true;
    }
  }

  private void autoFocusOnDraw() {
    getViewTreeObserver().addOnPreDrawListener(new ViewTreeObserver.OnPreDrawListener() {
      @Override
      public boolean onPreDraw() {
        getViewTreeObserver().removeOnPreDrawListener(this);
        focus();

        return true;
      }
    });
  }

  @Override
  protected void onDetachedFromWindow() {
    super.onDetachedFromWindow();
    if (this.listeningView != null) {
      this.listeningView.setOnFocusChangeListener(null);
    }
  }

  private View getFocusingView() {
    View focusableView = FocusHelper.getFocusableView(this);
    return focusableView != null ? focusableView : this;
  }

  public void setCanBeFocused(boolean canBeFocused) {
    int descendantFocusability = canBeFocused ? ViewGroup.FOCUS_BEFORE_DESCENDANTS : ViewGroup.FOCUS_BLOCK_DESCENDANTS;
    this.setDescendantFocusability(descendantFocusability);
  }


  public void focus() {
    View focusingView = this.getFocusingView();
    focusingView.requestFocus();
  }

}
