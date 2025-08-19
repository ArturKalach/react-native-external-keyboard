//
//  RCTCustomScrollView+RNCEKVExternalKeyboard.m
//  react-native-external-keyboard
//
//  Created by Artur Kalach on 12/08/2025.
//
#ifndef RCT_NEW_ARCH_ENABLED

#import "RCTScrollView.h"
#import "RNCEKVSwizzleInstanceMethod.h"

@implementation RCTScrollView (RNCEKVExternalKeyboard)

+ (void)load {
  static dispatch_once_t onceToken;
  dispatch_once(&onceToken, ^{
    RNCEKVSwizzleInstanceMethod([self class], @selector(initWithEventDispatcher:), @selector(rncekvInitWithEventDispatcher:));
  });
}

- (instancetype)rncekvInitWithEventDispatcher:(CGRect)frame {
  RCTScrollView *rctView = [self rncekvInitWithEventDispatcher:frame];
  
  if (@available(iOS 17.0, *)) {
    rctView.scrollView.allowsKeyboardScrolling = YES;
  }
  
  return rctView;
}


@end

#endif
