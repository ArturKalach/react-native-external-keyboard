import React, {
  useCallback,
  useContext,
  useImperativeHandle,
  useRef,
} from 'react';
import { ExternalKeyboardViewNative } from '../../nativeSpec';
import { Commands } from '../../nativeSpec/ExternalKeyboardViewNativeComponent';
import { KeyboardRootViewContext } from '../../context/KeyboardRootViewContext';
import type {
  BaseKeyboardViewProps,
  BaseKeyboardViewType,
} from '../../types/BaseKeyboardView';

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
        ...props
      },
      ref
    ) => {
      const rootId = useContext(KeyboardRootViewContext);
      const keyboardedRef = useRef(null);

      useImperativeHandle(ref, () => ({
        focus: () => {
          if (keyboardedRef.current && rootId) {
            Commands.focus(keyboardedRef.current, rootId);
          }
        },
        ...(keyboardedRef.current ?? {}),
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
          ref={keyboardedRef}
          canBeFocused={focusable && canBeFocused}
          autoFocus={autoFocus ? rootId : undefined}
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