package com.externalkeyboard.views.base;

import android.content.Context;
import android.util.Log;
import android.view.FocusFinder;
import android.view.KeyEvent;
import android.view.View;
import android.view.ViewGroup;

import com.externalkeyboard.delegates.FocusOrderDelegate;
import com.externalkeyboard.delegates.FocusOrderDelegateHost;
import com.externalkeyboard.helper.FocusHelper;
import com.externalkeyboard.helper.ReactNativeVersionChecker;

public class ViewOrderGroupBase extends ViewGroupBase implements FocusOrderDelegateHost {
  public int lockFocus = 0;

  private View firstChild;

  private Integer orderIndex;
  private String orderGroup;

  public String orderId;
  private String orderUp;
  private String orderDown;
  private String orderLeft;
  private String orderRight;
  public String orderForward;
  public String orderBackward;

  protected FocusOrderDelegate focusOrderDelegate;


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
    if(orderIndex == -1) {
      this.orderIndex = null;
      return;
    }
    boolean wasSet = this.orderIndex != null;
    this.orderIndex = orderIndex;
    if (wasSet) {
      focusOrderDelegate.refreshOrder();
    }
  }

  public View getFirstChild() {
    return this.firstChild;
  }

  public ViewOrderGroupBase(Context context) {
    super(context);
    this.focusOrderDelegate = new FocusOrderDelegate(this);
  }

  @Override
  public void onViewAdded(View child) {
    super.onViewAdded(child);
    linkAddView(child);
  }

  @Override
  public void onViewRemoved(View child) {
    super.onViewRemoved(child);
    linkRemoveView(child);
  }

  public void linkAddView(View child) {
    if (firstChild == null) {
      firstChild = child;
      focusOrderDelegate.link();
    }
  }

  public void linkRemoveView(View view) {
    if (view == firstChild) {
      focusOrderDelegate.unlink();
      firstChild = null;
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

    if (ReactNativeVersionChecker.isReactNative80OrLater()) {
      if (orderGroup != null && orderIndex != null && (direction == FOCUS_FORWARD || direction == FOCUS_BACKWARD)) {
        return FocusFinder.getInstance().findNextFocus((ViewGroup) this.getParent(), focused, direction);
      }
    }

    return super.focusSearch(focused, direction);
  }

  protected boolean isFocusLocked(KeyEvent keyEvent) {
    if (lockFocus != 0) {
      int keyCode = keyEvent.getKeyCode();
      return FocusHelper.isKeyLocked(keyCode, lockFocus);
    }

    return false;
  }


  private boolean isValidLinkedFocusTarget(View target) {
    if (target == null || !target.isAttachedToWindow() || !this.isAttachedToWindow()) {
      return false;
    }

    return target.getWindowToken() == this.getWindowToken();
  }

  public void onDropViewInstance() {
    focusOrderDelegate.cleanByOrderId(orderId);
  }
}
