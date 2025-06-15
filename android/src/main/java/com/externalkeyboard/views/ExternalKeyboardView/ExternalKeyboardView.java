package com.externalkeyboard.views.ExternalKeyboardView;

import android.content.Context;
import android.view.KeyEvent;
import android.view.View;
import android.view.ViewGroup;
import android.view.ViewParent;
import android.view.ViewTreeObserver;
import android.view.accessibility.AccessibilityEvent;

import com.externalkeyboard.events.EventHelper;

import com.externalkeyboard.helper.FocusHelper;
import com.externalkeyboard.helper.Linking.A11yOrderLinking;
import com.externalkeyboard.services.KeyboardKeyPressHandler;
import com.facebook.react.bridge.ReactContext;
import com.facebook.react.uimanager.UIManagerHelper;
import com.facebook.react.uimanager.common.ViewUtil;
import com.facebook.react.uimanager.events.Event;
import com.facebook.react.uimanager.events.EventDispatcher;
import com.facebook.react.uimanager.events.EventDispatcherListener;
import com.facebook.react.views.view.ReactViewGroup;

import java.util.Map;
import java.util.NavigableMap;

public class ExternalKeyboardView extends ReactViewGroup {
  public boolean hasKeyDownListener = false;
  public boolean hasKeyUpListener = false;
  public boolean autoFocus = false;
  public boolean hasBeenFocused = false;
  public boolean hasBeenA11yFocused = false;
  public boolean enableA11yFocus = false;
  public boolean screenAutoA11yFocus = false;
  public int screenAutoA11yFocusDelay = 500;
  public int lockFocus = 0;
  public String orderForward;
  public String orderBackward;
  public String orderId;


  private EventDispatcher a11yViewAppearDispatcher = null;
  private EventDispatcherListener eventA11yViewAppearListener = null;
  private final KeyboardKeyPressHandler keyboardKeyPressHandler;
  private final Context context;
  private View listeningView;

  private Integer orderIndex;
  private String orderGroup;
  private View firstChild;



  public void setOrderIndex(int orderIndex) {
    if(this.orderIndex == null) {
      this.orderIndex = orderIndex;
    } else {
      this.orderIndex = orderIndex;
      if(firstChild != null && orderGroup != null) {
        A11yOrderLinking.getInstance().refreshIndexes(firstChild, orderGroup, orderIndex);
      }
    }
  }

  public void setOrderGroup(String orderGroup) {
    this.orderGroup = orderGroup;
  }

  public ExternalKeyboardView(Context context) {
    super(context);
    this.context = context;
    this.keyboardKeyPressHandler = new KeyboardKeyPressHandler();
  }

  private void linkViews (boolean removeFromOrderQueue) {
    if(firstChild != null && orderGroup != null && orderIndex != null && !removeFromOrderQueue) {
      A11yOrderLinking.getInstance().addViewRelationship(firstChild, orderGroup, orderIndex);
    }
    if(removeFromOrderQueue && orderGroup != null && orderIndex != null) {
      A11yOrderLinking.getInstance().removeRelationship(orderGroup, orderIndex);
    }

    if(orderId != null && !removeFromOrderQueue) {
      A11yOrderLinking.getInstance().addOrderLink(firstChild, orderId);
    }

    if(orderId != null && removeFromOrderQueue) {
      A11yOrderLinking.getInstance().removeOrderLink(orderId);
    }
  }

  public void linkAddView(View child) {
    if(firstChild == null) {
      firstChild = child;
      linkViews(false);
    }
  }

  public void linkRemoveView(View view) {
    if(view == firstChild) {
      firstChild = null;
      linkViews(true);
    }
  }

  @Override
  public View focusSearch(View focused, int direction) {
    if(lockFocus == 0 && orderGroup == null && orderIndex == null) {
      return super.focusSearch(focused, direction);
    }

    boolean isLocked = FocusHelper.isLocked(direction, lockFocus);
    if(isLocked) {
      return this;
    }

    if(direction == FOCUS_FORWARD && orderForward != null) {
      View nextView = A11yOrderLinking.getInstance().getOrderLink(orderForward);
      if(nextView != null) {
        return nextView;
      }
    }

    if(direction == FOCUS_BACKWARD && orderBackward != null) {
      View prevView = A11yOrderLinking.getInstance().getOrderLink(orderBackward);
      if(prevView != null) {
        return prevView;
      }
    }

//    NavigableMap<Integer, View> orderMap = A11yOrderLinking.getInstance().get(orderGroup);
//    Map.Entry<Integer, View> next = orderMap.higherEntry(orderIndex);
//    Map.Entry<Integer, View> prev = orderMap.lowerEntry(orderIndex);
//
//    if(direction == FOCUS_FORWARD && next != null) {
//      View nextView = next.getValue();
//      if(nextView != null) {
//        return nextView;
//      }
//    }
//
//    if(direction == FOCUS_FORWARD && next == null) {
//      ViewParent parent = this.getParent();
//
//      if (parent instanceof ViewGroup parentView) {
//        return parentView.focusSearch(parentView, FOCUS_BACKWARD);
//      }
//    }

//    if(direction == FOCUS_BACKWARD && prev != null) {
//      View prevView = prev.getValue();
//      if(prevView != null) {
//        return prevView;
//      }
//    }
//
//    if(direction == FOCUS_BACKWARD && prev == null) {
//      ViewParent parent = this.getParent();
//
//      if (parent instanceof ViewGroup parentView) {
//        return parentView.focusSearch(parentView, FOCUS_FORWARD);
//      }
//    }

    return super.focusSearch(focused, direction);
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
    }

    if (pressInfo.firePressUpEvent && this.hasKeyUpListener) {
      EventHelper.pressUp((ReactContext) context, this.getId(), keyCode, keyEvent, pressInfo.isLongPress);
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

  private void onRnScreenViewAppear() {
    boolean a11yAutoFocus = autoFocus && enableA11yFocus && !hasBeenA11yFocused && screenAutoA11yFocus;
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

  @Override
  protected void onDetachedFromWindow() {
    super.onDetachedFromWindow();
    if (this.a11yViewAppearDispatcher != null && this.eventA11yViewAppearListener != null) {
      this.a11yViewAppearDispatcher.removeListener(this.eventA11yViewAppearListener);
      eventA11yViewAppearListener = null;
    }
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

  private void a11yFocus(View view) {
    if (!enableA11yFocus) return;
    view.sendAccessibilityEvent(AccessibilityEvent.TYPE_VIEW_FOCUSED);
  }


  public void focus(Boolean keyboard, Boolean a11y) {
    View focusingView = this.getFocusingView();
    if (keyboard) {
      focusingView.requestFocus();
    }
    if (a11y) {
      a11yFocus(focusingView);
    }
  }

  public void focus() {
    this.focus(true, true);
  }

}
