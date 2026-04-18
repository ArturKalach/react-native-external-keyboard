package com.externalkeyboard.delegates;

import android.view.View;

import com.externalkeyboard.helper.Linking.A11yOrderLinking;
import com.externalkeyboard.services.FocusLinkObserver.FocusLinkObserver;
import com.externalkeyboard.services.FocusLinkObserver.FocusLinkObserverSingleton;

import java.lang.ref.WeakReference;

public class FocusOrderDelegate {
  private final FocusOrderDelegateHost delegate;

  // The view that was registered during the last link() call. Stored here so
  // that unlink() does not depend on getFirstChild() returning the same value
  // (it may have changed by the time unlink() is called, e.g. after reactEditText
  // is cleared or focusType switches between FOCUS_BY_PRESS and regular focus).
  // WeakReference so a detached view is not kept alive by this delegate.
  private WeakReference<View> linkedChild = null;

  private View getLinkedChild() {
    return linkedChild != null ? linkedChild.get() : null;
  }

  FocusLinkObserver.LinkUpdatedCallback leftUpdated = null;
  FocusLinkObserver.LinkRemovedCallback leftRemoved = null;
  FocusLinkObserver.LinkUpdatedCallback rightUpdated = null;
  FocusLinkObserver.LinkRemovedCallback rightRemoved = null;
  FocusLinkObserver.LinkUpdatedCallback upUpdated = null;
  FocusLinkObserver.LinkRemovedCallback upRemoved = null;
  FocusLinkObserver.LinkUpdatedCallback downUpdated = null;
  FocusLinkObserver.LinkRemovedCallback downRemoved = null;

  public FocusOrderDelegate(FocusOrderDelegateHost delegate) {
    super();
    this.delegate = delegate;
  }

  public void link() {
    View child = delegate.getFirstChild();
    this.linkedChild = child != null ? new WeakReference<>(child) : null;

    String orderGroup = delegate.getOrderGroup();
    Integer orderIndex = delegate.getOrderIndex();
    String orderId = delegate.getOrderId();

    if (child != null && orderGroup != null && orderIndex != null) {
      A11yOrderLinking.getInstance().addViewRelationship(child, orderGroup, orderIndex);
    }

    FocusLinkObserver observer = FocusLinkObserverSingleton.getInstance();
    if (orderId != null && child != null) {
      observer.emit(orderId, child);
      A11yOrderLinking.getInstance().addOrderLink(child, orderId);
    }

    // Lambdas capture the local strong reference — fine for the subscription lifetime;
    // subscriptions are released in unlink().
    if (delegate.getOrderLeft() != null && child != null) {
      leftUpdated = link -> child.setNextFocusLeftId(link.getId());
      leftRemoved = () -> child.setNextFocusLeftId(View.NO_ID);
      observer.subscribe(delegate.getOrderLeft(), leftUpdated, leftRemoved);
    }

    if (delegate.getOrderRight() != null && child != null) {
      rightUpdated = link -> child.setNextFocusRightId(link.getId());
      rightRemoved = () -> child.setNextFocusRightId(View.NO_ID);
      observer.subscribe(delegate.getOrderRight(), rightUpdated, rightRemoved);
    }

    if (delegate.getOrderUp() != null && child != null) {
      upUpdated = link -> child.setNextFocusUpId(link.getId());
      upRemoved = () -> child.setNextFocusUpId(View.NO_ID);
      observer.subscribe(delegate.getOrderUp(), upUpdated, upRemoved);
    }

    if (delegate.getOrderDown() != null && child != null) {
      downUpdated = link -> child.setNextFocusDownId(link.getId());
      downRemoved = () -> child.setNextFocusDownId(View.NO_ID);
      observer.subscribe(delegate.getOrderDown(), downUpdated, downRemoved);
    }
  }

  public void unlink() {
    View child = getLinkedChild();
    String orderGroup = delegate.getOrderGroup();
    Integer orderIndex = delegate.getOrderIndex();
    String orderId = delegate.getOrderId();

    if (orderGroup != null && orderIndex != null) {
      A11yOrderLinking.getInstance().removeRelationship(orderGroup, orderIndex);
    }

    if (orderId != null) {
      FocusLinkObserver observer = FocusLinkObserverSingleton.getInstance();
      View storedView = A11yOrderLinking.getInstance().getOrderLink(orderId);
      if (storedView == child) {
        observer.emitRemove(orderId);
        A11yOrderLinking.getInstance().removeOrderLink(orderId);
      }
    }

    FocusLinkObserver observer = FocusLinkObserverSingleton.getInstance();
    if (delegate.getOrderLeft() != null) {
      observer.unsubscribe(delegate.getOrderLeft(), leftUpdated, leftRemoved);
    }
    if (delegate.getOrderRight() != null) {
      observer.unsubscribe(delegate.getOrderRight(), rightUpdated, rightRemoved);
    }
    if (delegate.getOrderUp() != null) {
      observer.unsubscribe(delegate.getOrderUp(), upUpdated, upRemoved);
    }
    if (delegate.getOrderDown() != null) {
      observer.unsubscribe(delegate.getOrderDown(), downUpdated, downRemoved);
    }

    this.linkedChild = null;
  }

  public void refreshOrder() {
    View child = getLinkedChild();
    String orderGroup = delegate.getOrderGroup();
    Integer orderIndex = delegate.getOrderIndex();

    if (child != null && orderGroup != null) {
      A11yOrderLinking.getInstance().refreshIndexes(child, orderGroup, orderIndex);
    }
  }

  public void refreshLeft(String prev, String next) {
    FocusLinkObserver observer = FocusLinkObserverSingleton.getInstance();
    View child = getLinkedChild();
    if (prev != null && leftUpdated != null && leftRemoved != null) {
      observer.unsubscribe(prev, leftUpdated, leftRemoved);
      if (child != null) {
        child.setNextFocusLeftId(View.NO_ID);
      }
    }
    if (next != null && child != null) {
      leftUpdated = link -> child.setNextFocusLeftId(link.getId());
      leftRemoved = () -> child.setNextFocusLeftId(View.NO_ID);
      observer.subscribe(next, leftUpdated, leftRemoved);
    }
  }

  public void refreshRight(String prev, String next) {
    FocusLinkObserver observer = FocusLinkObserverSingleton.getInstance();
    View child = getLinkedChild();
    if (prev != null && rightUpdated != null && rightRemoved != null) {
      observer.unsubscribe(prev, rightUpdated, rightRemoved);
      if (child != null) {
        child.setNextFocusRightId(View.NO_ID);
      }
    }
    if (next != null && child != null) {
      rightUpdated = link -> child.setNextFocusRightId(link.getId());
      rightRemoved = () -> child.setNextFocusRightId(View.NO_ID);
      observer.subscribe(next, rightUpdated, rightRemoved);
    }
  }

  public void refreshUp(String prev, String next) {
    FocusLinkObserver observer = FocusLinkObserverSingleton.getInstance();
    View child = getLinkedChild();
    if (prev != null && upUpdated != null && upRemoved != null) {
      observer.unsubscribe(prev, upUpdated, upRemoved);
      if (child != null) {
        child.setNextFocusUpId(View.NO_ID);
      }
    }
    if (next != null && child != null) {
      upUpdated = link -> child.setNextFocusUpId(link.getId());
      upRemoved = () -> child.setNextFocusUpId(View.NO_ID);
      observer.subscribe(next, upUpdated, upRemoved);
    }
  }

  public void refreshDown(String prev, String next) {
    FocusLinkObserver observer = FocusLinkObserverSingleton.getInstance();
    View child = getLinkedChild();
    if (prev != null && downUpdated != null && downRemoved != null) {
      observer.unsubscribe(prev, downUpdated, downRemoved);
      if (child != null) {
        child.setNextFocusDownId(View.NO_ID);
      }
    }
    if (next != null && child != null) {
      downUpdated = link -> child.setNextFocusDownId(link.getId());
      downRemoved = () -> child.setNextFocusDownId(View.NO_ID);
      observer.subscribe(next, downUpdated, downRemoved);
    }
  }

  public void updateOrderGroup(String prev, String next) {
    View child = getLinkedChild();
    Integer position = delegate.getOrderIndex();
    if (child != null && position != null) {
      A11yOrderLinking.getInstance().updateGroup(prev, next, position, child);
    }
  }

  public View getLink(String linkId) {
    return A11yOrderLinking.getInstance().getOrderLink(linkId);
  }

  public void cleanByOrderId(String orderId) {
    if (orderId == null) return;

    String orderGroup = delegate.getOrderGroup();
    Integer orderIndex = delegate.getOrderIndex();
    if (orderGroup != null && orderIndex != null) {
      A11yOrderLinking.getInstance().removeRelationship(orderGroup, orderIndex);
    }

    FocusLinkObserver observer = FocusLinkObserverSingleton.getInstance();
    observer.emitRemove(orderId);
    A11yOrderLinking.getInstance().removeOrderLink(orderId);
  }
}
