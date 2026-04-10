package com.externalkeyboard.services.FocusLinkObserver;

import android.view.View;

import java.lang.ref.WeakReference;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

public class FocusLinkObserver {
  private final Map<String, WeakReference<View>> links;
  private final Map<String, List<Subscriber>> subscribers;

  public FocusLinkObserver() {
    links = new HashMap<>();
    subscribers = new HashMap<>();
  }

  public void emit(String id, View link) {
    if (id == null || link == null) {
      throw new IllegalArgumentException("Both id and link are required");
    }

    links.entrySet().removeIf(e -> e.getValue().get() == null);
    links.put(id, new WeakReference<>(link));
    emitLinkUpdated(id, link);
  }

  public void emitRemove(String id) {
    if (links.containsKey(id)) {
      links.remove(id);
      emitLinkRemoved(id);
      subscribers.remove(id);
    }
  }

  public void subscribe(String id, LinkUpdatedCallback onLinkUpdated, LinkRemovedCallback onLinkRemoved) {
    if (id == null || (onLinkUpdated == null && onLinkRemoved == null)) {
      return;
    }

    subscribers.putIfAbsent(id, new ArrayList<>());
    subscribers.get(id).add(new Subscriber(onLinkUpdated, onLinkRemoved));

    if (onLinkUpdated != null && links.containsKey(id)) {
      WeakReference<View> ref = links.get(id);
      View link = ref != null ? ref.get() : null;
      if (link != null) {
        onLinkUpdated.onLinkUpdated(link);
      }
    }
  }

  public void unsubscribe(String id, LinkUpdatedCallback onLinkUpdated, LinkRemovedCallback onLinkRemoved) {
    if (id == null || (onLinkUpdated == null && onLinkRemoved == null)) {
      return;
    }

    List<Subscriber> subscriberList = subscribers.get(id);
    if (subscriberList != null) {
      subscriberList.removeIf(subscriber ->
        subscriber.onLinkUpdated == onLinkUpdated && subscriber.onLinkRemoved == onLinkRemoved
      );

      if (subscriberList.isEmpty()) {
        subscribers.remove(id);
      }
    }
  }

  private void emitLinkUpdated(String id, View link) {
    List<Subscriber> subscriberList = subscribers.get(id);
    if (subscriberList != null) {
      for (Subscriber subscriber : subscriberList) {
        subscriber.notifyLinkUpdated(link);
      }
    }
  }

  private void emitLinkRemoved(String id) {
    List<Subscriber> subscriberList = subscribers.get(id);
    if (subscriberList != null) {
      for (Subscriber subscriber : subscriberList) {
        subscriber.notifyLinkRemoved();
      }
    }
  }

  @FunctionalInterface
  public interface LinkUpdatedCallback {
    void onLinkUpdated(View link);
  }

  @FunctionalInterface
  public interface LinkRemovedCallback {
    void onLinkRemoved();
  }

  private static class Subscriber {
    final LinkUpdatedCallback onLinkUpdated;
    final LinkRemovedCallback onLinkRemoved;

    Subscriber(LinkUpdatedCallback onLinkUpdated, LinkRemovedCallback onLinkRemoved) {
      this.onLinkUpdated = onLinkUpdated;
      this.onLinkRemoved = onLinkRemoved;
    }

    void notifyLinkUpdated(View link) {
      if (onLinkUpdated != null) {
        onLinkUpdated.onLinkUpdated(link);
      }
    }

    void notifyLinkRemoved() {
      if (onLinkRemoved != null) {
        onLinkRemoved.onLinkRemoved();
      }
    }
  }
}
