/** App-wide settings. Set once at startup with `Keyboard.configure`. */
export type ExternalKeyboardConfig = {
  /**
   * iOS: generate a unique `focusGroupIdentifier` for every focusable view of this library
   * that has no `groupIdentifier`, so each view is its own keyboard focus group (the
   * pre-0.14 behavior). `false` (default) follows the native iOS grouping.
   *
   * @default false
   * @platform ios
   */
  uniqueGroupIdentifier?: boolean;
};

const config: Required<ExternalKeyboardConfig> = {
  uniqueGroupIdentifier: false,
};

/**
 * Sets app-wide defaults. Call it once, before the first render (e.g. in `index.js`).
 * It is a plain module setting, so it also covers portals and extra React roots that
 * `K.GroupIdentifierProvider` cannot reach. It does not re-render mounted views.
 */
export const configure = (next: ExternalKeyboardConfig) => {
  if (next.uniqueGroupIdentifier !== undefined) {
    config.uniqueGroupIdentifier = next.uniqueGroupIdentifier;
  }
};

export const getUniqueGroupIdentifier = () => config.uniqueGroupIdentifier;
