import { useMemo } from 'react';

type UseRenderedChildrenProps = {
  focused: boolean;
  keyboardPressed?: boolean;
  renderContent?: (state: Record<string, unknown>) => React.ReactNode;
  renderFocusable?: (state: { focused: boolean }) => React.ReactNode;
};

/**
 * Resolves the `children` override for the wrapped component.
 * - `renderContent` stays a function so the component can call it with its own state + `focused`
 *   (keyboard activation forces `pressed` when `keyboardPressed` is set)
 * - `renderFocusable` is evaluated immediately and returned as a static node
 * Returns `undefined` when neither prop is provided.
 */
export const useRenderedChildren = ({
  focused,
  keyboardPressed = false,
  renderContent,
  renderFocusable,
}: UseRenderedChildrenProps) => {
  const contentChildren = useMemo(
    () =>
      renderContent
        ? (state: Record<string, unknown>) =>
            renderContent({
              ...state,
              ...(keyboardPressed ? { pressed: true } : null),
              focused,
            })
        : undefined,
    [renderContent, focused, keyboardPressed]
  );

  const focusableChildren = useMemo(
    () => renderFocusable?.({ focused }),
    [renderFocusable, focused]
  );

  return contentChildren ?? focusableChildren;
};
