import { useMemo } from 'react';
import type { ViewProps } from 'react-native';
import type { ContainerStyle } from '../types';

type UseContainerStyleParams = {
  /** Static style/array, or `({ pressed, focused }) => style`. */
  containerStyle?: ContainerStyle<unknown>;
  /** Style applied while focused (already gated on `focused`). */
  containerFocusedStyle?: ViewProps['style'];
  pressed: boolean;
  focused: boolean;
};

/**
 * Builds the container (`BaseKeyboardView`) style array from the resolved
 * `containerStyle` and the focus style. Apply rounding (`borderRadius`) directly
 * via `containerStyle`.
 */
export const useContainerStyle = ({
  containerStyle,
  containerFocusedStyle,
  pressed,
  focused,
}: UseContainerStyleParams) =>
  useMemo(() => {
    const resolved =
      typeof containerStyle === 'function'
        ? (
            containerStyle as (s: {
              pressed: boolean;
              focused: boolean;
            }) => ViewProps['style']
          )({ pressed, focused })
        : (containerStyle as ViewProps['style']);
    return [resolved, containerFocusedStyle];
  }, [containerStyle, containerFocusedStyle, pressed, focused]);
