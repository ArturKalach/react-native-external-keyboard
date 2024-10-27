package com.externalkeyboard.helper;

import android.view.View;
import android.view.ViewGroup;

public class FocusHelper {
  public static View getFocusableView(ViewGroup viewGroup) {
    if (viewGroup.getChildCount() > 0) {
      View subView = viewGroup.getChildAt(0);
      if (subView.isFocusable()) {
        return subView;
      } else if (subView instanceof ViewGroup) {
        return getFocusableView((ViewGroup) subView);
      }
    }

    return null;
  }
}
