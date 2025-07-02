package com.externalkeyboard.services.FocusLinkObserver;

public final class FocusLinkObserverSingleton {

  private static volatile FocusLinkObserver instance;

  private FocusLinkObserverSingleton() {
  }

  public static FocusLinkObserver getInstance() {
    if (instance == null) {
      synchronized (FocusLinkObserverSingleton.class) {
        if (instance == null) {
          instance = new FocusLinkObserver();
        }
      }
    }
    return instance;
  }
}
