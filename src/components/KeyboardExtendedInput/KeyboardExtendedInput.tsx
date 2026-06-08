import React, { useMemo } from 'react';
import { TextInput, Platform } from 'react-native';

import { TextInputFocusWrapperNative } from '../../nativeSpec';
import { useFocusStyle } from '../../utils/useFocusStyle';
import { focusEventMapper } from '../../utils/focusEventMapper';
import { useGroupIdentifierContext } from '../../context/GroupIdentifierContext';
import { useOrderFocusGroup } from '../../context/OrderFocusContext';
import { mapLockFocus } from '../../utils/mapLockFocus';
import { useOrderValidation } from '../../utils/useOrderValidation';
import { useWrappedOrderProps } from '../../utils/useWrappedOrderProps';
import type { KeyboardInputProps } from '../../types';
import { blurMap, focusMap } from './KeyboardExtendedInput.consts';

const isIOS = Platform.OS === 'ios';

export const KeyboardExtendedInput = React.forwardRef<
  TextInput,
  KeyboardInputProps
>(
  (
    {
      focusType = 'default',
      blurType = 'default',
      containerStyle,
      onFocusChange,
      focusStyle,
      style,
      haloEffect = true,
      roundedHaloFix = false,
      focusable = true,
      containerFocusStyle,
      tintColor,
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
      orderFirst,
      orderLast,
      rejectResponderTermination,
      selectionHandleColor,
      cursorColor,
      maxFontSizeMultiplier,
      defaultFocusHighlightEnabled = true,
      tintType,
      orderPrefix: _orderPrefix,
      ...props
    },
    ref
  ) => {
    const {
      containerFocusedStyle,
      componentFocusedStyle,
      onFocusChangeHandler,
    } = useFocusStyle({
      onFocusChange,
      focusStyle,
      containerFocusStyle,
    });

    const contextIdentifier = useGroupIdentifierContext();
    const contextGroupId = useOrderFocusGroup();
    const groupId = orderGroup ?? contextGroupId;
    const orderPrefix = _orderPrefix ?? contextGroupId ?? '';

    useOrderValidation({
      groupId,
      orderPrefix,
      orderIndex,
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

    const hasFocusListener = Boolean(
      onFocusChange || focusStyle || containerFocusStyle
    );

    const nativeFocusHandler = useMemo(
      () => focusEventMapper(onFocusChangeHandler),
      [onFocusChangeHandler]
    );

    const blurOnSubmit = submitBehavior
      ? submitBehavior === 'blurAndSubmit'
      : props.blurOnSubmit ?? true;

    const withHaloEffect =
      tintType !== 'none' &&
      Platform.select({
        ios: haloEffect,
        android: defaultFocusHighlightEnabled,
      });

    const isContainerFocusable = !isIOS && focusable ? undefined : false;

    return (
      <TextInputFocusWrapperNative
        onFocusChange={hasFocusListener ? nativeFocusHandler : undefined}
        hasOnFocusChanged={hasFocusListener}
        focusType={focusMap[focusType]}
        blurType={blurMap[blurType]}
        style={[containerStyle, containerFocusedStyle]}
        haloEffect={withHaloEffect}
        roundedHaloFix={withHaloEffect === false && roundedHaloFix}
        multiline={props.multiline}
        blurOnSubmit={blurOnSubmit}
        onMultiplyTextSubmit={onSubmitEditing}
        canBeFocused={isContainerFocusable}
        tintColor={isIOS ? tintColor : undefined}
        groupIdentifier={groupIdentifier ?? contextIdentifier}
        lockFocus={mapLockFocus(lockFocus)}
        orderGroup={groupId}
        orderIndex={orderIndex ?? -1}
        {...wrappedOrderProps}
      >
        <TextInput
          ref={ref as React.RefObject<any>}
          editable={focusable}
          style={[style, componentFocusedStyle]}
          onSubmitEditing={onSubmitEditing}
          submitBehavior={submitBehavior}
          rejectResponderTermination={rejectResponderTermination ?? undefined}
          selectionHandleColor={selectionHandleColor ?? undefined}
          cursorColor={cursorColor ?? undefined}
          maxFontSizeMultiplier={maxFontSizeMultiplier ?? undefined}
          {...props}
        />
      </TextInputFocusWrapperNative>
    );
  }
);
