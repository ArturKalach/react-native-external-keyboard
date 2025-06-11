import React, {
  type ComponentType,
  useImperativeHandle,
  useMemo,
  useRef,
} from 'react';
import { Platform } from 'react-native';
import { ExternalKeyboardViewNative } from '../../nativeSpec';
import { Commands } from '../../nativeSpec/ExternalKeyboardViewNativeComponent';
import {
  LockFocusEnum,
  type BaseKeyboardViewProps,
  type BaseKeyboardViewType,
  type LockFocusType,
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

enum BITS {
  BIT_1 = 0b1,
  BIT_2 = 0b10,
  BIT_3 = 0b100,
  BIT_4 = 0b1000,
  BIT_5 = 0b10000,
  BIT_6 = 0b100000,
  BIT_7 = 0b1000000,
  BIT_8 = 0b10000000,
  BIT_9 = 0b100000000,
}

const focusBinaryValue: Record<LockFocusEnum, number> = {
  [LockFocusEnum.Up]: BITS.BIT_1,
  [LockFocusEnum.Down]: BITS.BIT_2,
  [LockFocusEnum.Left]: BITS.BIT_3,
  [LockFocusEnum.Right]: BITS.BIT_4,
  [LockFocusEnum.Forward]: BITS.BIT_5,
  [LockFocusEnum.Backward]: BITS.BIT_6,
  [LockFocusEnum.First]: BITS.BIT_8,
  [LockFocusEnum.Last]: BITS.BIT_9,
};

const mapFocusValues = (values: LockFocusType[] | undefined) => {
  if (!values || !values.length) return 0;

  // eslint-disable-next-line no-bitwise
  return values.reduce((acc, item) => acc | focusBinaryValue[item], 0);
};

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
        lockFocus,
        ...props
      },
      ref
    ) => {
      const localRef = useRef<View>();
      const targetRef = viewRef ?? localRef;
      const lockFocusValue = useMemo(
        () => mapFocusValues(lockFocus),
        [lockFocus]
      );

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
            lockFocus={lockFocusValue}
          />
        </KeyPressContext.Provider>
      );
    }
  )
);
