import React, { useMemo } from 'react';
import { View, TextInput, Platform, StyleSheet } from 'react-native';

import { TextInputFocusWrapperNative } from '../../nativeSpec';
import { useFocusStyle } from '../../utils/useFocusStyle';
import { focusEventMapper } from '../../utils/focusEventMapper';
import { RenderPropComponent } from '../RenderPropComponent/RenderPropComponent';
import { useGroupIdentifierContext } from '../../context/GroupIdentifierContext';
import type { KeyboardInputProps } from './KeyboardExtendedInput.types';
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
      canBeFocusable = true,
      focusable = true,
      containerFocusStyle,
      tintColor,
      tintType = 'default',
      FocusHoverComponent,
      onSubmitEditing,
      submitBehavior,
      groupIdentifier,
      rejectResponderTermination,
      selectionHandleColor,
      cursorColor,
      maxFontSizeMultiplier,
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
