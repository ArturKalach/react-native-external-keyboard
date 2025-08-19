//
//  RCTEnhancedScrollView+RNCEKVExternalKeyboard.mm
//  react-native-external-keyboard
//
//  Created by Artur Kalach on 09/08/2025.
//


#ifdef RCT_NEW_ARCH_ENABLED

#import "RCTEnhancedScrollView.h"
#import "RNCEKVSwizzleInstanceMethod.h"

@implementation RCTEnhancedScrollView (RNCEKVExternalKeyboard)

- (NSArray<id<UIFocusEnvironment>> *)preferredFocusEnvironments {
  if(self.subviews.count) {
    return @[self.subviews[0]];
  }
  return [super preferredFocusEnvironments];
}

+ (void)load {
  static dispatch_once_t onceToken;
  dispatch_once(&onceToken, ^{
    RNCEKVSwizzleInstanceMethod([self class], @selector(initWithFrame:), @selector(rncekvInitWithFrame:));
  });
}

- (instancetype)rncekvInitWithFrame:(CGRect)frame {
  RCTEnhancedScrollView *scrollView = [self rncekvInitWithFrame:frame];
  
  if (@available(iOS 17.0, *)) {
    scrollView.allowsKeyboardScrolling = YES;
  }
  
  return scrollView;
}


@end

#endif
