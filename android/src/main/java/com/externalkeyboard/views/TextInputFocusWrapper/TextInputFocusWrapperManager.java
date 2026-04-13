package com.externalkeyboard.views.TextInputFocusWrapper;

import android.view.View;
import android.view.ViewGroup;

import androidx.annotation.NonNull;
import androidx.annotation.Nullable;

import java.util.Objects;

import com.externalkeyboard.events.FocusChangeEvent;
import com.externalkeyboard.events.MultiplyTextSubmit;
import com.facebook.react.module.annotations.ReactModule;
import com.facebook.react.uimanager.ThemedReactContext;
import com.facebook.react.uimanager.annotations.ReactProp;
import com.facebook.react.views.textinput.ReactEditText;

import java.util.HashMap;
import java.util.Map;


@ReactModule(name = TextInputFocusWrapperManager.NAME)
public class TextInputFocusWrapperManager extends com.externalkeyboard.TextInputFocusWrapperManagerSpec<TextInputFocusWrapper> {
  public static final String NAME = "TextInputFocusWrapper";

  @Override
  public String getName() {
    return NAME;
  }

  @Override
  public TextInputFocusWrapper createViewInstance(ThemedReactContext context) {
    return subscribeOnHierarchy(new TextInputFocusWrapper(context));
  }

  @Override
  protected void addEventEmitters(final ThemedReactContext reactContext, TextInputFocusWrapper viewGroup) {
    viewGroup.subscribeOnFocus();
  }

  protected TextInputFocusWrapper subscribeOnHierarchy(TextInputFocusWrapper viewGroup) {
    viewGroup.setOnHierarchyChangeListener(new ViewGroup.OnHierarchyChangeListener() {
      @Override
      public void onChildViewAdded(View parent, View child) {
        if (child instanceof ReactEditText) {
          viewGroup.setEditText((ReactEditText) child);
        }
      }

      @Override
      public void onChildViewRemoved(View parent, View child) {
        if (child instanceof ReactEditText) {
          viewGroup.setEditText(null);
        }
      }
    });

    return viewGroup;
  }

  @Override
  @ReactProp(name = "focusType")
  public void setFocusType(TextInputFocusWrapper view, int value) {
    view.setFocusType(value);
  }

  @Override
  @ReactProp(name = "blurType")
  public void setBlurType(TextInputFocusWrapper view, int value) {
    view.setBlurType(value);
  }

  @Override
  @ReactProp(name = "blurOnSubmit", defaultBoolean = true)
  public void setBlurOnSubmit(TextInputFocusWrapper view, boolean value) {
    view.setBlurOnSubmit(value);
  }

  @Override
  @ReactProp(name = "multiline")
  public void setMultiline(TextInputFocusWrapper view, boolean value) {
    view.setMultiline(value);
  }

  @Override
  public void setGroupIdentifier(TextInputFocusWrapper view, @Nullable String value) {
    //stub
  }

  @Override
  @ReactProp(name = "orderGroup")
  public void setOrderGroup(TextInputFocusWrapper view, @Nullable String value) {
    if (!Objects.equals(view.getOrderGroup(), value)) {
      view.setOrderGroup(value);
    }
  }

  @Override
  @ReactProp(name = "orderIndex")
  public void setOrderIndex(TextInputFocusWrapper view, int value) {
    if (!Objects.equals(view.getOrderIndex(), value)) {
      view.setOrderIndex(value);
    }
  }

  @Override
  @ReactProp(name = "orderId")
  public void setOrderId(TextInputFocusWrapper view, @Nullable String value) {
    if (!Objects.equals(view.orderId, value)) {
      view.orderId = value;
    }
  }

  @Override
  @ReactProp(name = "orderLeft")
  public void setOrderLeft(TextInputFocusWrapper view, @Nullable String value) {
    if (!Objects.equals(view.getOrderLeft(), value)) {
      view.setOrderLeft(value);
    }
  }

  @Override
  @ReactProp(name = "orderRight")
  public void setOrderRight(TextInputFocusWrapper view, @Nullable String value) {
    if (!Objects.equals(view.getOrderRight(), value)) {
      view.setOrderRight(value);
    }
  }

  @Override
  @ReactProp(name = "orderUp")
  public void setOrderUp(TextInputFocusWrapper view, @Nullable String value) {
    if (!Objects.equals(view.getOrderUp(), value)) {
      view.setOrderUp(value);
    }
  }

  @Override
  @ReactProp(name = "orderDown")
  public void setOrderDown(TextInputFocusWrapper view, @Nullable String value) {
    if (!Objects.equals(view.getOrderDown(), value)) {
      view.setOrderDown(value);
    }
  }

  @Override
  @ReactProp(name = "orderForward")
  public void setOrderForward(TextInputFocusWrapper view, @Nullable String value) {
    if (!Objects.equals(view.orderForward, value)) {
      view.orderForward = value;
    }
  }

  @Override
  @ReactProp(name = "orderBackward")
  public void setOrderBackward(TextInputFocusWrapper view, @Nullable String value) {
    if (!Objects.equals(view.orderBackward, value)) {
      view.orderBackward = value;
    }
  }

  @Override
  @ReactProp(name = "lockFocus")
  public void setLockFocus(TextInputFocusWrapper view, int value) {
    if (view.lockFocus != value) {
      view.lockFocus = value;
    }
  }

  @Override
  public void setOrderFirst(TextInputFocusWrapper view, @Nullable String value) {
    //stub
  }

  @Override
  public void setOrderLast(TextInputFocusWrapper view, @Nullable String value) {
    //stub
  }


  @Override
  @ReactProp(name = "canBeFocused", defaultBoolean = true)
  public void setCanBeFocused(TextInputFocusWrapper view, boolean value) {
    view.setKeyboardFocusable(value);
  }

  @Override
  public void setHaloEffect(TextInputFocusWrapper view, boolean value) {
    //stub
  }

  @Override
  public void setTintColor(TextInputFocusWrapper view, @Nullable Integer value) {
    //stub
  }

  @Override
  public void onDropViewInstance(@NonNull TextInputFocusWrapper viewGroup) {
    viewGroup.onDropViewInstance();
    viewGroup.setEditText(null);
    viewGroup.setOnFocusChangeListener(null);
    super.onDropViewInstance(viewGroup);
  }

  private Map<String, Object> createEventMap(String registrationName) {
    Map<String, Object> eventMap = new HashMap<>();
    eventMap.put("registrationName", registrationName);
    return eventMap;
  }

  @Nullable
  @Override
  public Map<String, Object> getExportedCustomDirectEventTypeConstants() {
    Map<String, Object> export = new HashMap<>();

    export.put(FocusChangeEvent.EVENT_NAME, createEventMap("onFocusChange"));
    export.put(MultiplyTextSubmit.EVENT_NAME, createEventMap("onMultiplyTextSubmit"));

    return export;
  }

  @Override
  @ReactProp(name = "haloExpendY")
  public void setHaloExpendY(TextInputFocusWrapper view, float value) {

  }

  @Override
  @ReactProp(name = "haloExpendX")
  public void setHaloExpendX(TextInputFocusWrapper view, float value) {

  }

  @Override
  @ReactProp(name = "haloCornerRadius")
  public void setHaloCornerRadius(TextInputFocusWrapper view, float value) {

  }
}
