import React from 'react';
import { KeyboardFocusGroupNative } from '../../nativeSpec';
import {
  OrderFocusGroupContext,
  useOrderFocusGroup,
} from '../../context/OrderFocusContext';
import { useOnFocusChange } from '../../utils/useOnFocusChange';
import { useFocusStyle } from '../../utils/useFocusStyle';
import type { KeyboardFocusGroupProps } from './KeyboardFocusGroup.types';

export type { KeyboardFocusGroupProps };

export const KeyboardFocusGroup = React.memo<KeyboardFocusGroupProps>(
  // `orderGroup` is JS-only on both platforms: it scopes descendants, never reaches native.
  ({ orderGroup, ...props }) => {
    const parentOrderGroup = useOrderFocusGroup();
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
      <OrderFocusGroupContext.Provider value={orderGroup ?? parentOrderGroup}>
        <KeyboardFocusGroupNative
          {...props}
          style={[props.style, focusStyle]}
          onGroupFocusChange={onGroupFocusChangeHandler}
        />
      </OrderFocusGroupContext.Provider>
    );
  }
);
