package com.externalkeyboard.helper.Linking;

import android.view.View;

import java.util.NavigableMap;
import java.util.NavigableSet;
import java.util.TreeMap;
import java.util.TreeSet;

public class LinkingQueue1 {
  public NavigableSet<Integer> positions = new TreeSet<>();
  public NavigableMap<Integer, View> viewMap = new TreeMap<>();


//  private void linkPosition(View prev, View next) {
//    if (prev != null && next != null) {
//      prev.setNextFocusForwardId(next.getId());
//      if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.LOLLIPOP_MR1) {
//        prev.setAccessibilityTraversalBefore(next.getId());
//      }
//    }
//  }

  private void addWithLinking(int position, View currentView) {
    viewMap.put(position, currentView);
//    Map.Entry<Integer, View> nextView = viewMap.higherEntry(position);
//    Map.Entry<Integer, View> prevView = viewMap.lowerEntry(position);

//    if (prevView != null) {
//      this.linkPosition(prevView.getValue(), currentView);
//    }
//
//    if (nextView != null) {
//      this.linkPosition(currentView, nextView.getValue());
//    }
  }

//  private void unlinkLast() {
////    Map.Entry<Integer, View> lastView = viewMap.lastEntry();
////    if (lastView != null) {
////      lastView.getValue().setNextFocusForwardId(View.NO_ID);
//////      if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.LOLLIPOP_MR1) {
//////        lastView.getValue().setAccessibilityTraversalBefore(View.NO_ID);
//////      }
////    }
//  }
  private void reLinkWithRemove(int position) {
//    Map.Entry<Integer, View> nextView = viewMap.higherEntry(position);
//    Map.Entry<Integer, View> prevView = viewMap.lowerEntry(position);

//    if (prevView != null && nextView != null) {
//      this.linkPosition(prevView.getValue(), nextView.getValue());
//    }

//    boolean shouldUnlinkLast = nextView == null;
    this.viewMap.remove(position);
//
//    if (shouldUnlinkLast) {
//      this.unlinkLast();
//    }
  }

  public void addPosition(View view, int position) {
    if (this.viewMap.get(position) == view) {
      return;
    }

    this.addWithLinking(position, view);
  }

  public void removeFromOrder(int position) {
    if (!this.positions.contains(position)) return;
    this.reLinkWithRemove(position);
  }

  public void refreshIndexes(View view, int position) {
    this.viewMap.put(position, view);

//    for (Map.Entry<Integer, View> positionEntry : this.viewMap.entrySet()) {
//      if (positionEntry != null) {
//        View currentView = positionEntry.getValue();
//        Map.Entry<Integer, View> nextEntry = this.viewMap.higherEntry(positionEntry.getKey());
//
////        if (nextEntry != null) {
////          linkPosition(currentView, nextEntry.getValue());
////        }
//      }
//    }

//    unlinkLast();
  }
}
