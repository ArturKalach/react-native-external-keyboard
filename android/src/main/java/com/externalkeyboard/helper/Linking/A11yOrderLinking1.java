package com.externalkeyboard.helper.Linking;

import android.view.View;

import java.util.HashMap;
import java.util.Map;
import java.util.NavigableMap;
import java.util.TreeMap;

public class A11yOrderLinking1 {

  private static A11yOrderLinking1 instance;
  private final Map<String, LinkingQueue1> relationships;

  private A11yOrderLinking1() {
    relationships = new HashMap<>();
  }

  public static synchronized A11yOrderLinking1 getInstance() {
    if (instance == null) {
      instance = new A11yOrderLinking1();
    }
    return instance;
  }

  public NavigableMap<Integer, View> getOrderInfo(String key) {
    LinkingQueue1 queue = relationships.get(key);
    if(queue == null) {
      return new TreeMap<>();
    }
    return queue.viewMap;
  }

  public void refreshIndexes(View view, String key, int position) {
    LinkingQueue1 queue = relationships.get(key);
    if (queue != null) {
      queue.refreshIndexes(view, position);
    }
  }

  public void addViewRelationship(View view, String key, int position) {
    LinkingQueue1 queue = relationships.get(key);
    if (queue == null) {
      queue = new LinkingQueue1();
      relationships.put(key, queue);
    }

    queue.addPosition(view, position);
  }


  public void removeRelationship(String key, int index) {
    LinkingQueue1 queue = relationships.get(key);
    if (queue == null) return;

    queue.removeFromOrder(index);
  }
}
