import React, { useContext, useImperativeHandle, useRef } from 'react';
import type { View } from 'react-native';
import { ExternalKeyboardViewNative } from '../../nativeSpec';
import {
  Commands,
  type ExternalKeyboardNativeProps,
} from '../../nativeSpec/ExternalKeyboardViewNativeComponent';
import { KeyboardRootViewContext } from '../../context/KeyboardRootViewContext';

type RefType = Partial<View> & { focus: () => void };

export const ExternalKeyboardView = React.memo(
  React.forwardRef<
    RefType,
    Omit<ExternalKeyboardNativeProps, 'autoFocus'> & { withAutoFocus?: boolean }
  >((props, ref) => {
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
        ref={keyboardedRef}
        autoFocus={props.withAutoFocus ? rootId : undefined}
        hasKeyDownPress={Boolean(props.onKeyDownPress)}
        hasKeyUpPress={Boolean(props.onKeyUpPress)}
      />
    );
  })
);
