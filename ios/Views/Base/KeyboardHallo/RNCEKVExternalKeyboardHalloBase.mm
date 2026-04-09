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

- (UIFocusEffect*)customFocusEffect {
  return [_haloDelegate getHalo];
}

- (void)cleanReferences {
  [super cleanReferences];
  [_haloDelegate clear];
  _isHaloHidden = false;
//  _isHaloActive = @2; // ToDo RNCEKV-0
  _haloExpendX = 0;
  _haloExpendY = 0;
  _haloCornerRadius = 0;
}

// ToDo RNCEKV-8 review and find better place for halo calculation
//- (void)layoutSubviews {
//  [super layoutSubviews];
////  [_haloDelegate displayHalo];
//}

- (void)setIsHaloHidden:(BOOL)isHaloHidden {
  _isHaloHidden = isHaloHidden;
//  [_haloDelegate displayHalo];
}

- (void)setHaloCornerRadius:(CGFloat)haloCornerRadius {
  _haloCornerRadius = haloCornerRadius;
//  if (self.window) {
//    [_haloDelegate updateHalo];
//  }
}

- (void)setHaloExpendX:(CGFloat)haloExpendX {
  _haloExpendX = haloExpendX;
//  if (self.window) {
//    [_haloDelegate updateHalo];
//  }
}

- (void)setHaloExpendY:(CGFloat)haloExpendY {
  _haloExpendY = haloExpendY;
//  if (self.window) {
////    [_haloDelegate updateHalo];
//  }
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
  
  UIColor *newColor = RCTUIColorFromSharedColor(newProps.tintColor);
  BOOL renewColor = newColor != nil && self.tintColor == nil;
  BOOL isColorChanged = oldProps.tintColor != newProps.tintColor;
  if (isColorChanged || renewColor) {
    self.tintColor = RCTUIColorFromSharedColor(newProps.tintColor);
  }
}

@end
