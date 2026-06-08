package com.externalkeyboard.helper;

import com.facebook.react.bridge.ReactContext;
import com.facebook.react.uimanager.ThemedReactContext;
import com.facebook.react.uimanager.UIManagerHelper;
import com.facebook.react.uimanager.events.EventDispatcher;
import com.facebook.react.uimanager.events.EventDispatcherProvider;

/**
 * New Architecture implementation. Prefers the bridgeless {@link EventDispatcherProvider}
 * path — the way RN 0.85+'s {@code UIManagerHelper.getEventDispatcher(context)} works,
 * without the deprecated reactTag. Fabric can still run on the legacy Bridge (e.g. on
 * rn < 0.79, or whenever bridgeless is disabled), where the context is not an
 * {@link EventDispatcherProvider}; that case falls back to the reactTag lookup.
 */
public class ReactNativeEventDispatcher {
  @SuppressWarnings("deprecation")
  public static EventDispatcher getEventDispatcher(ReactContext context, int id) {
    ReactContext reactContext = context;
    if (reactContext instanceof ThemedReactContext) {
      reactContext = ((ThemedReactContext) reactContext).getReactApplicationContext();
    }
    if (reactContext instanceof EventDispatcherProvider) {
      return ((EventDispatcherProvider) reactContext).getEventDispatcher();
    }
    return UIManagerHelper.getEventDispatcherForReactTag(context, id);
  }
}
