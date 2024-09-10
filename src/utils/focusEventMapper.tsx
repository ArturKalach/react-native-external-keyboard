import type { NativeSyntheticEvent } from 'react-native';

export const focusEventMapper =
  (fn?: (isFocused: boolean) => void) =>
  (
    e: NativeSyntheticEvent<{
      isFocused: boolean;
    }>
  ) =>
    fn?.(e.nativeEvent.isFocused);
