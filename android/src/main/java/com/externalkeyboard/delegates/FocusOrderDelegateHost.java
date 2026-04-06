package com.externalkeyboard.delegates;

import android.view.View;

public interface FocusOrderDelegateHost {
  View getFirstChild();
  String getOrderGroup();
  Integer getOrderIndex();
  String getOrderId();
  String getOrderLeft();
  String getOrderRight();
  String getOrderUp();
  String getOrderDown();
}
