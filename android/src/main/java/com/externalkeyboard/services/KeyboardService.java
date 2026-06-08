package com.externalkeyboard.services;


import android.app.Activity;
import android.util.Log;
import android.view.View;

import com.facebook.react.bridge.ReactApplicationContext;
import com.facebook.react.bridge.UIManager;
import com.facebook.react.uimanager.IllegalViewOperationException;
import com.facebook.react.uimanager.UIManagerHelper;

public class KeyboardService {
  private final ReactApplicationContext context;

  public KeyboardService(ReactApplicationContext context) {
    this.context = context;
  }

  public void setKeyboardFocus(int tag) {
    final Activity activity = context.getCurrentActivity();

    if (activity == null) {
      return;
    }

    activity.runOnUiThread(() -> {
      try {
        UIManager uiManager = UIManagerHelper.getUIManagerForReactTag(context, tag);
        if (uiManager != null) {
          View view = uiManager.resolveView(tag);
          if (view != null) {
            view.requestFocus();
          }
        }
      } catch (IllegalViewOperationException error) {
        Log.e("KEYBOARD_FOCUS_ERROR", error.getMessage());
      }
    });
  }

}
