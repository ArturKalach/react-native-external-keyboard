import React, { useContext } from 'react';

export const GroupIdentifierContext = React.createContext<string | undefined>(
  undefined
);

export const useGroupIdentifierContext = () =>
  useContext(GroupIdentifierContext);
