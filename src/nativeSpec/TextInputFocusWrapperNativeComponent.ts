import type { ViewProps, ColorValue } from 'react-native';
import type {
  DirectEventHandler,
  Float,
  Int32,
} from 'react-native/Libraries/Types/CodegenTypes';
// eslint-disable-next-line @react-native/no-deep-imports
import codegenNativeComponent from 'react-native/Libraries/Utilities/codegenNativeComponent';

export type FocusChange = Readonly<{
  isFocused: boolean;
}>;

export type MultiplyTextSubmit = Readonly<{
  text: string;
}>;

export interface TextInputFocusWrapperNativeComponent extends ViewProps {
  onFocusChange?: DirectEventHandler<FocusChange>;
  onMultiplyTextSubmit?: DirectEventHandler<MultiplyTextSubmit>;
  focusType?: Int32;
  blurType?: Int32;
  canBeFocused?: boolean;
  hasOnFocusChanged?: boolean;
  haloEffect?: boolean;
  haloCornerRadius?: Float;
  haloExpendX?: Float;
  haloExpendY?: Float;
  roundedHaloFix?: boolean;
  tintColor?: ColorValue;
  blurOnSubmit?: boolean;
  multiline?: boolean;
  groupIdentifier?: string;
  /**
   * iOS: when `true` a view without an explicit `groupIdentifier` gets a
   * generated, unique `focusGroupIdentifier` (one keyboard focus group per view).
   * When `false` (the JS default since 0.14) no id is generated and the system default
   * grouping applies.
   * An explicit `groupIdentifier` always wins. Android: no-op.
   * Codegen defaults an omitted boolean to `false`, so JS always passes the resolved value.
   * Public JS prop: `uniqueGroupIdentifier`.
   */
  uniqueGroupIdentifierEnabled?: boolean;
  lockFocus?: Int32;
  orderGroup?: string;
  orderIndex?: Int32;
  orderId?: string;
  orderLeft?: string;
  orderRight?: string;
  orderUp?: string;
  orderDown?: string;
  orderForward?: string;
  orderBackward?: string;
  orderFirst?: string;
  orderLast?: string;
}

export default codegenNativeComponent<TextInputFocusWrapperNativeComponent>(
  'TextInputFocusWrapper'
);
