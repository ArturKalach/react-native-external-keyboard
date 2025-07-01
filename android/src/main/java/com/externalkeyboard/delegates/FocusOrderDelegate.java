package com.externalkeyboard.delegates;

import android.view.View;

import com.externalkeyboard.helper.Linking.A11yOrderLinking;
import com.externalkeyboard.services.FocusLinkObserver.FocusLinkObserver;
import com.externalkeyboard.services.FocusLinkObserver.FocusLinkObserverSingleton;
import com.externalkeyboard.views.ExternalKeyboardView.ExternalKeyboardView;

public class FocusOrderDelegate {
  private final ExternalKeyboardView delegate;

  FocusLinkObserver.LinkUpdatedCallback leftUpdated = null;
  FocusLinkObserver.LinkRemovedCallback leftRemoved = null;
  FocusLinkObserver.LinkUpdatedCallback rightUpdated = null;
  FocusLinkObserver.LinkRemovedCallback rightRemoved = null;
  FocusLinkObserver.LinkUpdatedCallback upUpdated = null;
  FocusLinkObserver.LinkRemovedCallback upRemoved = null;
  FocusLinkObserver.LinkUpdatedCallback downUpdated = null;
  FocusLinkObserver.LinkRemovedCallback downRemoved = null;


  public FocusOrderDelegate(ExternalKeyboardView delegate) {
    super();
    this.delegate = delegate;
  }

  public void link() {
    View child = delegate.getFirstChild();
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

  public void refreshOrder() {
    View child = delegate.getFirstChild();
    String orderGroup = delegate.getOrderGroup();
    Integer orderIndex = delegate.getOrderIndex();

    if (child != null && orderGroup != null) {
      A11yOrderLinking.getInstance().refreshIndexes(child, orderGroup, orderIndex);
    }
  }

  public void refreshLeft(String prev, String next) {
    FocusLinkObserver observer = FocusLinkObserverSingleton.getInstance();
    if (prev != null && leftUpdated != null && leftRemoved != null) {
      observer.unsubscribe(prev, leftUpdated, leftRemoved);
      View child = delegate.getFirstChild();
      if(child != null) {
        child.setNextFocusLeftId(View.NO_ID);
      }
    }

    View child = delegate.getFirstChild();
    if (next != null && child != null) {
      leftUpdated = link -> child.setNextFocusLeftId(link.getId());
      leftRemoved = () -> child.setNextFocusLeftId(View.NO_ID);
      observer.subscribe(next, leftUpdated, leftRemoved);
    }
  }

  public void refreshRight(String prev, String next) {
    FocusLinkObserver observer = FocusLinkObserverSingleton.getInstance();
    if (rightUpdated != null && rightRemoved != null) {
      observer.unsubscribe(prev, rightUpdated, rightRemoved);
      View child = delegate.getFirstChild();
      if(child != null) {
        child.setNextFocusRightId(View.NO_ID);
      }
    }

    View child = delegate.getFirstChild();
    if (next != null && child != null) {
      rightUpdated = link -> child.setNextFocusRightId(link.getId());
      rightRemoved = () -> child.setNextFocusRightId(View.NO_ID);
      observer.subscribe(next, rightUpdated, rightRemoved);
    }
  }

  public void refreshUp(String prev, String next) {
    FocusLinkObserver observer = FocusLinkObserverSingleton.getInstance();
    if (prev != null && upUpdated != null && upRemoved != null) {
      observer.unsubscribe(prev, upUpdated, upRemoved);

      View child = delegate.getFirstChild();
      if(child != null) {
        child.setNextFocusUpId(View.NO_ID);
      }
    }

    View child = delegate.getFirstChild();
    if (next != null && child != null) {
      upUpdated = link -> child.setNextFocusUpId(link.getId());
      upRemoved = () -> child.setNextFocusUpId(View.NO_ID);
      observer.subscribe(next, upUpdated, upRemoved);
    }
  }

  public void updateOrderGroup(String prev, String next) {
    View child = delegate.getFirstChild();
    Integer position = delegate.getOrderIndex();

    if (child != null && position != null) {
      A11yOrderLinking.getInstance().updateGroup(prev, next, position, child);
    }
  }

  public void refreshDown(String prev, String next) {
    FocusLinkObserver observer = FocusLinkObserverSingleton.getInstance();
    if (prev != null && downUpdated != null && downRemoved != null) {
      observer.unsubscribe(prev, downUpdated, downRemoved);

      View child = delegate.getFirstChild();
      if(child != null) {
        child.setNextFocusDownId(View.NO_ID);
      }
    }

    View child = delegate.getFirstChild();
    if (next != null && child != null) {
      downUpdated = link -> child.setNextFocusDownId(link.getId());
      downRemoved = () -> child.setNextFocusDownId(View.NO_ID);
      observer.subscribe(next, downUpdated, downRemoved);
    }
  }


  public void unlink(View unlinkView) {
    String orderGroup = delegate.getOrderGroup();
    Integer orderIndex = delegate.getOrderIndex();
    String orderId = delegate.getOrderId();

    if (orderGroup != null && orderIndex != null) {
      A11yOrderLinking.getInstance().removeRelationship(orderGroup, orderIndex);
    }

    if (orderId != null) {
      FocusLinkObserver observer = FocusLinkObserverSingleton.getInstance();
      View storedView = A11yOrderLinking.getInstance().getOrderLink(orderId);
      if(storedView == unlinkView) {
        observer.emitRemove(orderId);
        A11yOrderLinking.getInstance().removeOrderLink(orderId);
      }
    }


    if (delegate.getOrderLeft() != null) {
      FocusLinkObserver observer = FocusLinkObserverSingleton.getInstance();
      observer.unsubscribe(delegate.getOrderLeft(), leftUpdated, leftRemoved);
    }

    if (delegate.getOrderRight() != null) {
      FocusLinkObserver observer = FocusLinkObserverSingleton.getInstance();
      observer.unsubscribe(delegate.getOrderRight(), rightUpdated, rightRemoved);
    }

    if (delegate.getOrderUp() != null) {
      FocusLinkObserver observer = FocusLinkObserverSingleton.getInstance();
      observer.unsubscribe(delegate.getOrderUp(), upUpdated, upRemoved);
    }

    if (delegate.getOrderDown() != null) {
      FocusLinkObserver observer = FocusLinkObserverSingleton.getInstance();
      observer.unsubscribe(delegate.getOrderDown(), downUpdated, downRemoved);
    }
  }

  public View getLink(String linkId) {
    return A11yOrderLinking.getInstance().getOrderLink(linkId);
  }

  public void clear(View view) {
    if(view != null) {
      unlink(view);
    }
  }

}
