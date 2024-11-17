import React, { useCallback, useMemo } from 'react';
import {
  View,
  TextInput,
  TextInputProps,
  StyleProp,
  ViewStyle,
  StyleSheet,
  type NativeSyntheticEvent,
  type TextInputSubmitEditingEventData,
} from 'react-native';

import { TextInputFocusWrapperNative } from '../../nativeSpec';
import type { FocusStyle } from '../../types/FocusStyle';
import { useFocusStyle } from '../../utils/useFocusStyle';
import { focusEventMapper } from '../../utils/focusEventMapper';
import type { TintType } from '../../types/WithKeyboardFocus';
import {
  RenderProp,
  RenderPropComponent,
} from '../RenderPropComponent/RenderPropComponent';

const focusMap = {
  default: 0,
  press: 1,
  auto: 2,
};

const blurMap = {
  default: 0,
  disable: 1,
  auto: 2,
};

export type KeyboardFocusViewProps = TextInputProps & {
  focusType?: keyof typeof focusMap;
  blurType?: keyof typeof blurMap;
  containerStyle?: StyleProp<ViewStyle>;
  onFocusChange?: (isFocused: boolean) => void;
  focusStyle?: FocusStyle;
  haloEffect?: boolean;
  canBeFocusable?: boolean;
  focusable?: boolean;
  tintColor?: string;
  tintType?: TintType;
  containerFocusStyle?: FocusStyle;
  FocusHoverComponent?: RenderProp;
  submitBehavior?: string;
  onSubmitEditing?: (
    e?: NativeSyntheticEvent<TextInputSubmitEditingEventData>
  ) => void;
};

export const KeyboardExtendedInput = React.forwardRef<
  TextInput,
  KeyboardFocusViewProps
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

    const onMultiplyTextSubmit = useCallback(
      () => onSubmitEditing?.(),
      [onSubmitEditing]
    );

    const blurOnSubmit = submitBehavior
      ? submitBehavior === 'blurAndSubmit'
      : props.blurOnSubmit ?? true;

    return (
      <TextInputFocusWrapperNative
        onFocusChange={nativeFocusHandler}
        focusType={focusMap[focusType]}
        blurType={blurMap[blurType]}
        style={[containerStyle, containerFocusedStyle]}
        haloEffect={withHaloEffect}
        multiline={props.multiline}
        blurOnSubmit={blurOnSubmit}
        onMultiplyTextSubmit={onMultiplyTextSubmit}
        canBeFocused={canBeFocusable && focusable}
        tintColor={tintColor}
      >
        <TextInput
          ref={ref}
          editable={canBeFocusable && focusable}
          style={[style, componentFocusedStyle]}
          onSubmitEditing={onSubmitEditing}
          submitBehavior={submitBehavior}
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
