//
//  RNCEKVScrollHelper.mm
//  react-native-external-keyboard
//

#import "RNCEKVScrollHelper.h"

// Longer than the 0.25s default so a jump across a long list stays readable.
static const NSTimeInterval kRNCEKVScrollDuration = 0.75;

@implementation RNCEKVScrollHelper

/// Innermost first, with `view`'s frame in each scroll view's content coordinates; `NO` stops.
+ (void)enumerateScrollViewsAround:(UIView *)view
                         withBlock:(BOOL (^)(UIScrollView *scrollView, CGRect rect))block
{
  for (UIView *ancestor = view.superview; ancestor; ancestor = ancestor.superview) {
    if (![ancestor isKindOfClass:[UIScrollView class]]) continue;
    UIScrollView *scrollView = (UIScrollView *)ancestor;
    if (!block(scrollView, [scrollView convertRect:view.bounds fromView:view])) return;
  }
}

/// The on-screen part of the content, excluding areas under content insets (navigation or tab bar).
+ (CGRect)visibleRectOfScrollView:(UIScrollView *)scrollView
{
  return UIEdgeInsetsInsetRect(scrollView.bounds, scrollView.adjustedContentInset);
}

+ (BOOL)isFullyVisible:(UIView *)view
{
  __block BOOL visible = YES;
  [self enumerateScrollViewsAround:view withBlock:^BOOL(UIScrollView *scrollView, CGRect rect) {
    visible = CGRectContainsRect([self visibleRectOfScrollView:scrollView], rect);
    return visible;
  }];
  return visible;
}

+ (void)animateScrollToView:(UIView *)view margin:(CGFloat)margin
{
  // Animated through a `UIView` block: `scrollRectToVisible:animated:YES` is overridden by the engine's
  // scroll and stops short. `scrollRectToVisible:` is kept for its inset and clamping math.
  [UIView animateWithDuration:kRNCEKVScrollDuration
                        delay:0
                      options:UIViewAnimationOptionCurveEaseOut | UIViewAnimationOptionBeginFromCurrentState |
                              UIViewAnimationOptionAllowUserInteraction
                   animations:^{
    [self enumerateScrollViewsAround:view withBlock:^BOOL(UIScrollView *scrollView, CGRect rect) {
      [scrollView scrollRectToVisible:CGRectInset(rect, -margin, -margin) animated:NO];
      return YES;
    }];
  } completion:nil];
}

+ (void)scrollIntoView:(UIView *)view margin:(CGFloat)margin
{
  // One run-loop turn later: the engine starts its scroll to the guide right after
  // `didUpdateFocusInContext:` returns, and only a scroll started after it can cancel and replace it.
  __weak UIView *weakView = view;
  dispatch_async(dispatch_get_main_queue(), ^{
    UIView *target = weakView;
    if (target) [self animateScrollToView:target margin:margin];
  });
}

@end
