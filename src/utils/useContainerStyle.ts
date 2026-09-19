import { useMemo } from 'react';
import type { StyleProp, ViewStyle } from 'react-native';
import type { ContainerStyle } from '../types';

type UseContainerStyleParams = {
  /** Static style/array, or `({ pressed, focused }) => style`. */
  containerStyle?: ContainerStyle<unknown>;
  /** Style applied while focused (already gated on `focused`). */
  containerFocusedStyle?: StyleProp<ViewStyle>;
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
}: UseContainerStyleParams): StyleProp<ViewStyle> =>
  useMemo(() => {
    const resolved =
      typeof containerStyle === 'function'
        ? (
            containerStyle as (s: {
              pressed: boolean;
              focused: boolean;
            }) => StyleProp<ViewStyle>
          )({ pressed, focused })
        : (containerStyle as StyleProp<ViewStyle>);
    return [resolved, containerFocusedStyle];
  }, [containerStyle, containerFocusedStyle, pressed, focused]);
