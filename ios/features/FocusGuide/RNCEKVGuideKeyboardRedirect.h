//
//  RNCEKVGuideKeyboardRedirect.h
//  react-native-external-keyboard
//
//  Redirects hardware-keyboard focus through the focusable host. Arrows-only and mixed screen-reader
//  modes also use a native `UIFocusGuide`.
//

#ifndef RNCEKVGuideKeyboardRedirect_h
#define RNCEKVGuideKeyboardRedirect_h

#import <UIKit/UIKit.h>
#import "RNCEKVGuideHost.h"

NS_ASSUME_NONNULL_BEGIN

@interface RNCEKVGuideKeyboardRedirect : NSObject

- (instancetype)initWithHost:(UIView<RNCEKVGuideHost> *)host;

/// Keeps a native arrow guide only for arrows-only or mixed screen-reader modes with a linked target.
- (void)updateLayoutGuide;

/// Tab: not a candidate when Tab is not redirected, nor while focus is inside the target
/// (the guide and its target are one stop).
- (BOOL)canHostBecomeFocused;

/// YES if a move onto the host was cancelled and sent to the target. Not cancelled with the target off screen: the
/// move may land on the guide, see `handleFocusDidLand`.
- (BOOL)shouldRedirectInContext:(UIFocusUpdateContext *)context;

/// The move landed on the host (target off screen): hand focus on to the target.
- (void)handleFocusDidLandInContext:(UIFocusUpdateContext *)context;

@end

NS_ASSUME_NONNULL_END

#endif /* RNCEKVGuideKeyboardRedirect_h */
