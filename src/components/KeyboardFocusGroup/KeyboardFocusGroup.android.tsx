import React from 'react';
import { KeyboardFocusGroupNative } from '../../nativeSpec';
import { useOnFocusChange } from '../../utils/useOnFocusChange';
import { useFocusStyle } from '../../utils/useFocusStyle';
import type { KeyboardFocusGroupProps } from './KeyboardFocusGroup.types';

export type { KeyboardFocusGroupProps };

export const KeyboardFocusGroup = React.memo<KeyboardFocusGroupProps>(
  (props) => {
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
  }
);
