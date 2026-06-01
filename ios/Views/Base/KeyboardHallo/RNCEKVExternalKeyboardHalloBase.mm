//
//  RNCEKVExternakKeyboardHalloBase.m
//  react-native-external-keyboard
//
//  Created by Artur Kalach on 08/04/2026.
//

#import <Foundation/Foundation.h>

#import "RNCEKVHaloDelegate.h"
#import "RNCEKVExternalKeyboardHalloBase.h"

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

- (UIFocusEffect*)focusEffect {
  if (!self.focusableWrapper) {
    UIFocusEffect* effect = [self customFocusEffect];
    if(effect != nil) {
      return effect;
    }
  }

  return [super focusEffect];
}

- (void)layoutSubviews {
  [super layoutSubviews];

  if (!self.roundedHaloFix) {
    return;
  }

  UIFocusEffect* effect = [self focusEffect];
  self.focusEffect = effect;
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
  [_haloDelegate invalidate];
}

- (void)setHaloCornerRadius:(CGFloat)haloCornerRadius {
  _haloCornerRadius = haloCornerRadius;
  [_haloDelegate invalidate];
}

- (void)setHaloExpendX:(CGFloat)haloExpendX {
  _haloExpendX = haloExpendX;
  [_haloDelegate invalidate];
}

- (void)setHaloExpendY:(CGFloat)haloExpendY {
  _haloExpendY = haloExpendY;
  [_haloDelegate invalidate];
}

- (void)setRoundedHaloFix:(BOOL)roundedHaloFix {
  _roundedHaloFix = roundedHaloFix;
  [_haloDelegate invalidate];
}

#ifdef RCT_NEW_ARCH_ENABLED
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
