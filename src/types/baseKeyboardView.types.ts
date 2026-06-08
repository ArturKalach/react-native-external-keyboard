import type { ViewProps, ColorValue } from 'react-native';
import type { OnFocusChangeFn } from './focus.types';
import type { OnKeyPressFn } from './keyPress.types';
import type { FocusOrderProps, LockFocusType } from './focusOrder.types';

/** Focus props shared by every keyboard-focusable component. */
export type CommonFocusProps = {
  /** Whether the component can receive keyboard focus. Defaults to `true`. */
  focusable?: boolean;
  /**
   * Enables the halo highlight ring drawn around the component on focus.
   *
   * @platform ios
   */
  haloEffect?: boolean;
  /**
   * Keeps a disabled halo (`haloEffect={false}`) suppressed on views that have
   * a `borderRadius`. UIKit re-arms the halo from the view's
   * `layer.cornerRadius` (set by RN from `borderRadius`) on every layout pass,
   * so the halo can reappear after being disabled; this watches layout changes
   * and resets the focus effect each pass. Only takes effect when
   * `haloEffect={false}`. Alternatively, move `borderRadius` to `containerStyle`
   * so the focused view itself stays square.
   *
   * @platform ios
   */
  roundedHaloFix?: boolean;
  /** Color used to tint the component on focus. */
  tintColor?: ColorValue;
  /**
   * iOS `focusGroupIdentifier` — the identifier of the focus group this view belongs to.
   *
   * @platform ios
   */
  groupIdentifier?: string;
  /** Directions in which focus movement is locked. See {@link LockFocusType}. */
  lockFocus?: LockFocusType[];
  /**
   * Enables Android's default focus highlight for the focused native view.
   *
   * @platform android
   * @default true
   */
  defaultFocusHighlightEnabled?: boolean;
  /**
   * Cross-platform focus highlight mode. `'none'` disables the focus highlight
   * entirely — the iOS halo and the Android default highlight — equivalent to
   * `haloEffect={false}` / `defaultFocusHighlightEnabled={false}`. `'default'`
   * (the default) keeps the platform highlight.
   *
   * @default 'default'
   */
  tintType?: 'default' | 'none';
};

export type BaseFocusViewProps = {
  /** Treats the view as a transparent focus wrapper rather than a focusable target itself. */
  focusableWrapper?: boolean;
  /** Called when the component gains or loses keyboard focus. */
  onFocusChange?: OnFocusChangeFn;
  /** Handler for the physical key-up event. */
  onKeyUpPress?: OnKeyPressFn;
  /** Handler for the physical key-down event. */
  onKeyDownPress?: OnKeyPressFn;
  /**
   * Handler for long-press events triggered by the context-menu command.
   *
   * @platform ios
   */
  onContextMenuPress?: () => void;
  /**
   * Bubbling variant of {@link BaseFocusViewProps.onContextMenuPress} — fires for
   * context-menu presses that bubble up from descendants.
   *
   * @platform ios
   */
  onBubbledContextMenuPress?: () => void;
  /** Whether the component should automatically gain focus on mount. */
  autoFocus?: boolean;
  /** Called when the component gains keyboard focus. */
  onFocus?: () => void;
  /** Called when the component loses keyboard focus. */
  onBlur?: () => void;
  /**
   * Corner radius of the halo ring, in points.
   *
   * @platform ios
   */
  haloCornerRadius?: number;
  /**
   * Horizontal expansion of the halo ring beyond the view bounds, in points.
   *
   * @platform ios
   */
  haloExpendX?: number;
  /**
   * Vertical expansion of the halo ring beyond the view bounds, in points.
   *
   * @platform ios
   */
  haloExpendY?: number;
  /** Enables the context-menu interaction on the view. */
  enableContextMenu?: boolean;
  /** Enables moving screen reader focus to this component automatically. */
  screenAutoA11yFocus?: boolean;
  /**
   * Delay before screen reader auto-focus is applied. On Android focus can only be
   * applied after render, which may take 300–500 ms.
   *
   * @platform android
   * @default 300
   */
  screenAutoA11yFocusDelay?: number;
  /**
   * @deprecated No longer has any effect — kept only for backwards compatibility.
   */
  enableA11yFocus?: boolean;
} & CommonFocusProps &
  FocusOrderProps;

/** Props for `BaseKeyboardView` — standard `ViewProps` plus all focus props. */
export type BaseKeyboardViewProps = ViewProps & BaseFocusViewProps;
