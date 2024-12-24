import React, {
  ComponentType,
  useCallback,
  useImperativeHandle,
  useRef,
} from 'react';
import { ExternalKeyboardViewNative } from '../../nativeSpec';
import { Commands } from '../../nativeSpec/ExternalKeyboardViewNativeComponent';
import type {
  BaseKeyboardViewProps,
  BaseKeyboardViewType,
} from '../../types/BaseKeyboardView';
import type { View } from 'react-native';

type NativeRef = React.ElementRef<ComponentType>;

export const BaseKeyboardView = React.memo(
  React.forwardRef<BaseKeyboardViewType, BaseKeyboardViewProps>(
    (
      {
        onFocusChange,
        onKeyUpPress,
        onKeyDownPress,
        haloEffect,
        autoFocus,
        canBeFocused = true,
        focusable = true,
        group = false,
        onFocus,
        onBlur,
        viewRef,
        ...props
      },
      ref
    ) => {
      const localRef = useRef<View>();
      const targetRef = viewRef ?? localRef;

      useImperativeHandle(ref, () => ({
        focus: () => {
          if (targetRef?.current) {
            Commands.focus(targetRef.current as NativeRef);
          }
        },
      }));

      const onFocusChangeHandler = useCallback(
        (e) => {
          onFocusChange?.(
            e.nativeEvent.isFocused,
            e?.nativeEvent?.target || undefined
          );
          if (e.nativeEvent.isFocused) {
            onFocus?.();
          } else {
            onBlur?.();
          }
        },
        [onBlur, onFocus, onFocusChange]
      );

      const hasOnFocusChanged = onFocusChange || onFocus || onBlur;

      return (
        <ExternalKeyboardViewNative
          {...props}
          haloEffect={haloEffect ?? true}
          ref={targetRef as NativeRef}
          canBeFocused={focusable && canBeFocused}
          autoFocus={autoFocus}
          onKeyDownPress={onKeyDownPress}
          onKeyUpPress={onKeyUpPress}
          onFocusChange={hasOnFocusChanged && onFocusChangeHandler}
          hasKeyDownPress={Boolean(onKeyDownPress)}
          hasKeyUpPress={Boolean(onKeyUpPress)}
          hasOnFocusChanged={Boolean(hasOnFocusChanged)}
          group={group}
        />
      );
    }
  )
);
