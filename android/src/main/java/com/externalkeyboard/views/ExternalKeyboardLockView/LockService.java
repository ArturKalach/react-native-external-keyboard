package com.externalkeyboard.views.ExternalKeyboardLockView;

import android.view.View;

import java.lang.ref.WeakReference;

public class LockService {
  private static LockService instance;

  private WeakReference<View> viewRef;
  private WeakReference<View> keyboardViewRef;


  private LockService() {
  }

  public static synchronized LockService getInstance() {
    if (instance == null) {
      instance = new LockService();
    }
    return instance;
  }

  public View getView() {
    return viewRef != null ? viewRef.get() : null;
  }

  public void setView(View view) {
    viewRef = new WeakReference<>(view);
  }

  public View getKeyboardView() {
    return keyboardViewRef != null ? keyboardViewRef.get() : null;
  }

  public void setKeyboardView(View view) {
    keyboardViewRef = new WeakReference<>(view);
  }

  public void clear() {
    this.viewRef = null;
    this.keyboardViewRef = null;
  }
}
