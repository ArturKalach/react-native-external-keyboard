package com.externalkeyboard.views.ExternalKeyboardView;

import android.content.Context;
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


  private boolean onKeyPressHandler(ReactViewGroup reactViewGroup, int keyCode, KeyEvent keyEvent, ThemedReactContext reactContext) {
    if (!(reactViewGroup instanceof ExternalKeyboardView)) return false;
    ExternalKeyboardView viewGroup = (ExternalKeyboardView) reactViewGroup;

    if (!viewGroup.hasKeyUpListener && !viewGroup.hasKeyDownListener) {
      return false;
    }

    if (keyCode == KeyEvent.KEYCODE_TAB) {
      return false;
    }

    KeyboardKeyPressHandler.PressInfo pressInfo = keyboardKeyPressHandler.getEventsFromKeyPress(keyCode, keyEvent);

    if(pressInfo.firePressDownEvent) {
      EventHelper.bubbledPressDown((ReactContext) context, viewGroup.getId(), keyCode, keyEvent);
    }

    if(pressInfo.firePressUpEvent) {
      EventHelper.bubbledPressUp((ReactContext) context, viewGroup.getId(), keyCode, keyEvent, pressInfo.isLongPress);
    }

    if (pressInfo.firePressDownEvent && viewGroup.hasKeyDownListener) {
      EventHelper.pressDown((ReactContext) context, viewGroup.getId(), keyCode, keyEvent);
      return true;
    }

    if (pressInfo.firePressUpEvent && viewGroup.hasKeyUpListener) {
      EventHelper.pressUp((ReactContext) context, viewGroup.getId(), keyCode, keyEvent, pressInfo.isLongPress);
      return true;
    }

    return false;
  }


  @Override
  protected void onAttachedToWindow() {
    super.onAttachedToWindow();

    this.listeningView = getFocusingView();
    setFocusable(this.listeningView == this);

    this.listeningView.setOnFocusChangeListener((focusedView, hasFocus) -> {
      EventHelper.focusChanged((ReactContext) context, this.getId(), hasFocus);
    });

    this.listeningView.setOnKeyListener((View v, int keyCode, KeyEvent keyEvent) -> onKeyPressHandler(this, keyCode, keyEvent, (ThemedReactContext) context));

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
