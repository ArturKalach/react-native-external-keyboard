//
//  RNCEKVFocusService.h
//  react-native-external-keyboard
//
//  Screen-reader (VoiceOver) focus tracking: one shared `UIAccessibilityElementFocusedNotification`
//  observer that notifies subscribed views. Not keyboard focus, see `RNCEKVKeyboardFocusService` for that.
//  Twin of react-native-a11y's `RCA11yFocusService`.
//

#ifndef RNCEKVFocusService_h
#define RNCEKVFocusService_h

#import <UIKit/UIKit.h>

@protocol RNCEKVFocusServiceSubscriber <NSObject>
- (void)accessibilityElementDidBecomeFocused:(UIView*)view;
- (void)accessibilityElementDidUnfocused:(UIView*)view;
@end

@interface RNCEKVFocusService : NSObject

/// The view that had VoiceOver focus before the current one, nil until focus has moved once.
@property (nonatomic, weak, readonly, nullable) UIView *previousFocusedView;

+ (instancetype)sharedService;

/// The accessibility element VoiceOver treats as `view`: itself, or the nearest ancestor that is one.
+ (UIView *)accessibilityElementFor:(UIView *)view;

/// Moves VoiceOver focus to `view`'s accessibility element.
- (void)focus:(UIView *)view;
- (void)subscribe:(UIView<RNCEKVFocusServiceSubscriber> *)subscriber;
- (void)unsubscribe:(UIView<RNCEKVFocusServiceSubscriber> *)subscriber;
@end

#endif /* RNCEKVFocusService_h */
