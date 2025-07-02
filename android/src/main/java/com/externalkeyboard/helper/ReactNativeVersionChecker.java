package com.externalkeyboard.helper;

import com.facebook.react.views.textinput.ReactEditText;

import java.lang.reflect.Field;

public class ReactNativeVersionChecker {
  private static Boolean is80OrLaterVersion = null;

  public static boolean isReactNative80OrLater() {
    if (is80OrLaterVersion != null) {
      return is80OrLaterVersion;
    }

    try {
      Field field = ReactEditText.class.getDeclaredField("dragAndDropFilter");
      is80OrLaterVersion = true;
    } catch (NoSuchFieldException e) {
      is80OrLaterVersion = false;
    }

    return is80OrLaterVersion;
  }
}
