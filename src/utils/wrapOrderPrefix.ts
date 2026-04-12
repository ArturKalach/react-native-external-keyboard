type Wrap = (id: string | undefined) => string | undefined;

const withPrefix =
  (prefix: string): Wrap =>
  (id) =>
    id ? `${prefix}_${id}` : undefined;

const identity: Wrap = (id) => id;

/**
 * Returns a function that prepends `prefix` to an order ID.
 * When `prefix` is empty the identity function is returned — no
 * per-call branch needed.
 */
export const wrapOrderPrefix = (prefix: string): Wrap =>
  prefix ? withPrefix(prefix) : identity;
