//
//  RNCEKVKeyboardFocusService.h
//  react-native-external-keyboard
//
//  Created by Artur Kalach on 05/06/2026.
//

#ifndef RNCEKVKeyboardFocusService_h
#define RNCEKVKeyboardFocusService_h

#import <UIKit/UIKit.h>

/// Public entry point for driving the UIKit focus engine from custom native code.
/// All methods are static — this service holds no state.
@interface RNCEKVKeyboardFocusService : NSObject

/// Returns the view currently focused inside the given focus environment, or nil.
+ (UIView *)getFocusedItem:(id<UIFocusEnvironment>)environment;

/// Marks a view as the preferred focus environment without forcing a focus update.
+ (void)updatePreferredFocusEnvironment:(UIView *)view;

/// Moves keyboard focus to the given view on the next focus update.
+ (void)focus:(UIView *)view;

/// Like `focus:`, but resolves the routing controller as: the target view's own
/// window root first (UIKit honors a focus update only when the environment it is
/// requested on contains the currently focused item, and only the target's own
/// scene is guaranteed to contain the target), then the key-window root for
/// not-yet-attached targets, then the supplied fallback. Returns the controller
/// the request was routed to, or nil when nothing was routed.
+ (UIViewController *)focus:(UIView *)view withFallback:(UIViewController *)controller;

@end

#endif /* RNCEKVKeyboardFocusService_h */
