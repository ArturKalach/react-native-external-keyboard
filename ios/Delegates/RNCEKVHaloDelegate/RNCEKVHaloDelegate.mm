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
  CGFloat _prevHaloExpendX;
  CGFloat _prevHaloExpendY;
  CGFloat _prevHaloCornerRadius;
  CGRect _prevBounds;
  BOOL _needsApply;
}

- (instancetype _Nonnull)initWithView:(UIView<RNCEKVHaloProtocol> *_Nonnull)delegate {
  self = [super init];
  if (self) {
    _delegate = delegate;
    _currentEffect = nil;
    _prevBounds = CGRectZero;
    _prevHaloExpendX = 0;
    _prevHaloExpendY = 0;
    _prevHaloCornerRadius = 0;
    _needsApply = YES;
  }
  return self;
}

#pragma mark - Public

// Called on attach/recycle: forces re-application even if the effect didn't change.
- (void)displayHalo:(BOOL)force {
  if (force) {
    _currentEffect = nil;
    _needsApply = YES;
  }
  [self displayHalo];
}

- (void)displayHalo {
  if (@available(iOS 15.0, *)) {
    UIView *focusingView = [_delegate getFocusTargetView];
    UIFocusEffect *prevEffect = _currentEffect;

    if ([self isHaloHidden]) {
      _currentEffect = [RNCEKVFocusEffectUtility emptyFocusEffect];
    } else {
      [self recomputeCustomEffectIfNeededForView:focusingView];
    }

    BOOL effectChanged = prevEffect != _currentEffect;
    BOOL pendingNilApply = _currentEffect == nil && _needsApply;
    BOOL alreadyApplied = !pendingNilApply && focusingView.focusEffect == _currentEffect;

    if (pendingNilApply || (effectChanged && !alreadyApplied)) {
      _needsApply = NO;
      [self applyEffect:_currentEffect toView:focusingView];
    }
  }
}

// Called when halo settings change after mount (expandX/Y, cornerRadius).
- (void)updateHalo {
  [self displayHalo];
}

- (void)clear {
  [self applyEffect:nil toView:[_delegate getFocusTargetView]];
  _currentEffect = nil;
  _needsApply = YES;
  _prevBounds = CGRectZero;
  _prevHaloExpendX = 0;
  _prevHaloExpendY = 0;
  _prevHaloCornerRadius = 0;
}

#pragma mark - Private

- (BOOL)isHaloHidden {
  return [[_delegate isHaloActive] isEqual:@NO];
}

- (void)recomputeCustomEffectIfNeededForView:(UIView *)focusingView {
  BOOL hasCustomSettings = _delegate.haloExpendX || _delegate.haloExpendY || _delegate.haloCornerRadius;
  if (!hasCustomSettings) return;

  BOOL boundsChanged = !CGRectEqualToRect(_prevBounds, focusingView.bounds);
  BOOL settingsChanged = _prevHaloExpendX != _delegate.haloExpendX
      || _prevHaloExpendY != _delegate.haloExpendY
      || _prevHaloCornerRadius != _delegate.haloCornerRadius
      || boundsChanged;

  if (!settingsChanged) return;

  _prevHaloExpendX = _delegate.haloExpendX;
  _prevHaloExpendY = _delegate.haloExpendY;
  _prevHaloCornerRadius = _delegate.haloCornerRadius;
  _prevBounds = focusingView.bounds;

  _currentEffect = [RNCEKVFocusEffectUtility getFocusEffect:focusingView
                                              withExpandedX:_delegate.haloExpendX
                                              withExpandedY:_delegate.haloExpendY
                                           withCornerRadius:_delegate.haloCornerRadius];
}

- (void)applyEffect:(UIFocusEffect *)effect toView:(UIView *)focusingView {
  if (!focusingView) return;
  if (@available(iOS 15.0, *)) {
#ifdef RCT_NEW_ARCH_ENABLED
    if ([focusingView isKindOfClass:RCTViewComponentView.class]) {
      ((RCTViewComponentView *)focusingView).rncekvCustomFocusEffect = effect;
    } else {
      focusingView.focusEffect = effect;
    }
#else
    focusingView.focusEffect = effect;
#endif
  }
}

@end
