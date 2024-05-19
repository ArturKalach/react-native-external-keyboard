import React from 'react';
import { ExternalKeyboardViewNative } from '../../nativeSpec';
import type { ExternalKeyboardNativeProps } from '../../nativeSpec/ExternalKeyboardViewNativeComponent';
import type { View } from 'react-native';

export const ExternalKeyboardView = React.memo(
  React.forwardRef<View, ExternalKeyboardNativeProps>((props, ref) => (
    <ExternalKeyboardViewNative
      {...props}
      ref={ref}
      hasKeyDownPress={Boolean(props.onKeyDownPress)}
      hasKeyUpPress={Boolean(props.onKeyUpPress)}
    />
  ))
);
