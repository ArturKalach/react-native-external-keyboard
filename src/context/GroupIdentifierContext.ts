import React, { useContext } from 'react';
import { getUniqueGroupIdentifier } from '../config';

/**
 * iOS keyboard focus grouping inherited by descendant focusable views. Set by
 * `KeyboardGroupProvider` (also used by `KeyboardFocusGroup`). An unset field means
 * "not set here": inherit from the parent scope.
 */
export type GroupIdentifierScope = {
  groupIdentifier?: string;
  uniqueGroupIdentifier?: boolean;
};

export const GroupIdentifierContext = React.createContext<GroupIdentifierScope>(
  {}
);

export const useGroupIdentifierContext = () =>
  useContext(GroupIdentifierContext);

/**
 * Native grouping props for one view: its own value, else the nearest scope; the flag
 * then falls back to `Keyboard.configure` (default `false`). Natively a `groupIdentifier`
 * always wins over the flag.
 */
export const useResolvedGroupIdentifier = ({
  groupIdentifier,
  uniqueGroupIdentifier,
}: GroupIdentifierScope) => {
  const scope = useGroupIdentifierContext();

  return {
    groupIdentifier: groupIdentifier ?? scope.groupIdentifier,
    uniqueGroupIdentifierEnabled:
      uniqueGroupIdentifier ??
      scope.uniqueGroupIdentifier ??
      getUniqueGroupIdentifier(),
  };
};
