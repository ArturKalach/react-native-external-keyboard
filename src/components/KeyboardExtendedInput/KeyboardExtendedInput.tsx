import React from 'react';
import { TextInput, TextInputProps, StyleProp, ViewStyle } from 'react-native';

import { TextInputFocusWrapperNative } from '../../nativeSpec';
import type { OnFocusChangeFn } from '../../types/KeyboardFocusView.types';
import type { FocusStyle } from '../../types/FocusStyle';
import { useFocusStyle } from '../KeyboardFocusView/hooks';

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
  onFocusChange?: OnFocusChangeFn;
  focusStyle?: FocusStyle;
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
      ...props
    },
    ref
  ) => {
    const { fStyle, onFocusChangeHandler } = useFocusStyle(
      focusStyle,
      onFocusChange
    );

    return (
      <TextInputFocusWrapperNative
        onFocusChange={onFocusChangeHandler}
        focusType={focusMap[focusType]}
        blurType={blurMap[blurType]}
        style={containerStyle}
      >
        <TextInput ref={ref} style={[style, fStyle]} {...props} />
      </TextInputFocusWrapperNative>
    );
  }
);
