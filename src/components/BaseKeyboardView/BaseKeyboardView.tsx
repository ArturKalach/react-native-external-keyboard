import React, {
  type ComponentType,
  useEffect,
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
import { useOrderFocusGroup } from '../../context/OrderFocusContext';

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
  BIT_01 = 0b1,
  BIT_02 = 0b10,
  BIT_03 = 0b100,
  BIT_04 = 0b1000,
  BIT_05 = 0b10000,
  BIT_06 = 0b100000,
  BIT_07 = 0b1000000,
  BIT_08 = 0b10000000,
  BIT_09 = 0b100000000,
  BIT_10 = 0b1000000000,
}

const focusBinaryValue: Record<LockFocusEnum, number> = {
  [LockFocusEnum.Up]: BITS.BIT_01,
  [LockFocusEnum.Down]: BITS.BIT_02,
  [LockFocusEnum.Left]: BITS.BIT_03,
  [LockFocusEnum.Right]: BITS.BIT_04,
  [LockFocusEnum.Forward]: BITS.BIT_05,
  [LockFocusEnum.Backward]: BITS.BIT_06,
  [LockFocusEnum.First]: BITS.BIT_09,
  [LockFocusEnum.Last]: BITS.BIT_10,
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
        orderIndex,
        orderForward,
        orderBackward,
        orderFirst,
        orderLast,
        orderGroup,
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

      const contextGroupId = useOrderFocusGroup();
      const groupId = orderGroup ?? contextGroupId;

      useEffect(() => {
        if (orderIndex !== undefined && !groupId)
          console.warn(
            '`orderIndex` must be declared alongside `orderGroup` for proper functionality. Ensure components are wrapped with `KeyboardOrderFocusGroup` or provide `orderGroup` directly.'
          );
      }, [groupId, orderIndex]);

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

      const _orderFirst =
        orderFirst === null ? undefined : (orderFirst ?? orderForward);
      const _orderLast =
        orderLast === null ? undefined : (orderLast ?? orderBackward);

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
            orderIndex={orderIndex ?? -1}
            enableA11yFocus={enableA11yFocus}
            screenAutoA11yFocusDelay={screenAutoA11yFocusDelay}
            lockFocus={lockFocusValue}
            orderForward={orderForward}
            orderBackward={orderBackward}
            orderFirst={_orderFirst}
            orderLast={_orderLast}
            orderGroup={groupId}
          />
        </KeyPressContext.Provider>
      );
    }
  )
);
