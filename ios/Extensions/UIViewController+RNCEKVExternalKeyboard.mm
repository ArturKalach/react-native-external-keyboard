//
//  UIViewController+RNCEKVExternalKeyboard.m
//  CocoaAsyncSocket
//
//  Created by Artur Kalach on 06/10/2024.
//

#import <Foundation/Foundation.h>

#import "UIViewController+RNCEKVExternalKeyboard.h"
#import "RNCEKVSwizzleInstanceMethod.h"
#import <objc/runtime.h>




static char kCustomFocusViewKey;

@implementation UIViewController (RNCEKVExternalKeyboard)

- (UIView *)rncekvCustomFocusView {
  return objc_getAssociatedObject(self, &kCustomFocusViewKey);
}

- (void)setRncekvCustomFocusView:(UIView *)customFocusView {
  objc_setAssociatedObject(self, &kCustomFocusViewKey, customFocusView, OBJC_ASSOCIATION_RETAIN_NONATOMIC);
}

+ (void)load
{
    static dispatch_once_t once_token;

    dispatch_once(&once_token, ^{
      RNCEKVSwizzleInstanceMethod([self class], @selector(viewDidAppear:), @selector(keyboardedViewDidAppear:));
      RNCEKVSwizzleInstanceMethod([self class], @selector(preferredFocusEnvironments), @selector(keyboardedPreferredFocusEnvironments));
    });
}

- (void)keyboardedViewDidAppear:(BOOL)animated {
  [self keyboardedViewDidAppear:animated];
  [[NSNotificationCenter defaultCenter] postNotificationName:@"ViewControllerChangedNotification" object:self];
}

- (NSArray<id<UIFocusEnvironment>> *)keyboardedPreferredFocusEnvironments {
  NSArray<id<UIFocusEnvironment>> *originalEnvironments = [self keyboardedPreferredFocusEnvironments];

  NSMutableArray *focusEnvironments = [originalEnvironments mutableCopy];

  UIView *customFocusView = self.rncekvCustomFocusView;
  if (customFocusView) {
    [focusEnvironments insertObject:customFocusView atIndex:0];
  }

  return focusEnvironments;
}


@end
