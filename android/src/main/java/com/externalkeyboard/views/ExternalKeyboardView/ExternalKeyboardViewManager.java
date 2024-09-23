package com.externalkeyboard.views.ExternalKeyboardView;

import androidx.annotation.Nullable;
import com.externalkeyboard.events.FocusChangeEvent;
import com.externalkeyboard.events.KeyPressDownEvent;
import com.externalkeyboard.events.KeyPressUpEvent;
import com.facebook.react.bridge.ReadableArray;
import com.facebook.react.common.MapBuilder;
import com.facebook.react.module.annotations.ReactModule;
import com.facebook.react.uimanager.ThemedReactContext;
import com.facebook.react.uimanager.annotations.ReactProp;
import com.facebook.react.views.view.ReactViewGroup;

import java.util.Map;


@ReactModule(name = ExternalKeyboardViewManager.NAME)
public class ExternalKeyboardViewManager extends com.externalkeyboard.ExternalKeyboardViewManagerSpec<ExternalKeyboardView> {

  public static final String NAME = "ExternalKeyboardView";

  @Override
  public String getName() {
    return NAME;
  }

  @Override
  public ExternalKeyboardView createViewInstance(ThemedReactContext context) {
    return new ExternalKeyboardView(context);
  }

  @Nullable
  @Override
  public Map<String, Object> getExportedCustomDirectEventTypeConstants() {
    Map<String, Object> export = MapBuilder.<String, Object>builder().build();
    if (export == null) {
      export = MapBuilder.newHashMap();
    }

    export.put(FocusChangeEvent.EVENT_NAME, MapBuilder.of("registrationName", "onFocusChange"));
    export.put(KeyPressUpEvent.EVENT_NAME, MapBuilder.of("registrationName", "onKeyUpPress"));
    export.put(KeyPressDownEvent.EVENT_NAME, MapBuilder.of("registrationName", "onKeyDownPress"));

    return export;
  }

  @Override
  @ReactProp(name = "canBeFocused", defaultBoolean = true)
  public void setCanBeFocused(ExternalKeyboardView wrapper, boolean canBeFocused) {
    wrapper.setCanBeFocused(canBeFocused);
  }

  @Override
  @ReactProp(name = "hasKeyDownPress")
  public void setHasKeyDownPress(ExternalKeyboardView view, boolean value) {
    view.hasKeyDownListener = value;
  }

  @Override
  @ReactProp(name = "hasKeyUpPress")
  public void setHasKeyUpPress(ExternalKeyboardView view, boolean value) {
    view.hasKeyUpListener = value;
  }

  @Override
  public void setHasOnFocusChanged(ExternalKeyboardView view, boolean value) {
    //stub
  }

  @Override
  @ReactProp(name = "autoFocus")
  public void setAutoFocus(ExternalKeyboardView view, @Nullable String value) {
    view.autoFocus = value != null;
  }

  @Override
  @ReactProp(name = "haloEffect", defaultBoolean = false)
  public void setHaloEffect(ExternalKeyboardView view, boolean value) {
    //stub
  }

  @Override
  public void setTintColor(ExternalKeyboardView view, @Nullable String value) {
    //stub
  }

  @Override
  public void setGroup(ExternalKeyboardView view, boolean value) {
    //stub
  }

  @Override
  public void focus(ExternalKeyboardView view, String rootViewId) {
    view.focus();
  }

  @Override
  public void receiveCommand(ReactViewGroup root, String commandId, @Nullable ReadableArray args) {
    if (commandId.equals("focus")) {
      this.focus((ExternalKeyboardView)root, "");
    } else {
      super.receiveCommand(root, commandId, args);
    }
  }
}
