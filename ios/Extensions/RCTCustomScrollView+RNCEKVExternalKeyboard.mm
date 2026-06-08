//
//  RCTCustomScrollView+RNCEKVExternalKeyboard.m
//  react-native-external-keyboard
//
//  Created by Artur Kalach on 12/08/2025.
//
#ifndef RCT_NEW_ARCH_ENABLED

#import "RCTScrollView.h"
#import "RNCEKVSwizzleInstanceMethod.h"

static void RNCEKVRCTScrollViewSwizzle(void) {
  RNCEKVSwizzleInstanceMethod([RCTScrollView class], @selector(initWithEventDispatcher:), @selector(rncekvInitWithEventDispatcher:));
}

@implementation RCTScrollView (RNCEKVExternalKeyboard)

RNCEKV_INSTALL_SWIZZLES(RNCEKVRCTScrollViewSwizzle)

- (instancetype)rncekvInitWithEventDispatcher:(CGRect)frame {
  RCTScrollView *rctView = [self rncekvInitWithEventDispatcher:frame];
  
  if (@available(iOS 17.0, *)) {
    rctView.scrollView.allowsKeyboardScrolling = YES;
  }
  
  return rctView;
}


@end

#endif
