package com.externalkeyboard.views.base.keyboard;

import android.content.Context;
import android.view.View;

import com.externalkeyboard.events.EventHelper;
import com.externalkeyboard.views.base.FocusableBase;
import com.facebook.react.bridge.ReactContext;

public class ViewFocusChangeBase extends FocusableBase {
  private View listeningView;
  private final Context context;

  public ViewFocusChangeBase(Context context) {
    super(context);
    this.context = context;
  }


  @Override
  protected void onAttachedToWindow() {
    super.onAttachedToWindow();

    this.listeningView = getFocusingView();

    this.listeningView.setOnFocusChangeListener((focusedView, hasFocus) -> {
      EventHelper.focusChanged((ReactContext) context, this.getId(), hasFocus);
    });
  }

  @Override
  protected void onDetachedFromWindow() {
    super.onDetachedFromWindow();
    if (this.listeningView != null) {
      this.listeningView.setOnFocusChangeListener(null);
    }
  }
}
