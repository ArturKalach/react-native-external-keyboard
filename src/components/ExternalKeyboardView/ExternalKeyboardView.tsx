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
    (props, ref) => {
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
          autoFocus={props.autoFocus ? rootId : undefined}
          hasKeyDownPress={Boolean(props.onKeyDownPress)}
          hasKeyUpPress={Boolean(props.onKeyUpPress)}
          // canBeFocused={props.canBeFocused ?? true} //ToDo add rule for configuration
        />
      );
    }
  )
);
