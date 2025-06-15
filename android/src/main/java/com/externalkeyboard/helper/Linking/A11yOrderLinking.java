package com.externalkeyboard.helper.Linking;

import android.view.View;

import java.util.HashMap;
import java.util.Map;
import java.util.WeakHashMap;

public class A11yOrderLinking {

  private static A11yOrderLinking instance;
  private final Map<String, LinkingQueue> relationships;
  private final Map<String, View> weakMap;

  private A11yOrderLinking() {
    relationships = new HashMap<>();
    weakMap = new WeakHashMap<>();
  }

  public static synchronized A11yOrderLinking getInstance() {
    if (instance == null) {
      instance = new A11yOrderLinking();
    }
    return instance;
  }

  public void addOrderLink(View view, String key){
    this.weakMap.put(key, view);
  }

  public void removeOrderLink(String key){
    this.weakMap.remove(key);
  }

  public View getOrderLink(String key){
    return this.weakMap.get(key);
  }

  public void refreshIndexes(View view, String key, int position) {
    LinkingQueue queue = relationships.get(key);
    if (queue != null) {
      queue.refreshIndexes(view, position);
    }
  }

  public void addViewRelationship(View view, String key, int position) {
    LinkingQueue queue = relationships.get(key);
    if (queue == null) {
      queue = new LinkingQueue();
      relationships.put(key, queue);
    }

    queue.addPosition(view, position);
  }


  public void removeRelationship(String key, int index) {
    LinkingQueue queue = relationships.get(key);
    if (queue == null) return;

    queue.removeFromOrder(index);
  }
}
