package com.externalkeyboard.views.KeyboardFocusGuide;

import androidx.annotation.Nullable;

import com.externalkeyboard.KeyboardFocusGuideManagerSpec;
import com.facebook.react.module.annotations.ReactModule;
import com.facebook.react.uimanager.ThemedReactContext;
import com.facebook.react.uimanager.annotations.ReactProp;

@ReactModule(name = KeyboardFocusGuideManager.NAME)
public class KeyboardFocusGuideManager extends KeyboardFocusGuideManagerSpec<KeyboardFocusGuide> {
  public static final String NAME = "KeyboardFocusGuide";

  @Override
  public String getName() {
    return NAME;
  }

  @Override
  public KeyboardFocusGuide createViewInstance(ThemedReactContext context) {
    return new KeyboardFocusGuide(context);
  }

  @Override
  @ReactProp(name = "preferredFocusOrderId")
  public void setPreferredFocusOrderId(KeyboardFocusGuide view, @Nullable String value) {
    view.setPreferredFocusOrderId(value);
  }

  @Override
  @ReactProp(name = "enabled", defaultBoolean = true)
  public void setEnabled(KeyboardFocusGuide view, boolean value) {
    view.setGuideEnabled(value);
  }

  @Override
  @ReactProp(name = "guideMask", defaultInt = KeyboardFocusGuide.DEFAULT_GUIDE_MASK)
  public void setGuideMask(KeyboardFocusGuide view, int value) {
    view.setGuideMask(value);
  }

  @Override
  @ReactProp(name = "groupIdentifier")
  public void setGroupIdentifier(KeyboardFocusGuide view, @Nullable String value) {
    // stub (iOS)
  }

  @Override
  @ReactProp(name = "uniqueGroupIdentifierEnabled")
  public void setUniqueGroupIdentifierEnabled(KeyboardFocusGuide view, boolean value) {
    // stub (iOS)
  }
}
