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
        ...props
      },
      ref
    ) => {
      const localRef = useRef<View>();
      const targetRef = viewRef ?? localRef;

      const contextIdentifier = useGroupIdentifierContext();

      useImperativeHandle(ref, () => ({
        focus: () => {
          if (targetRef?.current) {
            Commands.focus(targetRef.current as NativeRef);
          }
        },
        blur: () => {
          targetRef.current?.blur();
        },
        measure: (...args: Parameters<View['measure']>) => {
          targetRef.current?.measure(...args);
        },
        measureInWindow: (...args: Parameters<View['measureInWindow']>) => {
          targetRef.current?.measureInWindow(...args);
        },
        measureLayout: (...args: Parameters<View['measureLayout']>) => {
          targetRef.current?.measureLayout(...args);
        },
        setNativeProps: (...args: Parameters<View['setNativeProps']>) => {
          targetRef.current?.setNativeProps(...args);
        },
      }));

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
          />
        </KeyPressContext.Provider>
      );
    }
  )
);
