import React, {
  type ComponentType,
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
import { KeyPressContext } from '../../context/BubbledKeyPressContext';
import { useBubbledInfo } from './BaseKeyboardView.hooks';
import { useGroupIdentifierContext } from '../../context/GroupIdentifierContext';

type NativeRef = React.ElementRef<ComponentType>;

export const BaseKeyboardView = React.memo(
  React.forwardRef<BaseKeyboardViewType, BaseKeyboardViewProps>(
    (
      {
        onFocusChange,
        onKeyUpPress,
        onKeyDownPress,
        onBubbledKeyDownPress,
        onBubbledKeyUpPress,
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
      }));

      const bubbled = useBubbledInfo({
        onBubbledKeyDownPress,
        onBubbledKeyUpPress,
        onBubbledContextMenuPress,
      });

      const onFocusChangeHandler = useCallback(
        //ToDo update types
        (e: { nativeEvent: { isFocused: boolean; target: number } }) => {
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
        <KeyPressContext.Provider value={bubbled.context}>
          <ExternalKeyboardViewNative
            {...props}
            haloEffect={haloEffect ?? true}
            ref={targetRef as NativeRef}
            canBeFocused={focusable && canBeFocused}
            autoFocus={autoFocus}
            onKeyDownPress={onKeyDownPress as undefined} //ToDo update types
            onKeyUpPress={onKeyUpPress as undefined} //ToDo update types
            onBubbledKeyDownPress={bubbled.keyDown}
            onBubbledKeyUpPress={bubbled.keyUp}
            onBubbledContextMenuPress={bubbled.contextMenu}
            groupIdentifier={groupIdentifier ?? contextIdentifier}
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
