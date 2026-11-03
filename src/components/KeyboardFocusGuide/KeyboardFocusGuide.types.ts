import type { ViewProps } from 'react-native';

/**
 * A mode the guide operates in. Read it as "guide in <mode> redirects to <target>":
 * - `'keyboard'`: hardware-keyboard arrow keys and Tab. The guide stays hidden from screen readers.
 * - `'arrows'`: hardware-keyboard arrow keys only; Tab passes over the guide.
 * - `'screen-reader'`: VoiceOver / TalkBack focus. The guide becomes a screen-reader element that moves
 *   focus on to the target. On iOS it is silent (its label and children are not read); on Android
 *   TalkBack reads its label or text, so leave them out for a silent guide.
 *   iOS limit: VoiceOver reaches the target only when it handles the move (about 0.8 s in tests), and a
 *   swipe made before that continues from the guide, not from the target. TalkBack moves at once.
 */
export type KeyboardFocusGuideMode = 'keyboard' | 'arrows' | 'screen-reader';

/**
 * The guide must have a non-zero size (for an invisible one, use `height: 1` and a transparent
 * background): a zero-size view cannot take keyboard focus, so it would never redirect.
 */
export type KeyboardFocusGuideProps = ViewProps & {
  /** `orderId` of the view that receives keyboard focus when focus moves into the guide. */
  to?: string;
  /** Turn the redirect on/off. Defaults to `true`. */
  enabled?: boolean;
  /**
   * Which mode(s) to redirect: one value or a list, e.g. `['keyboard', 'screen-reader']`.
   * Defaults to `'keyboard'`.
   */
  guide?: KeyboardFocusGuideMode | KeyboardFocusGuideMode[];
  /** Order group of the target. Defaults to the surrounding `KeyboardOrderFocusGroup`. */
  orderGroup?: string;
};
