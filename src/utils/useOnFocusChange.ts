import { useCallback } from 'react';
import type { OnFocusChangeFn } from '../types';

type UseFocusChange = {
  onFocusChange?: (f: boolean, tag?: number) => void;
  onFocus?: () => void;
  onBlur?: () => void;
};

export const useOnFocusChange = ({
  onFocusChange,
  onFocus,
  onBlur,
}: UseFocusChange) =>
  useCallback<OnFocusChangeFn>(
    (e) => {
      onFocusChange?.(
        e.nativeEvent.isFocused,
        (e?.nativeEvent as unknown as { target?: number })?.target
      );
      if (e.nativeEvent.isFocused) {
        onFocus?.();
      } else {
        onBlur?.();
      }
    },
    [onBlur, onFocus, onFocusChange]
  );
