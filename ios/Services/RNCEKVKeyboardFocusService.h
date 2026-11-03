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

/// Whether a Next / Previous update belongs to the keyboard order of `view`.
/// Tab and Ctrl+Tab both report Next / Previous, and the context has no public modifier flags, so the key is read
/// from the search UIKit ran (private: groups for Tab, items for Ctrl+Tab). The order takes Tab when `view` is its
/// own focus group (`uniqueGroupIdentifier` without `groupIdentifier`), Ctrl+Tab otherwise. When the search cannot
/// be read, the order takes both keys.
+ (BOOL)isOrderMove:(UIFocusUpdateContext *)context forView:(UIView *)view;

@end

#endif /* RNCEKVKeyboardFocusService_h */
