import React, { useContext, useSyncExternalStore } from 'react';
import type { ValueStore } from '../utils/useValueStore';

/**
 * Per-view press store. Mirrors {@link IsViewFocusedContext}: it lets a
 * descendant react to the press state (touch **and** physical keyboard
 * activation) of the nearest focusable host **without** re-rendering that host.
 *
 * Use it to build press-driven styling (e.g. a container highlight) that would
 * otherwise need a function `style`/`containerStyle` — which re-renders the host
 * on every press.
 */
export type PressStore = ValueStore;

const noopUnsubscribe = () => {};
const emptySubscribe = () => noopUnsubscribe;
const falseSnapshot = () => false;

/** `null` when there is no focusable ancestor. */
export const IsViewPressedContext = React.createContext<PressStore | null>(
  null
);

/** Whether the nearest focusable view is currently pressed (touch or keyboard). */
export const useIsViewPressed = (): boolean => {
  const store = useContext(IsViewPressedContext);
  return useSyncExternalStore(
    store?.subscribe ?? emptySubscribe,
    store?.getSnapshot ?? falseSnapshot
  );
};
