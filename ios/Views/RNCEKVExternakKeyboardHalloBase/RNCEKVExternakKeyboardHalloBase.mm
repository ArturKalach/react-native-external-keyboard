//
//  RNCEKVExternakKeyboardHalloBase.m
//  react-native-external-keyboard
//
//  Created by Artur Kalach on 08/04/2026.
//

#import <Foundation/Foundation.h>

#import "RNCEKVHaloDelegate.h"
#import "RNCEKVExternakKeyboardHalloBase.h"

@implementation RNCEKVExternakKeyboardHalloBase {
  RNCEKVHaloDelegate *_haloDelegate;
}

- (instancetype)initWithFrame:(CGRect)frame
{
  if (self = [super initWithFrame:frame]) {
    _haloDelegate = [[RNCEKVHaloDelegate alloc] initWithView:self];
  }
  
  return self;
}

- (void)cleanReferences {
  [super cleanReferences];
  [_haloDelegate clear];
  _isHaloActive = @2; // ToDo RNCEKV-0
  _haloExpendX = 0;
  _haloExpendY = 0;
  _haloCornerRadius = 0;
}

// ToDo RNCEKV-8 review and find better place for halo calculation
- (void)layoutSubviews {
  [super layoutSubviews];
  [_haloDelegate displayHalo];
}

- (void)setIsHaloActive:(NSNumber *_Nullable)isHaloActive {
  _isHaloActive = isHaloActive;
  [_haloDelegate displayHalo];
}

- (void)setHaloCornerRadius:(CGFloat)haloCornerRadius {
  _haloCornerRadius = haloCornerRadius;
  if (self.window) {
    [_haloDelegate updateHalo];
  }
}

- (void)setHaloExpendX:(CGFloat)haloExpendX {
  _haloExpendX = haloExpendX;
  if (self.window) {
    [_haloDelegate updateHalo];
  }
}

- (void)setHaloExpendY:(CGFloat)haloExpendY {
  _haloExpendY = haloExpendY;
  if (self.window) {
    [_haloDelegate updateHalo];
  }
}

@end
