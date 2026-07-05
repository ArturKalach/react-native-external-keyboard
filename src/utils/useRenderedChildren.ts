import { useMemo } from 'react';
import type { ReactNode } from 'react';

type ChildrenRenderFn = (state: Record<string, unknown>) => ReactNode;

type UseRenderedChildrenProps = {
  focused: boolean;
  keyboardPressed?: boolean;
  renderContent?: ChildrenRenderFn;
  renderFocusable?: (state: { focused: boolean }) => ReactNode;
  children?: ReactNode | ChildrenRenderFn;
};

/**
 * Resolves the final `children` for the wrapped component from the available
 * sources, in priority order (single pass — only the winning source is built):
 *
 * 1. `renderContent` — kept as a function so the component invokes it with its
 *    own render-prop state, merged with `{ focused }` (and `pressed` while a
 *    keyboard activation is held).
 * 2. `renderFocusable` — evaluated once into a static node from `{ focused }`.
 * 3. function `children` — wrapped to inject `pressed` while a keyboard press is
 *    held; passed through untouched otherwise.
 * 4. plain `children` — returned as-is.
 *
 * `renderContent` wins over `renderFocusable` if both are passed (see
 * withKeyboardFocus.types).
 */
export const useRenderedChildren = ({
  focused,
  keyboardPressed = false,
  renderContent,
  renderFocusable,
  children,
}: UseRenderedChildrenProps) =>
  useMemo(() => {
    if (renderContent) {
      return (state: Record<string, unknown>) =>
        renderContent({
          ...state,
          ...(keyboardPressed && { pressed: true }),
          focused,
        });
    }

    if (renderFocusable) {
      return renderFocusable({ focused });
    }

    if (keyboardPressed && typeof children === 'function') {
      const childrenFn = children as ChildrenRenderFn;
      return (state: Record<string, unknown>) =>
        childrenFn({ ...state, pressed: true });
    }

    return children;
  }, [renderContent, renderFocusable, children, focused, keyboardPressed]);
