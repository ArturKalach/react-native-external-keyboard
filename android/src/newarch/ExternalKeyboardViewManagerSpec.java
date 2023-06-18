package com.externalkeyboard;

import android.view.View;

import androidx.annotation.Nullable;

import com.facebook.react.uimanager.SimpleViewManager;
import com.facebook.react.uimanager.ViewManagerDelegate;
import com.facebook.react.viewmanagers.ExternalKeyboardViewManagerDelegate;
import com.facebook.react.viewmanagers.ExternalKeyboardViewManagerInterface;
import com.facebook.soloader.SoLoader;

public abstract class ExternalKeyboardViewManagerSpec<T extends View> extends SimpleViewManager<T> implements ExternalKeyboardViewManagerInterface<T> {
  static {
    if (BuildConfig.CODEGEN_MODULE_REGISTRATION != null) {
      SoLoader.loadLibrary(BuildConfig.CODEGEN_MODULE_REGISTRATION);
    }
  }

  private final ViewManagerDelegate<T> mDelegate;

  public ExternalKeyboardViewManagerSpec() {
    mDelegate = new ExternalKeyboardViewManagerDelegate(this);
  }

  @Nullable
  @Override
  protected ViewManagerDelegate<T> getDelegate() {
    return mDelegate;
  }
}
