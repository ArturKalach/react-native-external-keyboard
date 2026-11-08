import React, { useMemo } from 'react';
import {
  GroupIdentifierContext,
  useGroupIdentifierContext,
} from './GroupIdentifierContext';

export type KeyboardGroupProviderProps = React.PropsWithChildren<{
  /**
   * iOS `focusGroupIdentifier` for every focusable view below that has no
   * `groupIdentifier` of its own. Unset inherits from the parent scope.
   *
   * @platform ios
   */
  groupIdentifier?: string;
  /**
   * Overrides whether views below generate a unique `focusGroupIdentifier` when they have
   * no group id. Unset inherits from the parent scope, then `Keyboard.configure`.
   * No effect while a `groupIdentifier` is set here or on an enclosing scope: views join it.
   *
   * @platform ios
   */
  uniqueGroupIdentifier?: boolean;
}>;

/**
 * JS-only focus-group scope (iOS): no native view, no layout. It decides which keyboard
 * focus group the focusable views inside belong to, i.e. what one Tab stop is. Focus
 * *order* is separate: use `K.Order` for that. Reach for
 * `K.FocusGroup` instead when you also need group focus events
 * (`onGroupFocusChange`/`onFocusChange`) or group styling (`tintColor`, `focusStyle`).
 * Wrap the whole app in one to set the default for a React tree.
 */
export const KeyboardGroupProvider = ({
  groupIdentifier,
  uniqueGroupIdentifier,
  children,
}: KeyboardGroupProviderProps) => {
  // Always rendered (a stable tree, so toggling a prop never remounts `children`);
  // an unset prop keeps the parent's value.
  const parent = useGroupIdentifierContext();
  const nextGroupIdentifier = groupIdentifier || parent.groupIdentifier;
  const nextUniqueGroupIdentifier =
    uniqueGroupIdentifier ?? parent.uniqueGroupIdentifier;

  const value = useMemo(
    () => ({
      groupIdentifier: nextGroupIdentifier,
      uniqueGroupIdentifier: nextUniqueGroupIdentifier,
    }),
    [nextGroupIdentifier, nextUniqueGroupIdentifier]
  );

  return (
    <GroupIdentifierContext.Provider value={value}>
      {children}
    </GroupIdentifierContext.Provider>
  );
};
