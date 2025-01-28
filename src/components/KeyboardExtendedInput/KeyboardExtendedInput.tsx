import React, { useMemo } from 'react';
import {
  View,
  TextInput,
  Platform,
  type TextInputProps,
  type StyleProp,
  type ViewStyle,
  StyleSheet,
  type ColorValue,
} from 'react-native';

import { TextInputFocusWrapperNative } from '../../nativeSpec';
import type { FocusStyle } from '../../types/FocusStyle';
import { useFocusStyle } from '../../utils/useFocusStyle';
import { focusEventMapper } from '../../utils/focusEventMapper';
import type { TintType } from '../../types/WithKeyboardFocus';
import {
  type RenderProp,
  RenderPropComponent,
} from '../RenderPropComponent/RenderPropComponent';
import { useGroupIdentifierContext } from '../../context/GroupIdentifierContext';

const isIOS = Platform.OS === 'ios';

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
  tintColor?: ColorValue;
  tintType?: TintType;
  containerFocusStyle?: FocusStyle;
  FocusHoverComponent?: RenderProp;
  submitBehavior?: string;
  groupIdentifier?: string;
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
      groupIdentifier,
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
      : (props.blurOnSubmit ?? true);

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
