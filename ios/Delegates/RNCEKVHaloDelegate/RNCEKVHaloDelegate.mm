//
//  RNCEKVHaloDelegate.mm
//  react-native-external-keyboard
//
//  Created by Artur Kalach on 24/01/2025.
//

#import <Foundation/Foundation.h>

#import "RNCEKVFocusEffectUtility.h"
#import "RNCEKVHaloDelegate.h"

#ifdef RCT_NEW_ARCH_ENABLED
#import "RCTViewComponentView+RNCEKVExternalKeyboard.h"
#endif

@implementation RNCEKVHaloDelegate {
  UIView<RNCEKVHaloProtocol> *_delegate;
  UIFocusEffect *_currentEffect;
  BOOL _isDirty;
  CGRect _prevBounds;
  CGFloat _prevRadius;
  // Last non-zero layer.cornerRadius we observed. RN's invalidateLayer toggles
  // the live cornerRadius between the styled value and 0 (its two border-render
  // paths); we pin the halo to this stable value so it stops following the 0.
  CGFloat _stableRadius;
}

- (instancetype _Nonnull)initWithView:(UIView<RNCEKVHaloProtocol> *_Nonnull)delegate {
  self = [super init];
  if (self) {
    _delegate = delegate;
    _currentEffect = nil;
    _isDirty = YES;
    _prevBounds = CGRectZero;
    _prevRadius = -1;
    _stableRadius = 0;
  }
  return self;
}

- (UIFocusEffect *)focusEffect API_AVAILABLE(ios(15.0)) {
  if (_delegate.isHaloHidden) {
    return [RNCEKVFocusEffectUtility emptyFocusEffect];
  }

  UIView *focusingView = [_delegate getFocusTargetView];

  // Track the view's intended corner radius, ignoring the transient 0 RN sets
  // while it draws the image-based border. The view also feeds us this value
  // from its layout passes (see -observeCornerRadius:), so by the time UIKit
  // queries the effect _stableRadius is already correct even if RN happens to
  // have the live radius at 0 right now.
  [self observeCornerRadius:focusingView.layer.cornerRadius];

  // Explicit haloCornerRadius wins; otherwise pin to the view's stable radius.
  CGFloat cornerRadius = _delegate.haloCornerRadius > 0 ? _delegate.haloCornerRadius
                                                        : _stableRadius;

  // With roundedHaloFix on we always supply our own halo (a fixed rounded rect)
  // rather than returning nil and falling back to the system halo — that system
  // halo follows the squared layer, which is what caused the blink and the
  // square/"default" halo.
  BOOL hasCustomSettings = _delegate.haloExpendX || _delegate.haloExpendY || _delegate.haloCornerRadius;
  if (!hasCustomSettings && !_delegate.roundedHaloFix) {
    return nil;
  }

  BOOL boundsChanged = !CGRectEqualToRect(_prevBounds, focusingView.bounds);
  BOOL radiusChanged = _prevRadius != cornerRadius;

  if (_isDirty || boundsChanged || radiusChanged) {
    _isDirty = NO;
    _prevBounds = focusingView.bounds;
    _prevRadius = cornerRadius;

    _currentEffect = [RNCEKVFocusEffectUtility getFocusEffect:focusingView
                                                withExpandedX:_delegate.haloExpendX
                                                withExpandedY:_delegate.haloExpendY
                                             withCornerRadius:cornerRadius];
  }

  return _currentEffect;
}

- (void)observeCornerRadius:(CGFloat)radius {
  // Remember the last non-zero radius so the transient 0 from RN's image-border
  // path never reaches the halo.
  if (radius > 0 && radius != _stableRadius) {
    _stableRadius = radius;
    _isDirty = YES; // force the effect to be rebuilt at the new radius
  }
}

- (void)invalidate {
  _isDirty = YES;
}

- (void)clear {
  _currentEffect = nil;
  _isDirty = YES;
  _prevBounds = CGRectZero;
  _prevRadius = -1;
  _stableRadius = 0;
}

@end
