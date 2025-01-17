import React, { type PropsWithChildren } from 'react';
import { type ColorValue } from 'react-native';
import { KeyboardFocusGroupNative } from '../../nativeSpec';
import { GroupIdentifierContext } from '../../context/GroupIdentifierContext';
import type { OnFocusChangeFn } from '../../types';

export type KeyboardFocusGroupProps = PropsWithChildren<{
  groupIdentifier?: string;
  tintColor?: ColorValue;
  onGroupFocusChange?: OnFocusChangeFn;
}>;

export const KeyboardFocusGroup = React.memo<KeyboardFocusGroupProps>(
  (props) => {
    const { groupIdentifier } = props;

    if (!groupIdentifier) return <KeyboardFocusGroupNative {...props} />;

    return (
      <GroupIdentifierContext.Provider value={groupIdentifier}>
        <KeyboardFocusGroupNative {...props} />
      </GroupIdentifierContext.Provider>
    );
  }
);
