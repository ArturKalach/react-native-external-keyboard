package com.externalkeyboard.helper;

import com.facebook.react.bridge.ReactContext;
import com.facebook.react.uimanager.UIManagerHelper;
import com.facebook.react.uimanager.events.EventDispatcher;

/**
 * Legacy (Bridge / old architecture) implementation. The non-bridgeless context is not
 * an {@code EventDispatcherProvider}, so the dispatcher is resolved by reactTag.
 */
public class ReactNativeEventDispatcher {
  public static EventDispatcher getEventDispatcher(ReactContext context, int id) {
    return UIManagerHelper.getEventDispatcherForReactTag(context, id);
  }
}
