package com.externalkeyboard.views.KeyboardFocusGroup;

import android.content.Context;
import android.graphics.Color;
import android.graphics.Rect;
import android.util.Log;
import android.view.View;
import android.view.ViewGroup;
import android.view.ViewParent;
import android.view.ViewTreeObserver;

import com.facebook.react.views.view.ReactViewGroup;

public class KeyboardFocusGroup extends ReactViewGroup {
  public KeyboardFocusGroup(Context context) {

    super(context);
//    this.setFocusable(true);
//    this.setDescendantFocusability(ViewGroup.FOCUS_BLOCK_DESCENDANTS);
//    ViewTreeObserver viewTreeObserver = this.getViewTreeObserver();
//    viewTreeObserver.addOnGlobalFocusChangeListener(new ViewTreeObserver.OnGlobalFocusChangeListener() {
//      @Override
//      public void onGlobalFocusChanged(View oldFocus, View newFocus) {
//        Log.d("GlobalFocusChange", "View gained focus: " + newFocus);
//        Log.d("GlobalFocusChange", "View lost focus: " + oldFocus);
//      }
//    });
  }
//
//  @Override
//  public boolean onRequestFocusInDescendants(int direction, Rect previouslyFocusedRect) {
//    // Add custom logic to determine whether and where focus should move
//    return super.onRequestFocusInDescendants(direction, previouslyFocusedRect);
//  }

//
//  @Override
//  protected void onFocusChanged(boolean gainFocus, int direction, Rect previouslyFocusedRect) {
//    super.onFocusChanged(gainFocus, direction, previouslyFocusedRect);
////    this.setDescendantFocusability(ViewGroup.FOCUS_BEFORE_DESCENDANTS);
////    if(direction == FOCUS_FORWARD) {
////      this.getChildAt(2).requestFocus();
////    }
////    if(direction == FOCUS_BACKWARD) {
////      this.getChildAt(1).requestFocus();
////    }
//
////    if (gainFocus) {
////      Log.d("CustomViewGroup", "ViewGroup gained focus. Direction: " + direction);
////
////      // Optionally redirect focus to a specific child view
////      if (getChildCount() > 0) {
////        getChildAt(0).requestFocus(direction, previouslyFocusedRect);
////      }
////    } else {
////      Log.d("CustomViewGroup", "ViewGroup lost focus.");
////    }
//  }
//  @Override
//  public void requestChildFocus(View child, View lastFocus) {
//    super.requestChildFocus(child, lastFocus);
////    View aaa = this.getChildAt(1);
////    aaa.requestFocus();
//    int ind = indexOfChild(lastFocus);
//    View forw = this.focusSearch(this, FOCUS_FORWARD);
//    View forw1 = this.focusSearch(child, FOCUS_FORWARD);
//
//    View back = this.focusSearch(this, FOCUS_BACKWARD);
//    View back1 = this.focusSearch(child, FOCUS_BACKWARD);
//
////    lastFocus.setBackgroundColor(Color.BLUE);
////    child.setBackgroundColor(Color.RED);
////    child.setBackgroundColor(Color.GRAY);
//
//    Log.d("Debug", "d");
//
//  }
//
//
////    View check = this.focusSearch(this, FOCUS_FORWARD);
////    check.setBackgroundColor(Color.BLUE);
//    // Track the previous focused view
////    previousFocusedView = lastFocus;
//
//    Log.d("CustomViewGroup", "Child view gained focus: " + child);
//    Log.d("CustomViewGroup", "Previous focused view: " + lastFocus);
//  }

  @Override
  public View focusSearch(View focused, int direction) {
//    if (focused == editText) {
//      // Always return the same view to block focus movement
//      return editText;
//    }
    return super.focusSearch(focused, direction);
  }
}
