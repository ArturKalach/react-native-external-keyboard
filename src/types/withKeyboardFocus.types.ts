import type { ViewProps, ViewInstance } from 'react-native';
import type {
  FocusStyle,
  InteractionState,
  InteractiveStyleProp,
} from './focusStyle.types';
import type { KeyboardFocus } from './focus.types';
import type { OnKeyPress } from './keyPress.types';
import type { FocusViewProps } from './KeyboardFocusView.types';
import type { RefAttributes } from 'react';

/** Fallback press handler used when the wrapped component declares no matching prop. */
type KeyboardPressHandler = (e?: OnKeyPress) => void;

/**
 * Resolves a press-handler prop type: reuses the wrapped component's own signature
 * if it declares `PropName`, otherwise falls back to {@link KeyboardPressHandler}.
 */
type PressHandlerProp<
  ComponentProps extends object,
  PropName extends 'onPress' | 'onLongPress' | 'onPressIn' | 'onPressOut',
> = PropName extends keyof ComponentProps
  ? ComponentProps[PropName]
  : KeyboardPressHandler;

/** Picks the wrapped component's prop type for `PropName`, or `unknown` if absent. */
type PickProp<
  ComponentProps extends object,
  PropName extends string,
> = PropName extends keyof ComponentProps ? ComponentProps[PropName] : unknown;

/** A component constructor that {@link WithKeyboardFocusProps} can enhance. */
export type KeyboardFocusableComponent<ComponentProps extends object> =
  React.JSXElementConstructor<ComponentProps>;

/**
 * Press and focus callbacks layered onto the wrapped component. Press handlers reuse
 * the wrapped component's own signatures where possible; `onComponent{Focus,Blur}`
 * forward to the wrapped component's native `onFocus` / `onBlur`.
 */
export type KeyboardPressType<ComponentProps extends object> = {
  /** Called on press (touch or physical key). */
  onPress?: PressHandlerProp<ComponentProps, 'onPress'>;
  /** Called on long press (touch or physical key). */
  onLongPress?: PressHandlerProp<ComponentProps, 'onLongPress'>;
  /** Called when a press begins. */
  onPressIn?: PressHandlerProp<ComponentProps, 'onPressIn'>;
  /** Called when a press ends. */
  onPressOut?: PressHandlerProp<ComponentProps, 'onPressOut'>;
  /** Forwarded to the wrapped component's own `onFocus`. */
  onComponentFocus?: PickProp<ComponentProps, 'onFocus'>;
  /** Forwarded to the wrapped component's own `onBlur`. */
  onComponentBlur?: PickProp<ComponentProps, 'onBlur'>;
};

/** Extracts the state argument from a component's children render prop, or `never`. */
type ExtractRenderPropState<T> = T extends (state: infer S) => any ? S : never;

/** The render-prop state of the wrapped component's `children`, or `never` if it has none. */
export type ChildrenRenderState<CP extends object> = 'children' extends keyof CP
  ? ExtractRenderPropState<NonNullable<CP['children']>>
  : never;

/**
 * `renderContent` signature — receives the wrapped component's own render-prop state
 * merged with `{ focused }`. Resolves to `never` when the component has no render-prop children.
 */
type RenderContentProp<CP extends object> =
  ChildrenRenderState<CP> extends never
    ? never
    : (
        state: ChildrenRenderState<CP> & { focused: boolean }
      ) => React.ReactNode;

/**
 * `renderFocusable` signature — receives only `{ focused }`. Use it on components
 * (e.g. `TouchableOpacity`) that don't expose a render-prop `children`.
 */
type RenderFocusableProp = (state: { focused: boolean }) => React.ReactNode;

// `renderContent` and `renderFocusable` are conceptually mutually exclusive, but
// the public slot is kept as a plain (non-discriminated) object so consumer-side
// `Omit`/`Pick` over the prop type don't collapse a union and break assignability.
// If both are passed, `renderContent` wins at runtime (see useRenderedChildren).
// `renderContent` still resolves to `never` for components without render-prop
// children, so it remains unassignable on those.
type RenderSlot<CP extends object> = {
  renderContent?: RenderContentProp<CP>;
  renderFocusable?: RenderFocusableProp;
};

/**
 * State passed to a function-form {@link WithKeyboardBaseProps.containerStyle}.
 */
export type ContainerStyleStateType = InteractionState;

/**
 * Container style: a static style (or array), or a callback that receives the
 * {@link InteractionState} (`{ focused, pressed }`) and returns the style.
 */
export type ContainerStyle<ViewStyleType> =
  | ViewStyleType
  | ViewProps['style']
  | ((state: InteractionState) => ViewProps['style']);

type WithKeyboardBaseProps<ViewType, ViewStyleType> = {
  /**
   * @deprecated No longer needed — the `pressed` style handler is enabled
   * automatically when `style` (or `containerStyle`) is a function. Pass an
   * explicit `false` only to force a static style on a wrapped component that
   * does not accept a function `style`.
   */
  withPressedStyle?: boolean;
  /**
   * Android only. Physical-keyboard activation (Enter / Space / DPad-center)
   * does not flow through the touch responder, so the wrapped component's
   * `pressed` state stays `false` for keyboard presses. When enabled, the press
   * is tracked from the key down/up events and merged into the `pressed` value
   * passed to `renderContent` and to the `style`/`containerStyle` callbacks.
   *
   * Defaults to **auto**: it is enabled whenever a pressed-reactive style exists
   * (a function `style` or `containerStyle`), so keyboard press styles the same
   * as touch out of the box. Pass an explicit `true`/`false` to override.
   * No-op on iOS, where native focus already drives `pressed`. (The
   * `useIsViewPressed` store always reflects keyboard press, on both platforms.)
   */
  androidKeyboardPressState?: boolean;
  /**
   * Style for the container wrapping the component. Static, or a callback
   * receiving `{ focused, pressed }`. See {@link ContainerStyle}.
   */
  containerStyle?: ContainerStyle<ViewStyleType>;
  /** Style applied to the container while focused. */
  containerFocusStyle?: FocusStyle;
  /** Ref to the wrapped component instance. */
  componentRef?: React.Ref<ViewType | ViewInstance>;
  /**
   * Style for the wrapped component. Static/array, or a callback receiving
   * `{ focused, pressed }` — e.g. `style={(s) => (s.focused ? … : …)}`.
   */
  style?: InteractiveStyleProp;
  /** Called when the component loses keyboard focus. */
  onBlur?: (() => void) | null;
  /** Called when the component gains keyboard focus. */
  onFocus?: (() => void) | null;
};

/**
 * The keyboard-focus-specific props added by {@link WithKeyboardFocusProps}: container
 * styling, refs, focus callbacks, and the mutually-exclusive `renderContent` /
 * `renderFocusable` slot.
 */
export type WithKeyboardProps<
  ViewType = ViewInstance,
  ViewStyleType = unknown,
  ComponentProps extends object = {},
> = WithKeyboardBaseProps<ViewType, ViewStyleType> & RenderSlot<ComponentProps>;

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
  ViewType = ViewInstance,
> = KeyboardPressType<ComponentProps> &
  KeyboardFocusBaseProps &
  WithKeyboardProps<ViewType, ViewStyleType, ComponentProps>;

/**
 * Full prop type for a `withKeyboardFocus`-wrapped component: the wrapped component's
 * own props, with the library's press/focus/order props merged in (library props win
 * on conflict).
 */
export type WithKeyboardFocusProps<
  ComponentProps extends object,
  ViewStyleType,
  ViewType = ViewInstance,
> = MergeProps<
  ComponentProps,
  KeyboardFocusOverrideProps<ComponentProps, ViewStyleType, ViewType>
>;

/** {@link WithKeyboardFocusProps} plus a `ref` exposing the {@link KeyboardFocus} handle. */
export type WithKeyboardFocusPropsWithRef<
  ComponentProps extends object,
  ViewStyleType,
  ViewType = ViewInstance,
> = WithKeyboardFocusProps<ComponentProps, ViewStyleType, ViewType> &
  RefAttributes<KeyboardFocus>;

/** Type of the component returned by `withKeyboardFocus`. */
export type KeyboardFocusableComponentDeclaration<
  ComponentProps extends object,
  ViewStyleType,
  ViewType = ViewInstance,
> = React.JSXElementConstructor<
  WithKeyboardFocusPropsWithRef<ComponentProps, ViewStyleType, ViewType>
>;
