import React, { useContext } from 'react';

export const KeyPressContext = React.createContext<{
  bubbledMenu: boolean;
}>({
  bubbledMenu: false,
});

export const useKeyPressContext = () => useContext(KeyPressContext);
