import type { PressableProps, View, ViewProps } from 'react-native';
import type { FocusStyle } from './FocusStyle';
import type { KeyboardFocus, OnKeyPress } from './BaseKeyboardView';
import type { FocusViewProps } from './KeyboardFocusView.types';
import type { RefAttributes } from 'react';

export type RenderProp =
  | React.ReactElement
  | React.FunctionComponent
  | (() => React.ReactElement);

type KeyboardPressHandler = (e?: OnKeyPress) => void;

type PressHandlerProp<
  ComponentProps extends object,
  PropName extends 'onPress' | 'onLongPress' | 'onPressIn' | 'onPressOut'
> = PropName extends keyof ComponentProps
  ? ComponentProps[PropName]
  : KeyboardPressHandler;

type PickProp<
  ComponentProps extends object,
  PropName extends string
> = PropName extends keyof ComponentProps ? ComponentProps[PropName] : unknown;

export type WithKeyboardFocusComponent<ComponentProps extends object> =
  | React.JSXElementConstructor<ComponentProps>
  | React.ForwardRefExoticComponent<ComponentProps>;

export type KeyboardPressType<ComponentProps extends object> = {
  onPress?: PressHandlerProp<ComponentProps, 'onPress'>;
  onLongPress?: PressHandlerProp<ComponentProps, 'onLongPress'>;
  onPressIn?: PressHandlerProp<ComponentProps, 'onPressIn'>;
  onPressOut?: PressHandlerProp<ComponentProps, 'onPressOut'>;
  onComponentFocus?: PickProp<ComponentProps, 'onFocus'>;
  onComponentBlur?: PickProp<ComponentProps, 'onBlur'>;
};

export type WithKeyboardProps<ViewType = View, ViewStyleType = unknown> = {
  withPressedStyle?: boolean;
  containerStyle?: ViewStyleType | ViewProps['style'];
  containerFocusStyle?: FocusStyle;
  tintType?: TintType;
  componentRef?: React.RefObject<ViewType>;
  FocusHoverComponent?: RenderProp;
  style?: PressableProps['style'];
  onBlur?: (() => void) | ((e: any) => void) | null;
  onFocus?: (() => void) | ((e: any) => void) | null;
};

type KeyboardFocusBaseProps = Omit<
  FocusViewProps,
  'onPress' | 'onLongPress' | 'onBlur' | 'onFocus'
>;

type MergeProps<BaseProps extends object, OverrideProps extends object> = Omit<
  BaseProps,
  keyof OverrideProps
> &
  OverrideProps;

type KeyboardFocusOverrideProps<
  ComponentProps extends object,
  ViewStyleType,
  ViewType = View
> = KeyboardPressType<ComponentProps> &
  KeyboardFocusBaseProps &
  WithKeyboardProps<ViewType, ViewStyleType>;

export type WithKeyboardFocus<
  ComponentProps extends object,
  ViewStyleType,
  ViewType = View
> = MergeProps<
  ComponentProps,
  KeyboardFocusOverrideProps<ComponentProps, ViewStyleType, ViewType>
>;

export type WithKeyboardPropsTypeDeclaration<
  ComponentProps extends object,
  ViewStyleType,
  ViewType = View
> = WithKeyboardFocus<ComponentProps, ViewStyleType, ViewType> &
  RefAttributes<KeyboardFocus>;

export type WithKeyboardFocusDeclaration<
  ComponentProps extends object,
  ViewStyleType,
  ViewType = View
> =
  | React.JSXElementConstructor<
      WithKeyboardPropsTypeDeclaration<ComponentProps, ViewStyleType, ViewType>
    >
  | React.ForwardRefExoticComponent<
      WithKeyboardPropsTypeDeclaration<ComponentProps, ViewStyleType, ViewType>
    >;

export type TintType = 'default' | 'hover' | 'background' | 'none';
