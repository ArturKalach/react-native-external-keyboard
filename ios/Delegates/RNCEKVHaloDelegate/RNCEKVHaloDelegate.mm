//
//  RNCEKVHaloDelegate.mm
//  react-native-external-keyboard
//
//  Created by Artur Kalach on 24/01/2025.
//

#import <Foundation/Foundation.h>

#import "RNCEKVFocusEffectUtility.h"
#import "RNCEKVHaloDelegate.h"

@implementation RNCEKVHaloDelegate {
  UIView<RNCEKVHaloProtocol> *_delegate;
  UIFocusEffect *_focusEffect;
  CGFloat _prevHaloExpendX;
  CGFloat _prevHaloExpendY;
  CGFloat _prevHaloCornerRadius;
  CGRect _prevBounds;
  BOOL _recycled;
}

- (instancetype _Nonnull)initWithView:
    (UIView<RNCEKVHaloProtocol> *_Nonnull)delegate {
  self = [super init];
  if (self) {
    _delegate = delegate;
    _focusEffect = nil;
    _prevBounds = CGRect();
    _prevHaloExpendX = 0;
    _prevHaloExpendY = 0;
    _prevHaloCornerRadius = 0;
    _recycled = true;
  }
  return self;
}

- (BOOL)isHaloHidden {
  NSNumber *isHaloActive = [_delegate isHaloActive];
  return [isHaloActive isEqual:@NO];
}

- (void)displayHalo {
  if (@available(iOS 15.0, *)) {
    UIView *focusingView = [_delegate getFocusTargetView];
    UIFocusEffect *prevEffect = _focusEffect;

    BOOL isHidden = [self isHaloHidden];

    if (isHidden) {
      _focusEffect = [RNCEKVFocusEffectUtility emptyFocusEffect];
    }

    BOOL hasHaloSettings = _delegate.haloExpendX || _delegate.haloExpendY ||
                           _delegate.haloCornerRadius;
    BOOL isDifferentBounds =
        !CGRectEqualToRect(_prevBounds, focusingView.bounds);
    BOOL isDifferent = _prevHaloExpendX != _delegate.haloExpendX ||
                       _prevHaloExpendY != _delegate.haloExpendY ||
                       _prevHaloCornerRadius != _delegate.haloCornerRadius ||
                       isDifferentBounds;

    // ToDo refactor for better halo setup RNCEKV-7, RNCEKV-8
    if (!isHidden && hasHaloSettings && isDifferent) {
      _prevHaloExpendX = _delegate.haloExpendX;
      _prevHaloExpendY = _delegate.haloExpendY;
      _prevHaloCornerRadius = _delegate.haloCornerRadius;
      _prevBounds = focusingView.bounds;

      _focusEffect =
          [RNCEKVFocusEffectUtility getFocusEffect:focusingView
                                     withExpandedX:_delegate.haloExpendX
                                     withExpandedY:_delegate.haloExpendY
                                  withCornerRadius:_delegate.haloCornerRadius];
    }

    if ((_focusEffect == nil && _recycled) || (_focusEffect != nil && prevEffect != _focusEffect &&
        focusingView.focusEffect != _focusEffect)) {
      _recycled = false;
      focusingView.focusEffect = _focusEffect;
    }
  }
}

- (void)updateHalo {
  if ([self isHaloHidden])
    return;
  if (@available(iOS 15.0, *)) {
    BOOL shouldUpdate = _delegate.haloExpendX || _delegate.haloExpendY ||
                        _delegate.haloCornerRadius;
    if (!shouldUpdate)
      return;

    UIView *focusingView = [_delegate getFocusTargetView];
    UIFocusEffect *focusEffect =
        [RNCEKVFocusEffectUtility getFocusEffect:focusingView
                                   withExpandedX:_delegate.haloExpendX
                                   withExpandedY:_delegate.haloExpendY
                                withCornerRadius:_delegate.haloCornerRadius];

    focusingView.focusEffect = focusEffect;
  }
}

- (void) clear {
  UIView *focusingView = [_delegate getFocusTargetView];
  focusingView.focusEffect = nil;
  _focusEffect = nil;
  _recycled = true;
  _prevBounds = CGRect();
  _prevHaloExpendX = 0;
  _prevHaloExpendY = 0;
  _prevHaloCornerRadius = 0;
}

@end
