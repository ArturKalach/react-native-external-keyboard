import React, { useContext } from 'react';

export const KeyPressContext = React.createContext<{
  bubbledKeyUp: boolean;
  bubbledKeyDown: boolean;
  bubbledMenu: boolean;
}>({
  bubbledKeyUp: false,
  bubbledKeyDown: false,
  bubbledMenu: false,
});

export const useKeyPressContext = () => useContext(KeyPressContext);
