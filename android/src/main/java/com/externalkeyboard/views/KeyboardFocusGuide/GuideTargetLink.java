package com.externalkeyboard.views.KeyboardFocusGuide;

import android.view.View;

import androidx.annotation.NonNull;
import androidx.annotation.Nullable;

import com.externalkeyboard.services.FocusLinkObserver.FocusLinkObserver;
import com.externalkeyboard.services.FocusLinkObserver.FocusLinkObserverSingleton;

import java.lang.ref.WeakReference;

/** Follows the view registered under the guide's `preferredFocusOrderId` while the guide is attached. */
final class GuideTargetLink {
  interface Listener {
    void onTargetChanged(@Nullable View target);
  }

  private final GuideHost host;
  private final Listener listener;

  @Nullable private String preferredId;
  private boolean attached = false;
  @Nullable private WeakReference<View> target;

  @Nullable private String subscribedId;
  @Nullable private FocusLinkObserver.LinkUpdatedCallback onLinkUpdated;
  @Nullable private FocusLinkObserver.LinkRemovedCallback onLinkRemoved;

  GuideTargetLink(@NonNull GuideHost host, @NonNull Listener listener) {
    this.host = host;
    this.listener = listener;
  }

  void setPreferredId(@Nullable String id) {
    if ((id == null && preferredId == null) || (id != null && id.equals(preferredId))) {
      return;
    }
    preferredId = id;
    unsubscribe();
    if (attached) {
      subscribe();
    }
  }

  void attach() {
    attached = true;
    subscribe();
  }

  void detach() {
    attached = false;
    unsubscribe();
  }

  /** The observer reports a removed target, so a live reference is enough; {@link #getTarget()} checks attachment. */
  boolean hasTarget() {
    return target != null && target.get() != null;
  }

  @Nullable
  View getTarget() {
    View view = target == null ? null : target.get();
    return view != null && view.isAttachedToWindow() ? view : null;
  }

  private void setTarget(@Nullable View view) {
    target = view == null ? null : new WeakReference<>(view);
    listener.onTargetChanged(view);
  }

  private void subscribe() {
    final String id = preferredId;
    if (id == null || id.isEmpty() || subscribedId != null) return;

    final WeakReference<GuideTargetLink> self = new WeakReference<>(this);
    onLinkUpdated = link -> {
      GuideTargetLink owner = self.get();
      if (owner == null) return;
      owner.setTarget(link);
    };
    // The observer drops all subscribers of a removed id: resubscribe once it has finished
    // notifying, to catch the target being mounted again.
    onLinkRemoved = () -> {
      GuideTargetLink owner = self.get();
      if (owner == null) return;
      owner.setTarget(null);
      owner.host.post(() -> {
        // Skip if detached or pointed at another id meanwhile.
        if (!id.equals(owner.subscribedId)) return;
        owner.unsubscribe();
        owner.subscribe();
      });
    };

    subscribedId = id;
    FocusLinkObserverSingleton.getInstance().subscribe(id, onLinkUpdated, onLinkRemoved);
  }

  private void unsubscribe() {
    if (subscribedId != null) {
      FocusLinkObserverSingleton.getInstance().unsubscribe(subscribedId, onLinkUpdated, onLinkRemoved);
    }
    subscribedId = null;
    onLinkUpdated = null;
    onLinkRemoved = null;
    setTarget(null);
  }
}
