package com.externalkeyboard.views.base.keyboard;

import android.content.Context;
import android.view.View;
import android.view.ViewTreeObserver;
import android.view.accessibility.AccessibilityEvent;

import com.facebook.react.bridge.ReactContext;
import com.facebook.react.uimanager.UIManagerHelper;
import com.facebook.react.uimanager.common.ViewUtil;
import com.facebook.react.uimanager.events.Event;
import com.facebook.react.uimanager.events.EventDispatcher;
import com.facebook.react.uimanager.events.EventDispatcherListener;


public class ViewFocusRequestBase extends ViewFocusChangeBase {
  public boolean autoFocus = false;
  public boolean hasBeenFocused = false;
  public boolean hasBeenA11yFocused = false;

  public boolean screenAutoA11yFocus = false;

  public int screenAutoA11yFocusDelay = 500;

  private EventDispatcher a11yViewAppearDispatcher = null;
  private EventDispatcherListener eventA11yViewAppearListener = null;
  private final Context context;

  public ViewFocusRequestBase(Context context) {
    super(context);
    this.context = context;
  }

  private void onRnScreenViewAppear() {
    boolean a11yAutoFocus = autoFocus && !hasBeenA11yFocused && screenAutoA11yFocus;
    if (!a11yAutoFocus) return;

    try {
      int reactTag = this.getId();
      int uiManagerType = ViewUtil.getUIManagerType(reactTag);
      a11yViewAppearDispatcher = UIManagerHelper.getEventDispatcher((ReactContext) context, uiManagerType);
      if (a11yViewAppearDispatcher == null) return;
      View focusingView = this.getFocusingView();


      eventA11yViewAppearListener = new EventDispatcherListener() {
        @Override
        public void onEventDispatch(Event event) {
          if ("topClick".equals(event.getEventName())) {
            a11yViewAppearDispatcher.removeListener(this);
            eventA11yViewAppearListener = null;
            hasBeenA11yFocused = true;
          }
          if ("topFinishTransitioning".equals(event.getEventName()) || "topShow".equals(event.getEventName())) {
            if (hasBeenA11yFocused) return;
            hasBeenA11yFocused = true;

            focusingView.postDelayed(() -> {
              focus(false, true);
              a11yViewAppearDispatcher.removeListener(this);
              eventA11yViewAppearListener = null;
            }, screenAutoA11yFocusDelay);
          }
        }
      };
      a11yViewAppearDispatcher.addListener(eventA11yViewAppearListener);
    } catch (Exception ignored) {
    }
  }

  @Override
  protected void onAttachedToWindow() {
    super.onAttachedToWindow();

    if (autoFocus && !hasBeenFocused) {
      this.autoFocusOnDraw();
      hasBeenFocused = true;
    }
  }

  @Override
  protected void onDetachedFromWindow() {
    super.onDetachedFromWindow();
    if (this.a11yViewAppearDispatcher != null && this.eventA11yViewAppearListener != null) {
      this.a11yViewAppearDispatcher.removeListener(this.eventA11yViewAppearListener);
      a11yViewAppearDispatcher = null;
      eventA11yViewAppearListener = null;
    }
  }

  private void autoFocusOnDraw() {
    getViewTreeObserver().addOnPreDrawListener(new ViewTreeObserver.OnPreDrawListener() {
      @Override
      public boolean onPreDraw() {
        onRnScreenViewAppear();
        getViewTreeObserver().removeOnPreDrawListener(this);
        focus();

        return true;
      }
    });
  }

  public void a11yFocus() {
    View focusingView = this.getFocusingView();
    focusingView.sendAccessibilityEvent(AccessibilityEvent.TYPE_VIEW_FOCUSED);
  }

  public void focus(boolean keyboard, boolean a11y) {
    View focusingView = this.getFocusingView();
    if (keyboard) {
      focusingView.requestFocus();
    }
   if (a11y) {
     a11yFocus();
   }
  }


  public void focus() {
    this.focus(true, true);
  }

}
