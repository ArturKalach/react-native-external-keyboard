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
}

- (instancetype _Nonnull)initWithView:(UIView<RNCEKVHaloProtocol> *_Nonnull)delegate {
  self = [super init];
  if (self) {
    _delegate = delegate;
    _currentEffect = nil;
    _isDirty = YES;
    _prevBounds = CGRectZero;
  }
  return self;
}

- (UIFocusEffect *)focusEffect {
  if (_delegate.isHaloHidden) {
    return [RNCEKVFocusEffectUtility emptyFocusEffect];
  }

  BOOL hasCustomSettings = _delegate.haloExpendX || _delegate.haloExpendY || _delegate.haloCornerRadius;
  if (!hasCustomSettings) {
    return nil;
  }

  UIView *focusingView = [_delegate getFocusTargetView];
  BOOL boundsChanged = !CGRectEqualToRect(_prevBounds, focusingView.bounds);

  if (_isDirty || boundsChanged) {
    _isDirty = NO;
    _prevBounds = focusingView.bounds;

    _currentEffect = [RNCEKVFocusEffectUtility getFocusEffect:focusingView
                                                withExpandedX:_delegate.haloExpendX
                                                withExpandedY:_delegate.haloExpendY
                                             withCornerRadius:_delegate.haloCornerRadius];
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
}

@end
