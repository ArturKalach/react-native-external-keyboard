import React from 'react';
import { TextInput, TextInputProps, StyleProp, ViewStyle } from 'react-native';

import { TextInputFocusWrapperNative } from '../../nativeSpec';
import type { OnFocusChangeFn } from '../../types/KeyboardFocusView.types';

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
      ...props
    },
    ref
  ) => (
    <TextInputFocusWrapperNative
      onFocusChange={onFocusChange}
      focusType={focusMap[focusType]}
      blurType={blurMap[blurType]}
      style={containerStyle}
      ref={ref}
    >
      <TextInput blurOnSubmit={false} {...props} />
    </TextInputFocusWrapperNative>
  )
);
