package com.externalkeyboard.views.ExternalKeyboardView;

import android.content.Context;
import android.view.FocusFinder;
import android.view.KeyEvent;
import android.view.View;
import android.view.ViewGroup;
import android.view.ViewTreeObserver;
import android.view.accessibility.AccessibilityEvent;

import com.externalkeyboard.delegates.FocusOrderDelegate;
import com.externalkeyboard.events.EventHelper;

import com.externalkeyboard.helper.FocusHelper;
import com.externalkeyboard.helper.ReactNativeVersionChecker;
import com.externalkeyboard.services.KeyboardKeyPressHandler;
import com.facebook.react.bridge.ReactContext;
import com.facebook.react.uimanager.UIManagerHelper;
import com.facebook.react.uimanager.common.ViewUtil;
import com.facebook.react.uimanager.events.Event;
import com.facebook.react.uimanager.events.EventDispatcher;
import com.facebook.react.uimanager.events.EventDispatcherListener;
import com.facebook.react.views.view.ReactViewGroup;

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


  private FocusOrderDelegate focusOrderDelegate = null;
  private EventDispatcher a11yViewAppearDispatcher = null;
  private EventDispatcherListener eventA11yViewAppearListener = null;
  private final KeyboardKeyPressHandler keyboardKeyPressHandler;
  private final Context context;
  private View listeningView;

  private Integer orderIndex;
  private String orderGroup;
  private View firstChild;

  private String orderUp;
  private String orderDown;
  private String orderLeft;

  public String getOrderRight() {
    return orderRight;
  }

  public void setOrderRight(String orderRight) {
    focusOrderDelegate.refreshRight(this.orderRight, orderRight);
    this.orderRight = orderRight;
  }

  public String getOrderLeft() {
    return orderLeft;
  }

  public void setOrderLeft(String orderLeft) {
    focusOrderDelegate.refreshLeft(this.orderLeft, orderLeft);
    this.orderLeft = orderLeft;
  }

  public String getOrderDown() {
    return orderDown;
  }

  public void setOrderDown(String orderDown) {
    focusOrderDelegate.refreshDown(this.orderDown, orderDown);
    this.orderDown = orderDown;
  }

  public String getOrderUp() {
    return orderUp;
  }

  public void setOrderUp(String orderUp) {
    focusOrderDelegate.refreshUp(this.orderUp, orderUp);
    this.orderUp = orderUp;
  }

  private String orderRight;

  public ExternalKeyboardView(Context context) {
    super(context);
    this.context = context;
    this.focusOrderDelegate = new FocusOrderDelegate(this);
    this.keyboardKeyPressHandler = new KeyboardKeyPressHandler();
  }

  public View getFirstChild() {
    return this.firstChild;
  }

  public String getOrderGroup() {
    return this.orderGroup;
  }

  public String getOrderId() {
    return this.orderId;
  }

  public void setOrderGroup(String orderGroup) {
    focusOrderDelegate.updateOrderGroup(this.orderGroup, orderGroup);
    this.orderGroup = orderGroup;
  }

  public Integer getOrderIndex() {
    return this.orderIndex;
  }

  public void setOrderIndex(int orderIndex) {
    if (this.orderIndex == null) {
      this.orderIndex = orderIndex;
    } else {
      this.orderIndex = orderIndex;
      focusOrderDelegate.refreshOrder();
    }
  }

  public void linkAddView(View child) {
    if (firstChild == null) {
      firstChild = child;
      focusOrderDelegate.link();
    }
  }

  public void linkRemoveView(View view) {
    if (view == firstChild) {
      firstChild = null;
      focusOrderDelegate.unlink(view);
    }
  }

  @Override
  public View focusSearch(View focused, int direction) {
    if (lockFocus == 0 && orderGroup == null && orderIndex == null && orderForward == null && orderBackward == null) {
      return super.focusSearch(focused, direction);
    }

    boolean isLocked = FocusHelper.isLocked(direction, lockFocus);
    if (isLocked) {
      return this;
    }

    if (direction == FOCUS_FORWARD && orderForward != null) {
      View nextView = this.focusOrderDelegate.getLink(orderForward);
      if (nextView != null) {
        return nextView;
      }
    }

    if (direction == FOCUS_BACKWARD && orderBackward != null) {
      View prevView = this.focusOrderDelegate.getLink(orderBackward);
      if (prevView != null) {
        return prevView;
      }
    }

    if(ReactNativeVersionChecker.isReactNative80OrLater()) {
      if(orderGroup != null && orderIndex != null && (direction == FOCUS_FORWARD || direction == FOCUS_BACKWARD)){
        return FocusFinder.getInstance().findNextFocus((ViewGroup) this.getParent(), focused, direction);
      }
    }

    return super.focusSearch(focused, direction);
  }

  @Override
  public boolean dispatchKeyEvent(KeyEvent keyEvent) {
    if(lockFocus != 0) {
      int keyCode = keyEvent.getKeyCode();
      boolean isLocked = FocusHelper.isKeyLocked(keyCode, lockFocus);
      if(isLocked) {
        return true;
      }
    }
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

//    this.focusOrderDelegate.clear(firstChild); // ToDO check how to clean
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
