import React from 'react';
import { KeyboardFocusGroupNative } from '../../nativeSpec';
import {
  OrderFocusGroupContext,
  useOrderFocusGroup,
} from '../../context/OrderFocusContext';
import { KeyboardGroupProvider } from '../../context/KeyboardGroupProvider';
import { useOnFocusChange } from '../../utils/useOnFocusChange';
import { useFocusStyle } from '../../utils/useFocusStyle';
import type { KeyboardFocusGroupProps } from './KeyboardFocusGroup.types';

export type { KeyboardFocusGroupProps };

/**
 * Native focus group: group focus events and styling. Its `groupIdentifier` is shared
 * with descendants through `KeyboardGroupProvider` (use that directly when you only need
 * the grouping, without a native view), and its `orderGroup` as their keyboard order group.
 */
export const KeyboardFocusGroup = React.memo<KeyboardFocusGroupProps>(
  // `orderGroup` is JS-only: it scopes descendants, never reaches native. The provider
  // is always rendered (stable tree); unset keeps the parent's group.
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
        <KeyboardGroupProvider groupIdentifier={props.groupIdentifier}>
          <KeyboardFocusGroupNative
            {...props}
            style={[props.style, focusStyle]}
            onGroupFocusChange={onGroupFocusChangeHandler}
          />
        </KeyboardGroupProvider>
      </OrderFocusGroupContext.Provider>
    );
  }
);
