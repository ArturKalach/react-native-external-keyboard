import type { StyleProp, ViewStyle } from 'react-native';

export type FocusStateCallbackType = {
  readonly focused: boolean;
};

export type FocusStyle =
  | StyleProp<ViewStyle>
  | ((state: FocusStateCallbackType) => StyleProp<ViewStyle>)
  | undefined;
