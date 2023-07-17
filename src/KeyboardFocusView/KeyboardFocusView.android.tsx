import React from 'react';
import { View } from 'react-native';
import { useFocusStyle } from './useFocusStyle';
import ExternalKeyboardView from '../ExternalKeyboardViewNativeComponent';
// import { useCanBeFocused } from '../../providers';
import type { KeyboardFocusViewProps } from './KeyboardFocusView.types';

export const KeyboardFocusView = React.forwardRef<View, KeyboardFocusViewProps>(
  (
    {
      canBeFocused,
      onFocusChange,
      focusStyle,
      children,
      style,
      withView = true,
      onKeyUpPress,
      onKeyDownPress,
      ...props
    },
    ref
  ) => {
    const canBecomeFocused = true;
    const { fStyle, onFocusChangeHandler } = useFocusStyle(
      focusStyle,
      onFocusChange
    );

    return (
      <ExternalKeyboardView
        onFocusChange={onFocusChangeHandler}
        style={[style, fStyle]}
        canBeFocused={canBecomeFocused && canBeFocused}
        ref={ref}
        onKeyUpPress={onKeyUpPress}
        onKeyDownPress={onKeyDownPress}
        {...props}
      >
        {withView ? <View accessible>{children}</View> : children}
      </ExternalKeyboardView>
    );
  }
);
