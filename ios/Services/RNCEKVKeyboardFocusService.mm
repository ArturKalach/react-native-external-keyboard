//
//  RNCEKVKeyboardFocusService.mm
//  react-native-external-keyboard
//
//  Created by Artur Kalach on 05/06/2026.
//

#import <Foundation/Foundation.h>
#import "RNCEKVKeyboardFocusService.h"
#import "RNCEKVGroupIdentifierProtocol.h"
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
  if (!view) {
    return;
  }

  UIWindow *window = RCTKeyWindow();
  if (window && window.rootViewController) {
    [window.rootViewController rncekvFocusView:view];
  }
}

+ (BOOL)usesIndividualFocusGroup:(UIView *)view {
  if (![view conformsToProtocol:@protocol(RNCEKVGroupIdentifierProtocol)]) return NO;
  id<RNCEKVGroupIdentifierProtocol> grouping = (id<RNCEKVGroupIdentifierProtocol>)view;
  return grouping.uniqueGroupIdentifierEnabled && grouping.customGroupId == nil;
}

typedef NS_ENUM(NSInteger, RNCEKVFocusSearch) {
  RNCEKVFocusSearchUnknown,
  RNCEKVFocusSearchItems,  // Ctrl+Tab
  RNCEKVFocusSearchGroups, // Tab
};

/// Which search UIKit ran for this move, from its private `_focusMovement._groupFilter`: 0 for Ctrl+Tab, 2 for Tab
/// (seen on device). Unknown when the field is missing, holds another value, or cannot be read.
+ (RNCEKVFocusSearch)focusSearchOf:(UIFocusUpdateContext *)context {
  @try {
    id filter = [(NSObject *)context valueForKeyPath:@"_focusMovement._groupFilter"];
    if (![filter isKindOfClass:[NSNumber class]]) return RNCEKVFocusSearchUnknown;
    switch ([(NSNumber *)filter integerValue]) {
      case 0: return RNCEKVFocusSearchItems;
      case 2: return RNCEKVFocusSearchGroups;
      default: return RNCEKVFocusSearchUnknown;
    }
  } @catch (NSException *exception) {
    return RNCEKVFocusSearchUnknown;
  }
}

+ (BOOL)isOrderMove:(UIFocusUpdateContext *)context forView:(UIView *)view {
  RNCEKVFocusSearch search = [self focusSearchOf:context];
  // Unknown (the field is gone or changed): the order takes both keys, as before they were told apart.
  if (search == RNCEKVFocusSearchUnknown) return YES;

  BOOL isTab = search == RNCEKVFocusSearchGroups;
  return [self usesIndividualFocusGroup:view] ? isTab : !isTab;
}

@end
