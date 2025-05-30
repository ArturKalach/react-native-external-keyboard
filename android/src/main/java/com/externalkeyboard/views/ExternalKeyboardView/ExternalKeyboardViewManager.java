package com.externalkeyboard.views.ExternalKeyboardView;

import androidx.annotation.Nullable;

import com.externalkeyboard.events.FocusChangeEvent;
import com.externalkeyboard.events.KeyPressDownEvent;
import com.externalkeyboard.events.KeyPressUpEvent;
import com.facebook.react.bridge.ReadableArray;
import com.facebook.react.module.annotations.ReactModule;
import com.facebook.react.uimanager.ThemedReactContext;
import com.facebook.react.uimanager.annotations.ReactProp;
import com.facebook.react.views.view.ReactViewGroup;

import java.util.HashMap;
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

  public static Map<String, Object> buildDirectEventMap(String registrationName) {
    Map<String, Object> eventMap = new HashMap<>();
    eventMap.put("registrationName", registrationName);
    return eventMap;
  }

  public static Map<String, String> buildPhasedRegistrationNames(String eventName) {
    Map<String, String> phasedRegistrationNames = new HashMap<>();
    phasedRegistrationNames.put("bubbled", eventName);
    return phasedRegistrationNames;
  }

  public static Map<String, Object> buildEventMap(String eventName) {
    Map<String, Object> eventMap = new HashMap<>();
    eventMap.put("phasedRegistrationNames", buildPhasedRegistrationNames(eventName));
    return eventMap;
  }

  @Nullable
  @Override
  public Map<String, Object> getExportedCustomDirectEventTypeConstants() {
    Map<String, Object> export = new HashMap<>();

    export.put(FocusChangeEvent.EVENT_NAME, buildDirectEventMap("onFocusChange"));
    export.put(KeyPressUpEvent.EVENT_NAME, buildDirectEventMap("onKeyUpPress"));
    export.put(KeyPressDownEvent.EVENT_NAME, buildDirectEventMap("onKeyDownPress"));

    return export;
  }

  @Override
  @ReactProp(name = "canBeFocused", defaultBoolean = true)
  public void setCanBeFocused(ExternalKeyboardView wrapper, boolean canBeFocused) {
    wrapper.setCanBeFocused(canBeFocused);
  }

  @Override
  @ReactProp(name = "enableA11yFocus", defaultBoolean = false)
  public void setEnableA11yFocus(ExternalKeyboardView wrapper, boolean enableA11yFocus) {
    wrapper.enableA11yFocus = enableA11yFocus;
  }

  @Override
  @ReactProp(name = "screenAutoA11yFocus", defaultBoolean = false)
  public void setScreenAutoA11yFocus(ExternalKeyboardView wrapper, boolean enableA11yFocus) {
    wrapper.screenAutoA11yFocus = enableA11yFocus;
  }

  @Override
  @ReactProp(name = "screenAutoA11yFocusDelay", defaultInt = 500)
  public void setScreenAutoA11yFocusDelay(ExternalKeyboardView wrapper, int value) {
    wrapper.screenAutoA11yFocusDelay = value;
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
  public void setAutoFocus(ExternalKeyboardView view, @Nullable boolean value) {
    view.autoFocus = value;
  }

  @Override
  @ReactProp(name = "haloEffect", defaultBoolean = false)
  public void setHaloEffect(ExternalKeyboardView view, boolean value) {
    //stub
  }

  @Override
  @ReactProp(name = "haloCornerRadius")
  public void setHaloCornerRadius(ExternalKeyboardView view, float value) {
    //stub
  }

  @Override
  @ReactProp(name = "haloExpendX")
  public void setHaloExpendX(ExternalKeyboardView view, float value) {
    //stub
  }

  @Override
  @ReactProp(name = "haloExpendY")
  public void setHaloExpendY(ExternalKeyboardView view, float value) {
    //stub
  }

  @Override
  @ReactProp(name = "tintColor")
  public void setTintColor(ExternalKeyboardView view, @Nullable Integer value) {

  }

  @Override
  public void setGroup(ExternalKeyboardView view, boolean value) {
    //stub
  }

  @Override
  public void setGroupIdentifier(ExternalKeyboardView view, @Nullable String value) {
    //stub
  }

  @Override
  public void focus(ExternalKeyboardView view) {
    view.focus();
  }

  @Override
  public void receiveCommand(ReactViewGroup root, String commandId, @Nullable ReadableArray args) {
    if (commandId.equals("focus")) {
      this.focus((ExternalKeyboardView) root);
    } else {
      super.receiveCommand(root, commandId, args);
    }
  }
}
