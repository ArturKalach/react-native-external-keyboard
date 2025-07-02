import React, { type PropsWithChildren } from 'react';
import { type ColorValue, type ViewProps } from 'react-native';
import { KeyboardFocusGroupNative } from '../../nativeSpec';
import { GroupIdentifierContext } from '../../context/GroupIdentifierContext';
import { useOnFocusChange } from '../../utils/useOnFocusChange';
import { useFocusStyle } from '../../utils/useFocusStyle';
import type { FocusStyle } from '../../types';

export type KeyboardFocusGroupProps = PropsWithChildren<{
  groupIdentifier?: string;
  tintColor?: ColorValue;
  onFocus?: () => void;
  onBlur?: () => void;
  onFocusChange?: (isFocused: boolean) => void;
  focusStyle?: FocusStyle;
  orderGroup?: string;
}>;

export const KeyboardFocusGroup = React.memo<
  ViewProps & KeyboardFocusGroupProps
>((props) => {
  const { groupIdentifier } = props;

  const { containerFocusedStyle: focusStyle, onFocusChangeHandler } =
    useFocusStyle({
      onFocusChange: props.onFocusChange,
      containerFocusStyle: props.focusStyle,
    });

  const onGroupFocusChangeHandler = useOnFocusChange({
    ...props,
    onFocusChange: onFocusChangeHandler,
  });

  if (!groupIdentifier)
    return (
      <KeyboardFocusGroupNative
        {...props}
        style={[props.style, focusStyle]}
        onGroupFocusChange={onGroupFocusChangeHandler}
      />
    );

  return (
    <GroupIdentifierContext.Provider value={groupIdentifier}>
      <KeyboardFocusGroupNative
        {...props}
        style={[props.style, focusStyle]}
        onGroupFocusChange={onGroupFocusChangeHandler}
      />
    </GroupIdentifierContext.Provider>
  );
});
