package com.externalkeyboard.services;


import static com.facebook.react.uimanager.common.UIManagerType.FABRIC;

import android.app.Activity;
import android.util.Log;
import android.view.View;

import com.facebook.react.bridge.ReactApplicationContext;
import com.facebook.react.bridge.UIManager;
import com.facebook.react.uimanager.IllegalViewOperationException;
import com.facebook.react.uimanager.UIManagerHelper;
import com.facebook.react.uimanager.UIManagerModule;
import com.facebook.react.uimanager.common.ViewUtil;

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
        int uiManagerType = ViewUtil.getUIManagerType(tag);
        if (uiManagerType == FABRIC) {
          UIManager fabricUIManager =
            UIManagerHelper.getUIManager(context, uiManagerType);
          if (fabricUIManager != null) {
            View view = fabricUIManager.resolveView(tag);
            view.requestFocus();
          }
        } else {
          UIManager uiManager = context.getNativeModule(UIManagerModule.class);
          View view = uiManager.resolveView(tag);
          view.requestFocus();
        }
      } catch (IllegalViewOperationException error) {
        Log.e("KEYBOARD_FOCUS_ERROR", error.getMessage());
      }
    });
  }

}
