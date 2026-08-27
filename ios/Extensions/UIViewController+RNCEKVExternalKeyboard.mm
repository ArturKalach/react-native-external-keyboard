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

@interface RNCEKVWeakFocusViewHolder : NSObject
@property (nonatomic, weak) UIView *view;
@end

@implementation RNCEKVWeakFocusViewHolder
@end

@implementation UIViewController (RNCEKVExternalKeyboard)

RNCEKV_INSTALL_SWIZZLES(RNCEKVUIViewControllerSwizzle)

- (UIView *)rncekvCustomFocusView {
  RNCEKVWeakFocusViewHolder *holder = objc_getAssociatedObject(self, &kCustomFocusViewKey);
  return holder.view;
}

- (void)setRncekvCustomFocusView:(UIView *)customFocusView {
  RNCEKVWeakFocusViewHolder *holder = nil;
  if (customFocusView != nil) {
    holder = [RNCEKVWeakFocusViewHolder new];
    holder.view = customFocusView;
  }
  objc_setAssociatedObject(self, &kCustomFocusViewKey, holder, OBJC_ASSOCIATION_RETAIN_NONATOMIC);
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

  RNCEKVWeakFocusViewHolder *holder = objc_getAssociatedObject(self, &kCustomFocusViewKey);
  if (holder == nil) {
    return originalEnvironments;
  }

  UIView *customFocusView = holder.view;
  if (customFocusView == nil || customFocusView.window == nil) {
    self.rncekvCustomFocusView = nil;
    return originalEnvironments;
  }

  NSMutableArray *focusEnvironments = [originalEnvironments mutableCopy];
  [focusEnvironments insertObject:customFocusView atIndex:0];
  return focusEnvironments;
}


@end
