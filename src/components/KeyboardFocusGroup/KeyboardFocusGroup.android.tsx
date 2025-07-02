import React, { type PropsWithChildren } from 'react';
import { type ColorValue, type ViewProps } from 'react-native';
import { KeyboardFocusGroupNative } from '../../nativeSpec';
import { useOnFocusChange } from '../../utils/useOnFocusChange';
import { useFocusStyle } from '../../utils/useFocusStyle';
import type { FocusStyle } from '../../types';

export type KeyboardFocusGroupProps = PropsWithChildren<{
  groupIdentifier?: string;
  tintColor?: ColorValue;
  onFocus?: () => void;
  onBlur?: () => void;
  onFocusChange?: (isFocused: boolean) => void;
  orderGroup?: string;
  focusStyle?: FocusStyle;
}>;

export const KeyboardFocusGroup = React.memo<
  ViewProps & KeyboardFocusGroupProps
>((props) => {
  const { containerFocusedStyle: focusStyle, onFocusChangeHandler } =
    useFocusStyle({
      onFocusChange: props.onFocusChange,
      containerFocusStyle: props.focusStyle,
    });

  const onGroupFocusChangeHandler = useOnFocusChange({
    ...props,
    onFocusChange: onFocusChangeHandler,
  });

  return (
    <KeyboardFocusGroupNative
      {...props}
      style={[props.style, focusStyle]}
      onGroupFocusChange={onGroupFocusChangeHandler}
    />
  );
});
