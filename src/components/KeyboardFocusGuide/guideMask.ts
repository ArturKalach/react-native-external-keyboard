/* eslint-disable no-bitwise -- bit flags are sent to native as one integer */
import type { KeyboardFocusGuideMode } from './KeyboardFocusGuide.types';

/**
 * Bit flags sent to native as one integer (`guideMask`). Keep in sync with
 * `GuideMask.java` (Android) and `RNCEKVGuideMask.h` (iOS).
 */
export const GUIDE_MASK = {
  ARROWS: 1,
  TAB: 2,
  SCREEN_READER: 4,
} as const;

const INPUT_MASK: Record<KeyboardFocusGuideMode, number> = {
  'arrows': GUIDE_MASK.ARROWS,
  'keyboard': GUIDE_MASK.ARROWS | GUIDE_MASK.TAB,
  'screen-reader': GUIDE_MASK.SCREEN_READER,
};

/** `keyboard`: arrow keys and Tab. */
export const DEFAULT_GUIDE_MASK = INPUT_MASK.keyboard;

/**
 * Merges one mode or a list of modes into the native mask. Unknown values are skipped; an empty list
 * gives 0 (no redirect).
 */
export const toGuideMask = (
  guide: KeyboardFocusGuideMode | readonly KeyboardFocusGuideMode[]
): number => {
  const modes = typeof guide === 'string' ? [guide] : guide;
  let mask = 0;
  for (const mode of modes) mask |= INPUT_MASK[mode] ?? 0;
  return mask;
};
