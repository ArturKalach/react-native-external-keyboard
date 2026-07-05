//
//  RNCEKVExternakKeyboardHalloBase.m
//  react-native-external-keyboard
//
//  Created by Artur Kalach on 08/04/2026.
//

#import <Foundation/Foundation.h>

#import "RNCEKVHaloDelegate.h"
#import "RNCEKVExternalKeyboardHalloBase.h"

// See CLAUDE.md in this directory for the full rationale.

#ifdef RCT_NEW_ARCH_ENABLED
#import <React/RCTConversions.h>
#endif

@implementation RNCEKVExternalKeyboardHalloBase {
  RNCEKVHaloDelegate *_haloDelegate;
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
  // default ring leaks through.
  if (!self.focusableWrapper || self.isHaloHidden) {
    UIFocusEffect* effect = [self customFocusEffect];
    if(effect != nil) {
      return effect;
    }
  }

  return [super focusEffect];
}

// The halo is fully pull-based: UIKit queries `focusEffect` at focus-update time and
// the delegate computes it from the focus target's current bounds/radius. With no
// explicit halo props the delegate returns nil and UIKit's default halo tracks the
// view's own borderRadius/borderWidth. So a prop change only needs to invalidate the
// delegate's cache — the next query rebuilds; there is nothing to re-apply on layout.
- (void)haloAppearanceChanged {
  [_haloDelegate invalidate];
}

- (void)cleanReferences {
  [super cleanReferences];
  [_haloDelegate clear];
  _isHaloHidden = false;
  _haloExpendX = 0;
  _haloExpendY = 0;
  _haloCornerRadius = 0;
  _roundedHaloFix = false;
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

#ifdef RCT_NEW_ARCH_ENABLED

- (void)updateHaloProps:(const RNCEKV::HaloProps &)oldProps
               newProps:(const RNCEKV::HaloProps &)newProps {
  // Guard every halo param against the current INSTANCE STATE, not `oldProps`.
  // Fabric recycles views, and `-cleanReferences` resets these ivars to 0 — but
  // `_props` (hence `oldProps`) is NOT reset on recycle. A view reused for a
  // component with the SAME halo props would see `oldProps == newProps`, skip the
  // setter, and stay stuck at the reset value (e.g. haloCornerRadius 0 → a square
  // halo). Comparing to the ivar re-applies the real value after recycle. This
  // matches `_isHaloHidden` here and every check in `updateFocusProps`.
  if (_isHaloHidden == newProps.haloEffect) {
    [self setIsHaloHidden: !newProps.haloEffect];
  }

  if (_haloExpendX != newProps.haloExpendX) {
    [self setHaloExpendX:newProps.haloExpendX];
  }

  if (_haloExpendY != newProps.haloExpendY) {
    [self setHaloExpendY:newProps.haloExpendY];
  }

  if (_haloCornerRadius != newProps.haloCornerRadius) {
    [self setHaloCornerRadius:newProps.haloCornerRadius];
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
