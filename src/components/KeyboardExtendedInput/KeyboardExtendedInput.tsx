import React, { useEffect, useMemo } from 'react';
import { View, TextInput, Platform, StyleSheet } from 'react-native';

import { TextInputFocusWrapperNative } from '../../nativeSpec';
import { useFocusStyle } from '../../utils/useFocusStyle';
import { focusEventMapper } from '../../utils/focusEventMapper';
import { RenderPropComponent } from '../RenderPropComponent/RenderPropComponent';
import { useGroupIdentifierContext } from '../../context/GroupIdentifierContext';
import { useOrderFocusGroup } from '../../context/OrderFocusContext';
import type { KeyboardInputProps } from './KeyboardExtendedInput.types';
import { blurMap, focusMap } from './KeyboardExtendedInput.consts';
import { wrapOrderPrefix } from '../../utils/wrapOrderPrefix';
import {
  LockFocusEnum,
  type LockFocusType,
} from '../../types/BaseKeyboardView';

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

const mapLockFocus = (values: LockFocusType[] | undefined): number => {
  if (!values || !values.length) return 0;
  // eslint-disable-next-line no-bitwise
  return values.reduce((acc, item) => acc | focusBinaryValue[item], 0);
};

const isIOS = Platform.OS === 'ios';

export const KeyboardExtendedInput = React.forwardRef<
  TextInput,
  KeyboardInputProps
>(
  (
    {
      focusType = 'press',
      blurType = 'default',
      containerStyle,
      onFocusChange,
      focusStyle,
      style,
      haloEffect = true,
      canBeFocusable = true,
      focusable = true,
      containerFocusStyle,
      tintColor,
      tintType = 'default',
      FocusHoverComponent,
      onSubmitEditing,
      submitBehavior,
      groupIdentifier,
      lockFocus,
      orderGroup,
      orderIndex,
      orderId,
      orderForward,
      orderBackward,
      orderLeft,
      orderRight,
      orderUp,
      orderDown,
      rejectResponderTermination,
      selectionHandleColor,
      cursorColor,
      maxFontSizeMultiplier,
      orderFirst,
      orderLast,
      orderPrefix: _orderPrefix,
      ...props
    },
    ref
  ) => {
    const {
      focused,
      containerFocusedStyle,
      componentFocusedStyle,
      onFocusChangeHandler,
      hoverColor,
    } = useFocusStyle({
      onFocusChange,
      tintColor,
      focusStyle,
      containerFocusStyle,
      tintType,
    });

    const contextIdentifier = useGroupIdentifierContext();
    const contextGroupId = useOrderFocusGroup();
    const groupId = orderGroup ?? contextGroupId;

    const orderPrefix = _orderPrefix ?? contextGroupId ?? '';

    const withHaloEffect = tintType === 'default' && haloEffect;

    const nativeFocusHandler = useMemo(
      () => focusEventMapper(onFocusChangeHandler),
      [onFocusChangeHandler]
    );

    const HoverComonent = useMemo(() => {
      if (FocusHoverComponent) return FocusHoverComponent;
      if (tintType === 'hover')
        return <View style={[hoverColor, styles.absolute, styles.opacity]} />;

      return undefined;
    }, [FocusHoverComponent, hoverColor, tintType]);

    const blurOnSubmit = submitBehavior
      ? submitBehavior === 'blurAndSubmit'
      : props.blurOnSubmit ?? true;

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

    const wrapPrefix = useMemo(
      () => wrapOrderPrefix(orderPrefix),
      [orderPrefix]
    );

    const wrappedOrderProps = useMemo(
      () => ({
        orderId: wrapPrefix(orderId),
        orderForward: wrapPrefix(orderForward),
        orderBackward: wrapPrefix(orderBackward),
        orderLeft: wrapPrefix(orderLeft),
        orderRight: wrapPrefix(orderRight),
        orderUp: wrapPrefix(orderUp),
        orderDown: wrapPrefix(orderDown),
        orderFirst: wrapPrefix(
          orderFirst === null ? undefined : orderFirst ?? orderForward
        ),
        orderLast: wrapPrefix(
          orderLast === null ? undefined : orderLast ?? orderBackward
        ),
      }),
      [
        wrapPrefix,
        orderId,
        orderForward,
        orderBackward,
        orderLeft,
        orderRight,
        orderUp,
        orderDown,
        orderFirst,
        orderLast,
      ]
    );

    return (
      <TextInputFocusWrapperNative
        onFocusChange={nativeFocusHandler as unknown as undefined} //ToDo update type
        focusType={focusMap[focusType]}
        blurType={blurMap[blurType]}
        style={[containerStyle, containerFocusedStyle]}
        haloEffect={withHaloEffect}
        multiline={props.multiline}
        blurOnSubmit={blurOnSubmit}
        onMultiplyTextSubmit={onSubmitEditing}
        canBeFocused={canBeFocusable && focusable}
        tintColor={isIOS ? tintColor : undefined}
        groupIdentifier={groupIdentifier ?? contextIdentifier}
        lockFocus={mapLockFocus(lockFocus)}
        orderGroup={groupId}
        orderIndex={orderIndex ?? -1}
        {...wrappedOrderProps}
      >
        <TextInput
          ref={ref as React.RefObject<any>}
          editable={canBeFocusable && focusable}
          style={[style, componentFocusedStyle]}
          onSubmitEditing={onSubmitEditing}
          submitBehavior={submitBehavior}
          rejectResponderTermination={rejectResponderTermination ?? undefined}
          selectionHandleColor={selectionHandleColor ?? undefined}
          cursorColor={cursorColor ?? undefined}
          maxFontSizeMultiplier={maxFontSizeMultiplier ?? undefined}
          {...props}
        />
        {focused && HoverComonent && (
          <RenderPropComponent render={HoverComonent} />
        )}
      </TextInputFocusWrapperNative>
    );
  }
);

const styles = StyleSheet.create({
  absolute: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
  },
  opacity: {
    opacity: 0.3,
  },
});
