import React, { useMemo } from 'react';
import { TextInput, TextInputProps, StyleProp, ViewStyle } from 'react-native';

import { TextInputFocusWrapperNative } from '../../nativeSpec';
import type { FocusStyle } from '../../types/FocusStyle';
import { useFocusStyle } from '../KeyboardFocusView/hooks';
import { focusEventMapper } from '../../utils/focusEventMapper';

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
      ...props
    },
    ref
  ) => {
    const { fStyle, onFocusChangeHandler } = useFocusStyle(
      focusStyle,
      onFocusChange
    );

    const nativeFocusHandler = useMemo(
      () => focusEventMapper(onFocusChangeHandler),
      [onFocusChangeHandler]
    );

    return (
      <TextInputFocusWrapperNative
        onFocusChange={nativeFocusHandler}
        focusType={focusMap[focusType]}
        blurType={blurMap[blurType]}
        style={containerStyle}
        haloEffect={haloEffect}
        ref={ref}
        canBeFocused={canBeFocusable && focusable}
      >
        {/* ToDo RNCEKV-4 somewhy blurOnSubmit={false} has been set here, it would be better to verify and research for issues  */}
        <TextInput
          editable={canBeFocusable && focusable}
          style={[style, fStyle]}
          {...props}
        />
      </TextInputFocusWrapperNative>
    );
  }
);
