package com.externalkeyboard.views.TextInputFocusWrapper;

import android.view.View;
import android.view.ViewGroup;

import androidx.annotation.NonNull;
import androidx.annotation.Nullable;

import com.externalkeyboard.events.EventHelper;
import com.externalkeyboard.events.FocusChangeEvent;
import com.facebook.react.common.MapBuilder;
import com.facebook.react.module.annotations.ReactModule;
import com.facebook.react.uimanager.ThemedReactContext;
import com.facebook.react.uimanager.UIManagerHelper;
import com.facebook.react.uimanager.annotations.ReactProp;
import com.facebook.react.views.textinput.ReactEditText;

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
    viewGroup.setFocusable(true);
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

  @Nullable
  @Override
  public Map<String, Object> getExportedCustomDirectEventTypeConstants() {
    Map<String, Object> export = MapBuilder.<String, Object>builder().build();
    if (export == null) {
      export = MapBuilder.newHashMap();
    }

    export.put(FocusChangeEvent.EVENT_NAME, MapBuilder.of("registrationName", "onFocusChange"));

    return export;
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
  @ReactProp(name = "canBeFocused", defaultBoolean = true)
  public void setCanBeFocused(TextInputFocusWrapper view, boolean value) {
    view.setFocusable(value);
  }

  @Override
  public void setHaloEffect(TextInputFocusWrapper view, boolean value) {
    //stub
  }

  @Override
  public void onDropViewInstance(@NonNull TextInputFocusWrapper viewGroup) {
    viewGroup.setEditText(null);
    viewGroup.setOnFocusChangeListener(null);
    super.onDropViewInstance(viewGroup);
  }
}
