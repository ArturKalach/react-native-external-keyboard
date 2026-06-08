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

@end

#endif /* RNCEKVKeyboardFocusService_h */
