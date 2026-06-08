//
//  RNCEKVExternakKeyboardHalloBase.m
//  react-native-external-keyboard
//
//  Created by Artur Kalach on 08/04/2026.
//

#import <Foundation/Foundation.h>

#import "RNCEKVHaloDelegate.h"
#import "RNCEKVExternalKeyboardHalloBase.h"

// See CLAUDE.md in this directory for the full rationale (RN's cornerRadius
// toggle, the pinned custom halo, the delayed re-arm and loop guard).

#ifdef RCT_NEW_ARCH_ENABLED
  #import <React/RCTConversions.h>

// invalidateLayer is private to RCTViewComponentView; forward-declare so the
// override and its [super] call compile cleanly.
@interface RNCEKVBaseViewClass (RNCEKVInvalidateLayer)
- (void)invalidateLayer;
@end
#endif

// Delay before re-arming, to win UIKit's same-pass default halo (see CLAUDE.md).
static const NSTimeInterval RNCEKVHaloRearmDelay = 0.02;

@implementation RNCEKVExternalKeyboardHalloBase {
  RNCEKVHaloDelegate *_haloDelegate;
  BOOL _rearmScheduled;       // a flush is already pending
  // Dedup signature — re-arm only when one of these changed (breaks the loop).
  CGRect _lastArmedBounds;
  CGFloat _lastArmedRadius;
  BOOL _lastArmedFocused;
  CGFloat _stableLayerRadius; // last non-zero cornerRadius (RN toggles it to 0)
  BOOL _forceRearm;           // a halo prop changed — re-arm even if geometry didn't
}

- (instancetype)initWithFrame:(CGRect)frame
{
  if (self = [super initWithFrame:frame]) {
    _haloDelegate = [[RNCEKVHaloDelegate alloc] initWithView:self];
  }

  return self;
}

- (UIFocusEffect*)customFocusEffect  API_AVAILABLE(ios(15.0)){
  return _haloDelegate.focusEffect;
}

- (UIFocusEffect*)focusEffect API_AVAILABLE(ios(15.0)) {
  // Hidden views must return our empty effect even when wrapper, or the system
  // default ring leaks through (see CLAUDE.md).
  if (!self.focusableWrapper || self.isHaloHidden) {
    UIFocusEffect* effect = [self customFocusEffect];
    if(effect != nil) {
      return effect;
    }
  }

  return [super focusEffect];
}



- (void)layoutSubviews {
  [super layoutSubviews];

  if(!self.isHaloHidden && !self.roundedHaloFix) return;

  [self observeStableRadius];
  [self setNeedsHaloRearm];
}

- (UIView *)rearmTarget {
  return (self.focusableWrapper && self.subviews.count > 0)
    ? self.subviews.firstObject
    : self;
}

// Cache the last non-zero corner radius so the delegate pins the halo to it,
// not to the transient 0 RN sets mid-pass (see CLAUDE.md).
- (void)observeStableRadius {
  CGFloat radius = [self getFocusTargetView].layer.cornerRadius;
  if (radius > 0) {
    _stableLayerRadius = radius;
    [_haloDelegate observeCornerRadius:radius];
  }
}

// Coalesce a burst of passes into one delayed re-arm (see CLAUDE.md).
- (void)setNeedsHaloRearm {
  if (_rearmScheduled) return;
  _rearmScheduled = YES;

  __weak __typeof(self) weakSelf = self;
  dispatch_after(dispatch_time(DISPATCH_TIME_NOW, (int64_t)(RNCEKVHaloRearmDelay * NSEC_PER_SEC)),
                 dispatch_get_main_queue(), ^{
    [weakSelf flushHaloRearm];
  });
}

- (void)flushHaloRearm {
  _rearmScheduled = NO;

  UIView *target = [self rearmTarget];
  BOOL focused = target.isFocused;

  // The halo only renders on the focused view; skip the rest otherwise.
  if (!focused) {
    _lastArmedFocused = NO;
    return;
  }

  // Skip when the signature is unchanged — this is what stops the re-arm from
  // feeding itself (see CLAUDE.md). Key on the stable radius, never the live one.
  CGRect bounds = target.bounds;
  CGFloat radius = _stableLayerRadius;
  if (!_forceRearm &&
      _lastArmedFocused &&
      CGRectEqualToRect(bounds, _lastArmedBounds) &&
      radius == _lastArmedRadius) {
    return;
  }

  _forceRearm = NO;
  _lastArmedBounds = bounds;
  _lastArmedRadius = radius;
  _lastArmedFocused = YES;

  // Re-arm: read focusEffect and write it back to force UIKit to repaint.
  if (@available(iOS 15.0, *)) {
    target.focusEffect = target.focusEffect;
  }
}

- (void)cleanReferences {
  [super cleanReferences];
  [_haloDelegate clear];
  _rearmScheduled = NO;
  _lastArmedBounds = CGRectZero;
  _lastArmedRadius = 0;
  _lastArmedFocused = NO;
  _stableLayerRadius = 0;
  _forceRearm = NO;
  _isHaloHidden = false;
  _haloExpendX = 0;
  _haloExpendY = 0;
  _haloCornerRadius = 0;
  _roundedHaloFix = false;
}


// A halo prop changed: force a re-arm even if geometry didn't move (see CLAUDE.md).
- (void)haloAppearanceChanged {
  [_haloDelegate invalidate];
  _forceRearm = YES;
  [self setNeedsHaloRearm];
}

- (void)setIsHaloHidden:(BOOL)isHaloHidden {
  _isHaloHidden = isHaloHidden;
  [self haloAppearanceChanged];
}

- (void)setHaloCornerRadius:(CGFloat)haloCornerRadius {
  _haloCornerRadius = haloCornerRadius;
  [self haloAppearanceChanged];
}

- (void)setHaloExpendX:(CGFloat)haloExpendX {
  _haloExpendX = haloExpendX;
  [self haloAppearanceChanged];
}

- (void)setHaloExpendY:(CGFloat)haloExpendY {
  _haloExpendY = haloExpendY;
  [self haloAppearanceChanged];
}

- (void)setRoundedHaloFix:(BOOL)roundedHaloFix {
  _roundedHaloFix = roundedHaloFix;
  [self haloAppearanceChanged];
}

#ifdef RCT_NEW_ARCH_ENABLED


- (void)invalidateLayer {
  [super invalidateLayer]; // must run first — RN sets the layer here

  if (!self.isHaloHidden && !self.roundedHaloFix) return;

  // Catches the cornerRadius/style repaints layoutSubviews doesn't (see CLAUDE.md).
  [self observeStableRadius];
  [self setNeedsHaloRearm];
}

- (void)updateHaloProps:(const RNCEKV::HaloProps &)oldProps
               newProps:(const RNCEKV::HaloProps &)newProps {
  if (_isHaloHidden == newProps.haloEffect) {
    [self setIsHaloHidden: !newProps.haloEffect];
  }

  if (oldProps.haloExpendX != newProps.haloExpendX) {
    [self setHaloExpendX:newProps.haloExpendX];
  }

  if (oldProps.haloExpendY != newProps.haloExpendY) {
    [self setHaloExpendY:newProps.haloExpendY];
  }

  if (oldProps.haloCornerRadius != newProps.haloCornerRadius) {
    [self setHaloCornerRadius:newProps.haloCornerRadius];
  }

  if (self.roundedHaloFix != newProps.roundedHaloFix) {
    [self setRoundedHaloFix:newProps.roundedHaloFix];
  }

  UIColor *newColor = RCTUIColorFromSharedColor(newProps.tintColor);
  BOOL renewColor = newColor != nil && self.tintColor == nil;
  BOOL isColorChanged = oldProps.tintColor != newProps.tintColor;
  if (isColorChanged || renewColor) {
    self.tintColor = RCTUIColorFromSharedColor(newProps.tintColor);
  }
}
#endif

@end
