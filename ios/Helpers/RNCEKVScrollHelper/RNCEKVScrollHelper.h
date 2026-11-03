//
//  RNCEKVScrollHelper.h
//  react-native-external-keyboard
//
//  Visibility and scrolling of a view inside the scroll views around it.
//

#ifndef RNCEKVScrollHelper_h
#define RNCEKVScrollHelper_h

#import <UIKit/UIKit.h>

NS_ASSUME_NONNULL_BEGIN

@interface RNCEKVScrollHelper : NSObject

/// Whether `view` is fully inside every scroll view around it, excluding areas under content insets.
/// A view without scroll view ancestors counts as visible.
+ (BOOL)isFullyVisible:(UIView *)view;

/// Animates every scroll view around `view` (innermost first) so `view` plus `margin` is visible.
/// A scroll view that already shows that area stays put.
+ (void)scrollIntoView:(UIView *)view margin:(CGFloat)margin;

@end

NS_ASSUME_NONNULL_END

#endif /* RNCEKVScrollHelper_h */
