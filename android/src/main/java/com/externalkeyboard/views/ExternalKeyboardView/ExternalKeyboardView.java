package com.externalkeyboard.views.ExternalKeyboardView;

import android.content.Context;
import android.view.KeyEvent;
import android.view.View;
import android.view.ViewGroup;


import com.externalkeyboard.events.EventHelper;

import com.externalkeyboard.services.KeyboardKeyPressHandler;
import com.facebook.react.bridge.ReactContext;
import com.facebook.react.uimanager.ThemedReactContext;
import com.facebook.react.views.view.ReactViewGroup;

public class ExternalKeyboardView extends ReactViewGroup {
  public boolean hasKeyDownListener = false;
  public boolean hasKeyUpListener = false;
  public boolean autoFocus = false;

  private final KeyboardKeyPressHandler keyboardKeyPressHandler;
  private final Context context;
  private View listeningView;

  public ExternalKeyboardView(Context context) {
    super(context);
    this.context = context;
    this.keyboardKeyPressHandler = new KeyboardKeyPressHandler();
  }


  private void onKeyPressHandler(ReactViewGroup reactViewGroup, int keyCode, KeyEvent keyEvent, ThemedReactContext reactContext) {
    if(!(reactViewGroup instanceof ExternalKeyboardView)) return;
    ExternalKeyboardView viewGroup = (ExternalKeyboardView)reactViewGroup;

    if (!viewGroup.hasKeyUpListener && !viewGroup.hasKeyDownListener) {
      return;
    }

    KeyboardKeyPressHandler.PressInfo pressInfo = keyboardKeyPressHandler.getEventsFromKeyPress(keyCode, keyEvent);

    if (pressInfo.firePressDownEvent && viewGroup.hasKeyDownListener) {
      EventHelper.pressDown((ReactContext) context, viewGroup.getId(), keyCode, keyEvent);
    }

    if (pressInfo.firePressUpEvent && viewGroup.hasKeyUpListener) {
      EventHelper.pressUp((ReactContext) context, viewGroup.getId(), keyCode, keyEvent, pressInfo.isLongPress);
    }
  }



  @Override
  protected void onAttachedToWindow() {
    super.onAttachedToWindow();

    this.listeningView = getFocusingView();
    if(this.listeningView == this) {
      setFocusable(true);
    }

    this.listeningView.setOnFocusChangeListener(
      (focusedView, hasFocus) -> {
        EventHelper.focusChanged((ReactContext) context, this.getId(), hasFocus);
      });

    this.listeningView.setOnKeyListener((View v, int keyCode, KeyEvent keyEvent) -> {
      onKeyPressHandler(this, keyCode, keyEvent, (ThemedReactContext) context);
      return false;
    });

    if(autoFocus) {
      this.focus();
      EventHelper.focusChanged((ReactContext) context, this.getId(), true);
    }
  }

  @Override
  protected void onDetachedFromWindow() {
    super.onDetachedFromWindow();
    if(this.listeningView != null) {
      this.listeningView.setOnFocusChangeListener(null);
    }
  }

  private View getFocusingView() {
   if(this.getChildCount() == 1 && this.getChildAt(0).isFocusable()) {
     return this.getChildAt(0);
   }

   return this;
  }

  public void setCanBeFocused(boolean canBeFocused) {
    int descendantFocusability = canBeFocused ?
      ViewGroup.FOCUS_BEFORE_DESCENDANTS
      : ViewGroup.FOCUS_BLOCK_DESCENDANTS;
    this.setDescendantFocusability(descendantFocusability);
  }


  public void focus() {
    View focusingView = this.getFocusingView();
    focusingView.requestFocus();
  }

}
