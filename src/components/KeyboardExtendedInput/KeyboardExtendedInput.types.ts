import {
  type TextInputProps,
  type StyleProp,
  type ViewStyle,
  type ColorValue,
} from 'react-native';

import type { FocusStyle } from '../../types/FocusStyle';
import type { TintType } from '../../types/WithKeyboardFocus';
import { type RenderProp } from '../RenderPropComponent/RenderPropComponent';
import type { blurMap, focusMap } from './KeyboardExtendedInput.consts';
import type { LockFocusType } from '../../types/BaseKeyboardView';

export type ExtraKeyboardProps = {
  focusType?: keyof typeof focusMap;
  blurType?: keyof typeof blurMap;
  containerStyle?: StyleProp<ViewStyle>;
  onFocusChange?: (isFocused: boolean) => void;
  focusStyle?: FocusStyle;
  haloEffect?: boolean;
  canBeFocusable?: boolean;
  focusable?: boolean;
  tintColor?: ColorValue;
  tintType?: TintType;
  containerFocusStyle?: FocusStyle;
  FocusHoverComponent?: RenderProp;
  submitBehavior?: string;
  groupIdentifier?: string;
  lockFocus?: LockFocusType[];
  orderGroup?: string;
  orderIndex?: number;
  orderId?: string;
  orderForward?: string;
  orderBackward?: string;
  orderLeft?: string;
  orderRight?: string;
  orderUp?: string;
  orderDown?: string;
};

type IgnoreForCompatibility =
  | 'rejectResponderTermination'
  | 'selectionHandleColor'
  | 'cursorColor'
  | 'maxFontSizeMultiplier';

type CompatibleInputProp<
  TextInputPropsType extends object,
  CompatibilityProp extends IgnoreForCompatibility
> = CompatibilityProp extends keyof TextInputPropsType
  ? TextInputPropsType[CompatibilityProp]
  : CompatibilityProp extends keyof TextInputProps
  ? TextInputProps[CompatibilityProp]
  : never;

type ReactNativeInputCompatibility<
  TextInputPropsType extends object = TextInputProps
> = Omit<TextInputPropsType, IgnoreForCompatibility> & {
  [CompatibilityProp in IgnoreForCompatibility]?: CompatibleInputProp<
    TextInputPropsType,
    CompatibilityProp
  > | null;
};

export type KeyboardInputPropsDeclaration<
  TextInputPropsType extends object = TextInputProps
> = ReactNativeInputCompatibility<TextInputPropsType> & ExtraKeyboardProps;

export type KeyboardInputProps = KeyboardInputPropsDeclaration<TextInputProps>;
