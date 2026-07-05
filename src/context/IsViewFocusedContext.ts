import React, { useContext, useSyncExternalStore } from 'react';

/**
 * Per-view focus store. Backing the context with a store (rather than a raw
 * boolean) lets `useIsViewFocused` consumers re-render on focus **without**
 * forcing the focusable host to re-render — so a host with no JS focus styling
 * pays nothing on focus while descendants that read the state still update.
 */
export type FocusStore = {
  subscribe: (onStoreChange: () => void) => () => void;
  getSnapshot: () => boolean;
};

const noopUnsubscribe = () => {};
const emptySubscribe = () => noopUnsubscribe;
const falseSnapshot = () => false;

/** `null` when there is no focusable ancestor. */
export const IsViewFocusedContext = React.createContext<FocusStore | null>(
  null
);

/** Whether the nearest focusable view is currently keyboard-focused. */
export const useIsViewFocused = (): boolean => {
  const store = useContext(IsViewFocusedContext);
  return useSyncExternalStore(
    store?.subscribe ?? emptySubscribe,
    store?.getSnapshot ?? falseSnapshot
  );
};
