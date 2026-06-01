import type { Int32 } from 'react-native/Libraries/Types/CodegenTypes';

/**
 * Directions in which keyboard focus movement can be locked via {@link CommonFocusProps.lockFocus}.
 *
 * - `Up` / `Down` / `Left` / `Right` — block directional (arrow / DPad) movement.
 * - `Forward` / `Backward` — block `Tab` and `Shift + Tab` movement.
 * - `First` / `Last` — block jumping to the first / last focusable element.
 */
export enum LockFocusEnum {
  Up = 'up',
  Down = 'down',
  Right = 'right',
  Left = 'left',
  Forward = 'forward',
  Backward = 'backward',
  First = 'first',
  Last = 'last',
}

/** String-literal form of {@link LockFocusEnum} — `'up' | 'down' | 'left' | …`. */
export type LockFocusType = `${LockFocusEnum}`;

/**
 * Link-based focus ordering props. Each `order*` target names the {@link FocusOrderProps.orderId orderId}
 * of the element that should receive focus when moving in that direction.
 *
 * > `orderId` values are global. In repeated content (lists, cards) duplicate IDs cause
 * > incorrect focus jumps — namespace them with `orderPrefix` or a `KeyboardOrderFocusGroup`.
 */
export type FocusOrderProps = {
  /** Unique ID used as the link target for other elements' `order*` props. */
  orderId?: string;
  /** ID of the target focused when navigating left. */
  orderLeft?: string;
  /** ID of the target focused when navigating right. */
  orderRight?: string;
  /** ID of the target focused when navigating upward. */
  orderUp?: string;
  /** ID of the target focused when navigating downward. */
  orderDown?: string;
  /** ID of the target focused on forward navigation (`Tab`). */
  orderForward?: string;
  /** ID of the target focused on backward navigation (`Shift + Tab`). */
  orderBackward?: string;
  /** ID of the target focused when jumping to the first element. `null` clears the link. */
  orderFirst?: string | null;
  /** ID of the target focused when jumping to the last element. `null` clears the link. */
  orderLast?: string | null;
  /** Name of the group for index-based focus ordering. Pair with {@link FocusOrderProps.orderIndex orderIndex}. */
  orderGroup?: string;
  /** Position of this element within its {@link FocusOrderProps.orderGroup orderGroup}; lower indices are focused first. */
  orderIndex?: Int32;
  /**
   * Prefix prepended to this component's `orderId` and all `order*` target IDs.
   * Use it to namespace IDs in repeated components (lists, cards) so global IDs stay unique.
   */
  orderPrefix?: string;
};
