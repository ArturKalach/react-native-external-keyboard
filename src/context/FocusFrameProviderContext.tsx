import React, { useMemo } from 'react';
import {
  createContext,
  useContext,
  useState,
  type PropsWithChildren,
} from 'react';

type FocusFrameContextType = {
  hasFocusLock: boolean;
  setHasFocusLock: (v: boolean) => void;
  focusLockId: symbol | null;
  setFocusLockId: (v: symbol | null) => void;
};

const FocusFrameProviderContext = createContext<
  FocusFrameContextType | undefined
>(undefined);

export const useFocusFrameContext = () => useContext(FocusFrameProviderContext);

export const FrameProvider: React.FC<PropsWithChildren> = ({ children }) => {
  const [hasFocusLock, setHasFocusLock] = useState(false);
  const [focusLockId, setFocusLockId] = useState<symbol | null>(null);

  const state = useMemo(
    () => ({ hasFocusLock, focusLockId, setHasFocusLock, setFocusLockId }),
    [hasFocusLock, focusLockId, setHasFocusLock, setFocusLockId]
  );

  return (
    <FocusFrameProviderContext.Provider value={state}>
      {children}
    </FocusFrameProviderContext.Provider>
  );
};
