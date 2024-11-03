import React, { useContext } from 'react';

export const IsViewFocusedContext = React.createContext<boolean>(false);

export const useIsViewFocused = () => useContext(IsViewFocusedContext);
