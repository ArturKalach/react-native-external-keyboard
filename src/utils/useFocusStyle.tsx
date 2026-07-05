import { useState, useMemo, useCallback } from 'react';
import type { FocusStyle, InteractiveStyleProp } from '../types';
import { useValueStore } from './useValueStore';

type UseFocusStyleProps = {
  focusStyle?: FocusStyle;
  containerFocusStyle?: FocusStyle;
  onFocusChange?: (isFocused: boolean) => void;
  style?: InteractiveStyleProp;
  pressedStyleSignature?: boolean;
  /**
   * Re-render this host on focus change. Default `true`. When `false`, focus
   * still updates the shared focus store (so `useIsViewFocused` consumers
   * re-render) but this host does not — used when nothing here depends on
   * `focused` and only the native halo shows the focus.
   */
  reactToFocus?: boolean;
};

export const useFocusStyle = ({
  focusStyle,
  onFocusChange,
  containerFocusStyle,
  style,
  pressedStyleSignature = false,
  reactToFocus = true,
}: UseFocusStyleProps) => {
  const [focused, setFocusStatus] = useState(false);

  // Per-instance focus store — always reflects focus for context consumers,
  // even when this host opts out of re-rendering (`reactToFocus === false`).
  const focusController = useValueStore();
  const focusStore = focusController.store;

  const onFocusChangeHandler = useCallback(
    (isFocused: boolean) => {
      focusController.set(isFocused);
      if (reactToFocus) setFocusStatus(isFocused);
      onFocusChange?.(isFocused);
    },
    [onFocusChange, reactToFocus, focusController]
  );

  const componentFocusedStyle = useMemo(() => {
    const specificStyle =
      typeof focusStyle === 'function' ? focusStyle({ focused }) : focusStyle;
    return focused ? specificStyle : undefined;
  }, [focusStyle, focused]);

  const containerFocusedStyle = useMemo(() => {
    if (!containerFocusStyle) return undefined;

    const specificStyle =
      typeof containerFocusStyle === 'function'
        ? containerFocusStyle({ focused })
        : containerFocusStyle;

    return focused ? specificStyle : undefined;
  }, [containerFocusStyle, focused]);

  const defaultComponentStyle = useMemo(
    () => (pressedStyleSignature ? undefined : [style, componentFocusedStyle]),
    [pressedStyleSignature, style, componentFocusedStyle]
  );
  const styleHandlerPressable = useCallback(
    ({ pressed }: { pressed: boolean }) => {
      if (typeof style === 'function') {
        // Inject `focused` so the unified `style({ focused, pressed })` works.
        return [style({ pressed, focused }), componentFocusedStyle];
      } else {
        return [style, componentFocusedStyle];
      }
    },
    [componentFocusedStyle, style, focused]
  );

  const componentStyleViewStyle = pressedStyleSignature
    ? styleHandlerPressable
    : defaultComponentStyle;

  return {
    componentStyleViewStyle,
    componentFocusedStyle,
    containerFocusedStyle,
    onFocusChangeHandler,
    focused,
    focusStore,
  };
};
