import type { StyleProp, ViewStyle } from 'react-native';

/** State argument passed to a {@link FocusStyle} callback. */
export type FocusStateCallbackType = {
  readonly focused: boolean;
};

/**
 * A style applied based on focus state. Either a static style, or a callback that
 * receives `{ focused }` and returns the style to apply for the current state.
 */
export type FocusStyle =
  | StyleProp<ViewStyle>
  | ((state: FocusStateCallbackType) => StyleProp<ViewStyle>)
  | undefined;
