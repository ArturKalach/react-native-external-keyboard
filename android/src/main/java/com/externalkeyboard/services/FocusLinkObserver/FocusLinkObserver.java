package com.externalkeyboard.services.FocusLinkObserver;

import android.view.View;

import java.lang.ref.WeakReference;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

public class FocusLinkObserver {
  private final Map<String, View> links;
  private final Map<String, List<Subscriber>> subscribers;

  public FocusLinkObserver() {
    links = new HashMap<>();
    subscribers = new HashMap<>();
  }

  public void emit(String id, View link) {
    if (id == null || link == null) {
      throw new IllegalArgumentException("Both id and link are required");
    }

    links.put(id, link);
    emitLinkUpdated(id, link);
  }


  public void emitRemove(String id) {
    if (links.containsKey(id)) {
      links.remove(id);  // Remove the link
      emitLinkRemoved(id);  // Notify subscribers
      subscribers.remove(id);  // Clean up subscribers for the ID
    }
  }

  public void subscribe(String id, LinkUpdatedCallback onLinkUpdated, LinkRemovedCallback onLinkRemoved) {
    if (id == null || (onLinkUpdated == null && onLinkRemoved == null)) {
      return;
    }

    subscribers.putIfAbsent(id, new ArrayList<>());
    subscribers.get(id).add(new Subscriber(onLinkUpdated, onLinkRemoved));

    if (onLinkUpdated != null && links.containsKey(id)) {
      onLinkUpdated.onLinkUpdated(links.get(id));
    }
  }

  public void unsubscribe(String id, LinkUpdatedCallback onLinkUpdated, LinkRemovedCallback onLinkRemoved) {
    if (id == null || (onLinkUpdated == null && onLinkRemoved == null)) {
      return;
    }

    List<Subscriber> subscriberList = subscribers.get(id);
    if (subscriberList != null) {
      subscriberList.removeIf(subscriber -> {
        LinkUpdatedCallback updatedCallback = subscriber.onLinkUpdated.get();
        LinkRemovedCallback removedCallback = subscriber.onLinkRemoved.get();
        return updatedCallback == onLinkUpdated && removedCallback == onLinkRemoved;
      });

      if (subscriberList.isEmpty()) {
        subscribers.remove(id);
      }
    }
  }

  private void emitLinkUpdated(String id, View link) {
    List<Subscriber> subscriberList = subscribers.get(id);
    if (subscriberList != null) {
      subscriberList.removeIf(Subscriber::isEmpty);

      for (Subscriber subscriber : subscriberList) {
        subscriber.notifyLinkUpdated(link);
      }
    }
  }

  private void emitLinkRemoved(String id) {
    List<Subscriber> subscriberList = subscribers.get(id);
    if (subscriberList != null) {
      // Remove stale subscribers (whose weak references were garbage-collected)
      subscriberList.removeIf(Subscriber::isEmpty);

      // Notify all valid subscribers
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
    private final WeakReference<LinkUpdatedCallback> onLinkUpdated;
    private final WeakReference<LinkRemovedCallback> onLinkRemoved;

    public Subscriber(LinkUpdatedCallback onLinkUpdated, LinkRemovedCallback onLinkRemoved) {
      this.onLinkUpdated = new WeakReference<>(onLinkUpdated);
      this.onLinkRemoved = new WeakReference<>(onLinkRemoved);
    }

    public void notifyLinkUpdated(View link) {
      LinkUpdatedCallback callback = onLinkUpdated.get();
      if (callback != null) {
        callback.onLinkUpdated(link);
      }
    }

    public void notifyLinkRemoved() {
      LinkRemovedCallback callback = onLinkRemoved.get();
      if (callback != null) {
        callback.onLinkRemoved();
      }
    }

    public boolean isEmpty() {
      return onLinkUpdated.get() == null && onLinkRemoved.get() == null;
    }
  }
}
