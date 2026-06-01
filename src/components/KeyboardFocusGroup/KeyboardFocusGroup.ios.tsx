import React from 'react';
import { KeyboardFocusGroupNative } from '../../nativeSpec';
import { GroupIdentifierContext } from '../../context/GroupIdentifierContext';
import { useOnFocusChange } from '../../utils/useOnFocusChange';
import { useFocusStyle } from '../../utils/useFocusStyle';
import type { KeyboardFocusGroupProps } from './KeyboardFocusGroup.types';

export type { KeyboardFocusGroupProps };

export const KeyboardFocusGroup = React.memo<KeyboardFocusGroupProps>(
  (props) => {
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
  }
);
