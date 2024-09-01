import React, { useContext, useImperativeHandle, useRef } from 'react';
import { ExternalKeyboardViewNative } from '../../nativeSpec';
import { Commands } from '../../nativeSpec/ExternalKeyboardViewNativeComponent';
import { KeyboardRootViewContext } from '../../context/KeyboardRootViewContext';
import type {
  ExternalKeyboardViewProps,
  ExternalKeyboardViewType,
} from '../../types/ExternalKeyboardView';

export const ExternalKeyboardView = React.memo(
  React.forwardRef<ExternalKeyboardViewType, ExternalKeyboardViewProps>(
    (
      {
        onKeyUpPress,
        onFocusChange,
        onKeyDownPress,
        haloEffect,
        autoFocus,
        canBeFocused = true,
        focusable = true,
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

      return (
        <ExternalKeyboardViewNative
          {...props}
          haloEffect={haloEffect ?? true}
          ref={keyboardedRef}
          canBeFocused={focusable && canBeFocused}
          autoFocus={autoFocus ? rootId : undefined}
          hasKeyDownPress={Boolean(onKeyDownPress)}
          hasKeyUpPress={Boolean(onKeyUpPress)}
          hasOnFocusChanged={Boolean(onFocusChange)}
        />
      );
    }
  )
);
