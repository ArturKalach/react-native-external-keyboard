import { useRef } from 'react';

/**
 * A minimal external store of a boolean, shaped for `useSyncExternalStore`.
 * Backs the per-view focus and press stores: updating the value notifies
 * subscribers directly, so descendants that read it re-render **without**
 * re-rendering the focusable host.
 */
export type ValueStore = {
  subscribe: (onStoreChange: () => void) => () => void;
  getSnapshot: () => boolean;
};

/** Imperative controller returned by {@link useValueStore}. */
export type ValueStoreController = {
  /** Pass to a context provider for `useSyncExternalStore` consumers. */
  store: ValueStore;
  /** Set the value; notifies subscribers only on change. Returns whether it changed. */
  set: (value: boolean) => boolean;
  /** Current value. */
  get: () => boolean;
  /** Number of active subscribers (for debug/telemetry). */
  listenerCount: () => number;
};

/**
 * Creates a stable {@link ValueStoreController} for the lifetime of the
 * component. The `store` reference is stable, so providing it as a context
 * value never re-renders consumers by identity — only a real value change does.
 */
export const useValueStore = (): ValueStoreController => {
  const ref = useRef<ValueStoreController>();
  if (!ref.current) {
    const state = { value: false, listeners: new Set<() => void>() };
    ref.current = {
      store: {
        subscribe: (onStoreChange) => {
          state.listeners.add(onStoreChange);
          return () => {
            state.listeners.delete(onStoreChange);
          };
        },
        getSnapshot: () => state.value,
      },
      set: (value) => {
        if (state.value === value) return false;
        state.value = value;
        state.listeners.forEach((l) => l());
        return true;
      },
      get: () => state.value,
      listenerCount: () => state.listeners.size,
    };
  }
  return ref.current;
};
