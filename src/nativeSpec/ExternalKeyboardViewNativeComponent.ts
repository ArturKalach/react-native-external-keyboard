import type { ColorValue, ViewProps } from 'react-native';
import type {
  BubblingEventHandler,
  DirectEventHandler,
  Float,
  Int32,
} from 'react-native/Libraries/Types/CodegenTypes';
import type { ComponentType } from 'react';
// eslint-disable-next-line @react-native/no-deep-imports
import codegenNativeCommands from 'react-native/Libraries/Utilities/codegenNativeCommands';
// eslint-disable-next-line @react-native/no-deep-imports
import codegenNativeComponent from 'react-native/Libraries/Utilities/codegenNativeComponent';

export type FocusChange = Readonly<{
  isFocused: boolean;
}>;

export type EnterPress = Readonly<{
  isShiftPressed: boolean;
  isAltPressed: boolean;
  isEnterPress: boolean;
}>;

export type KeyPress = Readonly<{
  keyCode: Int32;
  unicode: Int32;
  unicodeChar: string;
  isLongPress: boolean;
  isAltPressed: boolean;
  isShiftPressed: boolean;
  isCtrlPressed: boolean;
  isCapsLockOn: boolean;
  hasNoModifiers: boolean;
}>;

export interface ExternalKeyboardNativeProps extends ViewProps {
  onFocusChange?: DirectEventHandler<FocusChange>;
  onKeyUpPress?: DirectEventHandler<KeyPress>;
  onKeyDownPress?: DirectEventHandler<KeyPress>;
  onContextMenuPress?: DirectEventHandler<{}>;
  onBubbledContextMenuPress?: BubblingEventHandler<{}>;
  canBeFocused?: boolean;
  hasKeyDownPress?: boolean;
  hasKeyUpPress?: boolean;
  hasOnFocusChanged?: boolean;
  autoFocus?: boolean;
  haloEffect?: boolean;
  haloCornerRadius?: Float;
  haloExpendX?: Float;
  haloExpendY?: Float;
  roundedHaloFix?: boolean;
  tintColor?: ColorValue;
  focusableWrapper?: boolean;
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
  screenAutoA11yFocus?: boolean;
  screenAutoA11yFocusDelay?: Int32;
  orderGroup?: string;
  orderIndex?: Int32;
  lockFocus?: Int32;
  orderId?: string;
  orderLeft?: string;
  orderRight?: string;
  orderUp?: string;
  orderDown?: string;
  orderForward?: string;
  orderBackward?: string;
  orderFirst?: string;
  orderLast?: string;
  enableContextMenu?: boolean;
}

export interface NativeCommands {
  // @ts-ignore
  rnekKeyboardFocus: (viewRef: React.ElementRef<ComponentType>) => void;
  // @ts-ignore
  rnekScreenReaderFocus: (viewRef: React.ElementRef<ComponentType>) => void;
}

export const Commands: NativeCommands = codegenNativeCommands<NativeCommands>({
  supportedCommands: ['rnekKeyboardFocus', 'rnekScreenReaderFocus'],
});

export default codegenNativeComponent<ExternalKeyboardNativeProps>(
  'ExternalKeyboardView'
);
