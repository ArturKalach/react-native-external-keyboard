//
//  RCTEnhancedScrollView+RNCEKVExternalKeyboard.mm
//  react-native-external-keyboard
//
//  Created by Artur Kalach on 09/08/2025.
//


#ifdef RCT_NEW_ARCH_ENABLED

#import "RCTEnhancedScrollView.h"
#import "RNCEKVSwizzleInstanceMethod.h"
#import "RCTScrollViewComponentView.h"

static void RNCEKVEnhancedScrollViewSwizzle(void) {
  RNCEKVSwizzleInstanceMethod([RCTEnhancedScrollView class], @selector(initWithFrame:), @selector(rncekvInitWithFrame:));
}

@implementation RCTEnhancedScrollView (RNCEKVExternalKeyboard)

RNCEKV_INSTALL_SWIZZLES(RNCEKVEnhancedScrollViewSwizzle)

- (NSArray<id<UIFocusEnvironment>> *)preferredFocusEnvironments {
  @try {
    BOOL isScrollViewComponent = self.superview &&
    [self.superview isKindOfClass:[RCTScrollViewComponentView class]];

    if (isScrollViewComponent) {
      RCTScrollViewComponentView *scrollViewComponent = (RCTScrollViewComponentView *)self.superview;
      return @[scrollViewComponent.containerView];
    }
  }
  @catch (NSException *exception) {
  }

  return [super preferredFocusEnvironments];
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
