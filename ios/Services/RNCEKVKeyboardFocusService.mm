//
//  RNCEKVKeyboardFocusService.mm
//  react-native-external-keyboard
//
//  Created by Artur Kalach on 05/06/2026.
//

#import <Foundation/Foundation.h>
#import "RNCEKVKeyboardFocusService.h"
#import "UIViewController+RNCEKVExternalKeyboard.h"
#import <React/RCTUtils.h>

@implementation RNCEKVKeyboardFocusService

+ (UIView *)getFocusedItem:(id<UIFocusEnvironment>)environment {
  if (!environment) {
    return nil;
  }

  @try {
    UIFocusSystem *focusSystem = [UIFocusSystem focusSystemForEnvironment:environment];
    if (![focusSystem.focusedItem isKindOfClass:[UIView class]]) {
      return nil;
    }

    return (UIView *)focusSystem.focusedItem;
  } @catch (NSException *exception) {
    return nil;
  }
}

+ (void)updatePreferredFocusEnvironment:(UIView *)view {
  if (!view) {
    return;
  }

  UIWindow *window = RCTKeyWindow();
  if (window && window.rootViewController) {
    window.rootViewController.rncekvCustomFocusView = view;
  }
}

+ (void)focus:(UIView *)view {
  [self focus:view withFallback:nil];
}

+ (UIViewController *)focus:(UIView *)view withFallback:(UIViewController *)controller {
  if (!view) {
    return nil;
  }

  UIViewController *targetController = view.window.rootViewController
      ?: RCTKeyWindow().rootViewController
      ?: controller;
  [targetController rncekvFocusView:view];
  return targetController;
}

@end
