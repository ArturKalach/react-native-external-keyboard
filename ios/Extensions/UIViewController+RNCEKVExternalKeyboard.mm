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

static void RNCEKVUIViewControllerSwizzle(void) {
  RNCEKVSwizzleInstanceMethod([UIViewController class], @selector(viewDidAppear:), @selector(keyboardedViewDidAppear:));
  RNCEKVSwizzleInstanceMethod([UIViewController class], @selector(preferredFocusEnvironments), @selector(keyboardedPreferredFocusEnvironments));
}

@implementation UIViewController (RNCEKVExternalKeyboard)

RNCEKV_INSTALL_SWIZZLES(RNCEKVUIViewControllerSwizzle)

- (UIView *)rncekvCustomFocusView {
  return objc_getAssociatedObject(self, &kCustomFocusViewKey);
}

- (void)setRncekvCustomFocusView:(UIView *)customFocusView {
  objc_setAssociatedObject(self, &kCustomFocusViewKey, customFocusView, OBJC_ASSOCIATION_RETAIN_NONATOMIC);
}

- (void)keyboardedViewDidAppear:(BOOL)animated {
  [self keyboardedViewDidAppear:animated];
  [[NSNotificationCenter defaultCenter] postNotificationName:@"ViewControllerChangedNotification" object:self];
}

- (void)rncekvFocusView:(UIView *)view {
  self.rncekvCustomFocusView = view;
  dispatch_async(dispatch_get_main_queue(), ^{
    [self setNeedsFocusUpdate];
    [self updateFocusIfNeeded];
  });
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
