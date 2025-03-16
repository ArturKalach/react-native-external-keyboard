package com.externalkeyboard.modules;

import android.annotation.SuppressLint;
import android.content.Context;
import android.view.FocusFinder;
import android.view.View;
import android.view.ViewGroup;
import android.view.inputmethod.InputMethodManager;
import android.widget.EditText;

import com.externalkeyboard.NativeExternalKeyboardModuleSpec;
import com.externalkeyboard.views.TextInputFocusWrapper.TextInputFocusWrapper;
import com.facebook.react.bridge.Promise;
import com.facebook.react.bridge.ReactApplicationContext;

public class ExternalKeyboardModule extends NativeExternalKeyboardModuleSpec {
  public static final String NAME = "ExternalKeyboardModule";
  private static View focusedView = null;
  private final ReactApplicationContext context;


  private boolean dismiss() {
    if(focusedView == null) return false;
    try {
      InputMethodManager imm = (InputMethodManager) context.getSystemService(Context.INPUT_METHOD_SERVICE);
      if (imm != null) {
        imm.hideSoftInputFromWindow(focusedView.getWindowToken(), 0);
        return true;
      }
    } catch (Exception ignored){}

    return false;
  }


  public static void setFocusedTextInput (View _focusedView) {
    focusedView = _focusedView;
  }

  public ExternalKeyboardModule(ReactApplicationContext reactContext) {
    super(reactContext);
    context = reactContext;
  }

  @Override
  public String getName() {
    return NAME;
  }

  @Override
  public void dismissKeyboard(Promise promise) {
    boolean result = dismiss();
    promise.resolve(result);
  }
}
