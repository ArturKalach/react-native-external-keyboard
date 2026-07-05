//
//  RNCEKVHaloDelegate.mm
//  react-native-external-keyboard
//
//  Created by Artur Kalach on 24/01/2025.
//

#import <Foundation/Foundation.h>

#import "RNCEKVFocusEffectUtility.h"
#import "RNCEKVHaloDelegate.h"

// Builds (and caches) the keyboard focus halo from the view's explicit halo props
// — `haloCornerRadius`, `haloExpendX`, `haloExpendY`. The radius is an input, not
// observed off the layer, so there is no stable-radius tracking and no re-arm loop.
@implementation RNCEKVHaloDelegate {
  UIView<RNCEKVHaloProtocol> *_delegate;
  UIFocusEffect *_currentEffect;
  BOOL _isDirty;
  CGRect _prevBounds;
  CGFloat _prevRadius;
}

- (instancetype _Nonnull)initWithView:(UIView<RNCEKVHaloProtocol> *_Nonnull)delegate {
  self = [super init];
  if (self) {
    _delegate = delegate;
    _currentEffect = nil;
    _isDirty = YES;
    _prevBounds = CGRectZero;
    _prevRadius = -1;
  }
  return self;
}

- (UIFocusEffect *)focusEffect API_AVAILABLE(ios(15.0)) {
  if (_delegate.isHaloHidden) {
    return [RNCEKVFocusEffectUtility emptyFocusEffect];
  }

  UIView *focusingView = [_delegate getFocusTargetView];
  CGFloat cornerRadius = _delegate.haloCornerRadius;

  // No explicit halo customization: let UIKit draw its own default halo, which
  // tracks the focused view's bounds (and its own corner radius) for free.
  BOOL hasCustomSettings = _delegate.haloExpendX || _delegate.haloExpendY || cornerRadius;
  if (!hasCustomSettings) {
    return nil;
  }

  // Rebuild only when the geometry/radius the rounded-rect depends on changed, or a
  // halo prop changed (`invalidate`). Expansion changes arrive via `invalidate`.
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

- (void)invalidate {
  _isDirty = YES;
}

- (void)clear {
  _currentEffect = nil;
  _isDirty = YES;
  _prevBounds = CGRectZero;
  _prevRadius = -1;
}

@end
