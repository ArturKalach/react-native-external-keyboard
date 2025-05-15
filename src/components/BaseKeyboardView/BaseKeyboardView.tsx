import React, { type ComponentType, useImperativeHandle, useRef } from 'react';
import { Platform } from 'react-native';
import { ExternalKeyboardViewNative } from '../../nativeSpec';
import { Commands } from '../../nativeSpec/ExternalKeyboardViewNativeComponent';
import type {
  BaseKeyboardViewProps,
  BaseKeyboardViewType,
} from '../../types/BaseKeyboardView';
import type { View } from 'react-native';
import { KeyPressContext } from '../../context/BubbledKeyPressContext';
import { useBubbledInfo } from './BaseKeyboardView.hooks';
import { useGroupIdentifierContext } from '../../context/GroupIdentifierContext';
import { useOnFocusChange } from '../../utils/useOnFocusChange';

type NativeRef = React.ElementRef<ComponentType>;
const isIOS = Platform.OS === 'ios';

const DEFAULT_EXPOSE_METHODS = [
  'blur',
  'measure',
  'measureInWindow',
  'measureLayout',
  'setNativeProps',
];

export const BaseKeyboardView = React.memo(
  React.forwardRef<BaseKeyboardViewType, BaseKeyboardViewProps>(
    (
      {
        onFocusChange,
        onKeyUpPress,
        onKeyDownPress,
        onBubbledContextMenuPress,
        haloEffect,
        autoFocus,
        canBeFocused = true,
        focusable = true,
        group = false,
        onFocus,
        onBlur,
        viewRef,
        groupIdentifier,
        tintColor,
        ignoreGroupFocusHint,
        exposeMethods = DEFAULT_EXPOSE_METHODS,
        enableA11yFocus = false,
        screenAutoA11yFocusDelay = 500,
        ...props
      },
      ref
    ) => {
      const localRef = useRef<View>();
      const targetRef = viewRef ?? localRef;

      const contextIdentifier = useGroupIdentifierContext();

      useImperativeHandle(ref, () => {
        const actions: Record<string, Function> = {};

        exposeMethods.forEach((method) => {
          actions[method] = (...args: any[]) => {
            const componentActions = targetRef?.current as unknown as Record<
              string,
              Function
            >;
            return componentActions?.[method]?.(...args);
          };
        });

        actions.focus = () => {
          if (targetRef?.current) {
            Commands.focus(targetRef.current as NativeRef);
          }
        };

        return actions as unknown as BaseKeyboardViewType;
      }, [exposeMethods, targetRef]);

      const bubbled = useBubbledInfo(onBubbledContextMenuPress);

      const onFocusChangeHandler = useOnFocusChange({
        onFocusChange,
        onFocus,
        onBlur,
      });

      const hasOnFocusChanged = onFocusChange || onFocus || onBlur;
      const ignoreFocusHint = Platform.OS !== 'ios' || !ignoreGroupFocusHint;

      return (
        <KeyPressContext.Provider value={bubbled.context}>
          <ExternalKeyboardViewNative
            {...props}
            haloEffect={haloEffect ?? true}
            ref={targetRef as NativeRef}
            canBeFocused={ignoreFocusHint && focusable && canBeFocused}
            autoFocus={autoFocus}
            onKeyDownPress={onKeyDownPress as undefined} //ToDo update types
            onKeyUpPress={onKeyUpPress as undefined} //ToDo update types
            onBubbledContextMenuPress={bubbled.contextMenu}
            groupIdentifier={groupIdentifier ?? contextIdentifier}
            tintColor={isIOS ? tintColor : undefined}
            onFocusChange={
              (hasOnFocusChanged && onFocusChangeHandler) as undefined
            } //ToDo update types
            hasKeyDownPress={Boolean(onKeyDownPress)}
            hasKeyUpPress={Boolean(onKeyUpPress)}
            hasOnFocusChanged={Boolean(hasOnFocusChanged)}
            group={group}
            enableA11yFocus={enableA11yFocus}
            screenAutoA11yFocusDelay={screenAutoA11yFocusDelay}
          />
        </KeyPressContext.Provider>
      );
    }
  )
);
