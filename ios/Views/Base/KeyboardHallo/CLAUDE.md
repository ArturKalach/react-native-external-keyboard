# CLAUDE.md — KeyboardHallo (focus halo base)

Guidance for `RNCEKVExternalKeyboardHalloBase`, the base class that owns the iOS
focus **halo** (the highlight UIKit draws around the focused view). Read with the
parent [ios/CLAUDE.md](../../../CLAUDE.md). The actual effect is built by
[RNCEKVHaloDelegate](../../../Delegates/RNCEKVHaloDelegate/) — this base only
decides *when* to (re)apply it.

## The core problem: RN flip-flops `layer.cornerRadius`

`RCTViewComponentView.invalidateLayer` has **two border-render paths**
(`useCoreAnimationBorderRendering`):

- **CA path** (uniform radius, no visible border): sets `layer.cornerRadius` to
  the styled value.
- **Image-border path** (a visible/non-uniform border, e.g. a `focusStyle`
  border on focus): sets `layer.cornerRadius = 0` and draws the border into a
  sublayer.

On an affected view RN **alternates these every layout pass**, so the live
`cornerRadius` oscillates (e.g. 12↔0). A system halo follows that → it blinks
square↔round; and when our delegate returned `nil` it fell back to the squared
system default halo ("default ring" / "blink"). The system halo also derives its
shape from the live layer, so we cannot out-run the toggle by chasing it.

## The fix (current approach)

1. **Pin a custom effect.** With `roundedHaloFix` on, `RNCEKVHaloDelegate` always
   returns its own `UIFocusHaloEffect` (never `nil`) built at the **last non-zero**
   radius (`_stableRadius`). UIKit draws that explicit rounded rect and ignores
   `layer.cornerRadius` — so the toggle can't deform or default the halo.
2. **Observe the radius continuously.** `observeStableRadius` reads
   `getFocusTargetView.layer.cornerRadius` synchronously in **both**
   `layoutSubviews` and `invalidateLayer` (they run regardless of focus) and feeds
   the non-zero value to the delegate via `observeCornerRadius:`. So the stable
   radius is correct *before* UIKit ever queries the effect — the timing fix for
   the intermittent "square/default halo".
3. **Delay + coalesce the re-arm.** A re-arm is `target.focusEffect =
   target.focusEffect` (forces UIKit to re-query). UIKit applies its *own* default
   halo during the focus/layout pass, so a same-pass write **loses** — we
   `dispatch_after` ~`RNCEKVHaloRearmDelay` (20 ms) to let it settle, then ours
   wins. `_rearmScheduled` folds a burst of passes into one flush.
4. **Dedup to break the self-feeding loop.** The re-arm write re-dirties the view
   → schedules another flush. `flushHaloRearm` skips when the signature
   `(bounds, stable radius, focused)` is unchanged, so the follow-up flush stops.
   Keying on the **stable** radius (not the live one) is essential — the live 0
   would never match and would re-arm forever.
5. **`_forceRearm` for prop changes.** A halo prop change (e.g. `roundedHaloFix`,
   `haloCornerRadius`) may not move geometry, so the dedup would swallow it.
   `haloAppearanceChanged` sets `_forceRearm` to bypass the signature once.
6. **Hide reliably.** When `isHaloHidden` (`haloEffect={false}`), `focusEffect`
   returns our empty effect **even for `focusableWrapper` views** — otherwise it
   falls through to `[super focusEffect]` = the stray system ring.

## Conventions / gotchas

- **iOS 15+.** `UIFocusEffect` / `focusEffect` are iOS 15.0+. Every method whose
  signature touches them carries `API_AVAILABLE(ios(15.0))`; call sites reachable
  on older OS (e.g. from `layoutSubviews`) use `if (@available(iOS 15.0, *))`.
- **`invalidateLayer` is a private RN method** (defined only in
  `RCTViewComponentView.mm`). It's forward-declared in the `.mm` so the override
  compiles without warning; always call `[super invalidateLayer]` first. New-Arch
  only (`#ifdef RCT_NEW_ARCH_ENABLED`); the legacy path relies on `layoutSubviews`.
- **Recycling.** All re-arm state (`_rearmScheduled`, the `_lastArmed*` signature,
  `_stableLayerRadius`, `_forceRearm`) resets in `cleanReferences`.
- **Tuning.** If 20 ms ever loses the race on slow interactions, bump
  `RNCEKVHaloRearmDelay`.
- **Known split.** `flushHaloRearm` arms `rearmTarget` while `observeStableRadius`
  reads `getFocusTargetView`; identical for normal views, they only diverge for the
  TextInput wrapper. Left split intentionally — unify only with a wrapper re-test.
