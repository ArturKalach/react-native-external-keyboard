import { useCallback } from 'react';
import type { OnFocusChangeFn, NativeFocusChangeHandler } from '../types';

type UseFocusChange = {
  onFocusChange?: OnFocusChangeFn;
  onFocus?: () => void;
  onBlur?: () => void;
};

export const useOnFocusChange = ({
  onFocusChange,
  onFocus,
  onBlur,
}: UseFocusChange) =>
  useCallback<NativeFocusChangeHandler>(
    (e) => {
      onFocusChange?.(e.nativeEvent.isFocused, e.nativeEvent.target);
      if (e.nativeEvent.isFocused) {
        onFocus?.();
      } else {
        onBlur?.();
      }
    },
    [onBlur, onFocus, onFocusChange]
  );
