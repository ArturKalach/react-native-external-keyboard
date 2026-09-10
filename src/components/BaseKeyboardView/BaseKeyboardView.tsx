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
  type LockFocusType,
  type BaseKeyboardViewProps,
  type BaseKeyboardViewType,
} from '../../types';
import type { View } from 'react-native';
import { KeyPressContext } from '../../context/BubbledKeyPressContext';
import { useBubbledInfo } from './BaseKeyboardView.hooks';
import { useGroupIdentifierContext } from '../../context/GroupIdentifierContext';
import { useOnFocusChange } from '../../utils/useOnFocusChange';
import { useOrderFocusGroup } from '../../context/OrderFocusContext';
import { useWrappedOrderProps } from '../../utils/useWrappedOrderProps';

// @ts-ignore
type NativeRef = React.ElementRef<ComponentType>;
const isIOS = Platform.OS === 'ios';

enum BITS {
  BIT_01 = 0b1,
  BIT_02 = 0b10,
  BIT_03 = 0b100,
  BIT_04 = 0b1000,
  BIT_05 = 0b10000,
  BIT_06 = 0b100000,
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
  React.forwardRef<BaseKeyboardViewType | View, BaseKeyboardViewProps>(
    (
      {
        onFocusChange,
        onKeyUpPress,
        onKeyDownPress,
        onBubbledContextMenuPress,
        haloEffect,
        autoFocus,
        focusable = true,
        focusableWrapper = false,
        onFocus,
        onBlur,
        groupIdentifier,
        tintColor,
        // TODO: revisit screenAutoA11yFocusDelay default (currently 300ms)
        screenAutoA11yFocusDelay = 300,
        lockFocus,
        orderIndex,
        orderForward,
        orderBackward,
        orderFirst,
        orderLast,
        orderGroup,
        orderLeft,
        orderRight,
        orderUp,
        orderDown,
        orderId,
        enableContextMenu,
        orderPrefix: _orderPrefix,
        tintType,
        // Deprecated no-ops: destructured out so they never reach the native view.
        enableA11yFocus: _enableA11yFocus,
        defaultFocusHighlightEnabled = true,
        roundedHaloFix = false,
        ...props
      },
      ref
    ) => {
      const targetRef = useRef<View | null>(null);
      const lockFocusValue = useMemo(
        () => mapFocusValues(lockFocus),
        [lockFocus]
      );

      const contextIdentifier = useGroupIdentifierContext();
      const contextGroupId = useOrderFocusGroup();
      const groupId = orderGroup ?? contextGroupId;

      const orderPrefix = _orderPrefix ?? contextGroupId ?? '';

      useEffect(() => {
        if (!__DEV__) return;
        if (orderIndex !== undefined && !groupId)
          console.warn(
            '`orderIndex` must be declared alongside `orderGroup` for proper functionality. Ensure components are wrapped with `KeyboardOrderFocusGroup` or provide `orderGroup` directly.'
          );
      }, [groupId, orderIndex]);

      useEffect(() => {
        if (!__DEV__) return;
        const hasOrderLinkProp =
          orderId !== undefined ||
          orderForward !== undefined ||
          orderBackward !== undefined ||
          orderFirst !== undefined ||
          orderLast !== undefined ||
          orderLeft !== undefined ||
          orderRight !== undefined ||
          orderUp !== undefined ||
          orderDown !== undefined;
        if (hasOrderLinkProp && orderPrefix === '') {
          console.warn(
            '[react-native-external-keyboard] orderId, orderForward, orderBackward, orderFirst, orderLast, ' +
              'orderLeft, orderRight, orderUp, and orderDown are global IDs. ' +
              'Wrap the component in <KeyboardOrderFocusGroup> or pass orderPrefix to avoid ID collisions across screens.'
          );
        }
      }, [
        orderId,
        orderForward,
        orderBackward,
        orderFirst,
        orderLast,
        orderLeft,
        orderRight,
        orderUp,
        orderDown,
        orderPrefix,
      ]);

      useImperativeHandle(ref, () => {
        const nativeCommands: Record<string, () => void> = {
          keyboardFocus: () => {
            if (targetRef?.current) {
              Commands.rnekKeyboardFocus(
                targetRef.current as unknown as NativeRef
              );
            }
          },
          screenReaderFocus: () => {
            if (targetRef?.current) {
              Commands.rnekScreenReaderFocus(
                targetRef.current as unknown as NativeRef
              );
            }
          },
          focus: () => {
            if (targetRef?.current) {
              Commands.rnekKeyboardFocus(
                targetRef.current as unknown as NativeRef
              );
              Commands.rnekScreenReaderFocus(
                targetRef.current as unknown as NativeRef
              );
            }
          },
        };

        return new Proxy({} as BaseKeyboardViewType | View, {
          get(_target, prop: string) {
            if (prop in nativeCommands) {
              return nativeCommands[prop];
            }
            return (
              targetRef?.current as unknown as
                Record<string, unknown> | null | undefined
            )?.[prop];
          },
        });
      }, [targetRef]);

      const bubbled = useBubbledInfo(onBubbledContextMenuPress);

      const onFocusChangeHandler = useOnFocusChange({
        onFocusChange,
        onFocus,
        onBlur,
      });

      const hasFocusListener = onFocusChange || onFocus || onBlur;

      const wrappedOrderProps = useWrappedOrderProps({
        orderPrefix,
        orderId,
        orderForward,
        orderBackward,
        orderFirst,
        orderLast,
        orderLeft,
        orderRight,
        orderUp,
        orderDown,
      });

      const platformSpecificHalo =
        tintType !== 'none' &&
        (isIOS ? (haloEffect ?? true) : defaultFocusHighlightEnabled);

      return (
        <KeyPressContext.Provider value={bubbled.context}>
          <ExternalKeyboardViewNative
            {...props}
            haloEffect={platformSpecificHalo}
            ref={targetRef as React.RefObject<any>}
            enableContextMenu={enableContextMenu}
            canBeFocused={focusable}
            autoFocus={autoFocus}
            onKeyDownPress={onKeyDownPress}
            onKeyUpPress={onKeyUpPress}
            onBubbledContextMenuPress={bubbled.contextMenu}
            groupIdentifier={groupIdentifier ?? contextIdentifier}
            tintColor={isIOS ? tintColor : undefined}
            onFocusChange={hasFocusListener ? onFocusChangeHandler : undefined}
            hasKeyDownPress={Boolean(onKeyDownPress)}
            hasKeyUpPress={Boolean(onKeyUpPress)}
            hasOnFocusChanged={Boolean(hasFocusListener)}
            focusableWrapper={focusableWrapper}
            orderIndex={orderIndex ?? -1}
            screenAutoA11yFocusDelay={screenAutoA11yFocusDelay}
            lockFocus={lockFocusValue}
            {...wrappedOrderProps}
            orderGroup={groupId}
            roundedHaloFix={roundedHaloFix}
          />
        </KeyPressContext.Provider>
      );
    }
  )
);
