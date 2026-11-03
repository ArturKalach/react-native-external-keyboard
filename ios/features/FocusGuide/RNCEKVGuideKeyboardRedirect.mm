//
//  RNCEKVGuideKeyboardRedirect.mm
//  react-native-external-keyboard
//

#import "RNCEKVGuideKeyboardRedirect.h"
#import "RNCEKVFocusGuideHelper.h"
#import "RNCEKVKeyboardFocusService.h"
#import "RNCEKVScrollHelper.h"

// The focus effect and container border extend past the focusable view, so scroll a bit further.
static const CGFloat kRNCEKVScrollMargin = 16;

@implementation RNCEKVGuideKeyboardRedirect {
  __weak UIView<RNCEKVGuideHost> *_host;
  UIFocusGuide *_guide;
}

- (instancetype)initWithHost:(UIView<RNCEKVGuideHost> *)host
{
  if (self = [super init]) {
    _host = host;
  }
  return self;
}

#pragma mark - Native UIFocusGuide (arrows)

/// Arrows-only and mixed screen-reader modes retain native guide redirection and scrolling.
- (void)updateLayoutGuide
{
  UIView<RNCEKVGuideHost> *host = _host;
  UIView *target = host.linkTarget;
  // A keyboard-only host already handles arrows and Tab; an overlapping native guide adds duplicate targets.
  BOOL needsNativeGuide =
      [host.maskPolicy hasFlag:RNCEKVGuideMaskArrows] &&
      (![host.maskPolicy hasFlag:RNCEKVGuideMaskTab] || host.maskPolicy.hasScreenReader);
  if (!host || !target || !host.guideEnabled || !needsNativeGuide) {
    if (_guide) {
      [host removeLayoutGuide:_guide];
      _guide = nil;
    }
    return;
  }
  if (_guide) {
    _guide.preferredFocusEnvironments = @[target];
    return;
  }
  _guide = [RNCEKVFocusGuideHelper createGuideWithView:host focusView:target enabled:YES];
  [NSLayoutConstraint activateConstraints:@[
    [_guide.topAnchor constraintEqualToAnchor:host.topAnchor],
    [_guide.bottomAnchor constraintEqualToAnchor:host.bottomAnchor],
    [_guide.leadingAnchor constraintEqualToAnchor:host.leadingAnchor],
    [_guide.trailingAnchor constraintEqualToAnchor:host.trailingAnchor],
  ]];
}

#pragma mark - Focus (host)

/// The host handles Tab and, without a native guide, arrow moves too.
- (BOOL)canHostBecomeFocused
{
  UIView<RNCEKVGuideHost> *host = _host;
  UIView *target = host.linkTarget;
  if (!host.guideEnabled || !target || ![host.maskPolicy redirectsTab:UIAccessibilityIsVoiceOverRunning()]) {
    return NO;
  }
  UIView *focused = [RNCEKVKeyboardFocusService getFocusedItem:host];
  return !(focused && [focused isDescendantOfView:target]);
}

/// Moves onto the guide are cancelled and sent to the target, so the guide never shows as focused.
/// Exception: with the target off screen the move may land on the guide. Cancelling makes the engine
/// skip ahead and flash the next element while the target scrolls into view, whereas landing on the
/// guide (next to the target) lets the engine scroll first; `handleFocusDidLandInContext:` then moves on.
- (BOOL)shouldRedirectInContext:(UIFocusUpdateContext *)context
{
  UIView<RNCEKVGuideHost> *host = _host;
  UIView *target = host.linkTarget;
  if (context.nextFocusedItem == host && target && [RNCEKVScrollHelper isFullyVisible:target]) {
    [self focusTarget:target scrollIntoView:NO];
    return YES;
  }
  return NO;
}

- (void)handleFocusDidLandInContext:(UIFocusUpdateContext *)context
{
  UIView<RNCEKVGuideHost> *host = _host;
  UIView *target = host.linkTarget;
  if (context.nextFocusedItem == host && target) {
    [self focusTarget:target scrollIntoView:YES];
  }
}

/// The engine scrolls native `UIFocusGuide` redirects but not this programmatic focus update, so the
/// scroll is done here.
- (void)focusTarget:(UIView *)item scrollIntoView:(BOOL)scrollIntoView
{
  if (scrollIntoView) {
    [RNCEKVScrollHelper scrollIntoView:item margin:kRNCEKVScrollMargin];
  }
  [RNCEKVKeyboardFocusService focus:item];
}

@end
