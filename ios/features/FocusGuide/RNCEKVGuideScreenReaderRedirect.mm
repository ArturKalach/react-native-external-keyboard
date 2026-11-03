//
//  RNCEKVGuideScreenReaderRedirect.mm
//  react-native-external-keyboard
//

#import "RNCEKVGuideScreenReaderRedirect.h"
#import "RNCEKVFocusService.h"

@implementation RNCEKVGuideScreenReaderRedirect {
  __weak UIView<RNCEKVGuideHost> *_host;
}

- (instancetype)initWithHost:(UIView<RNCEKVGuideHost> *)host
{
  if (self = [super init]) {
    _host = host;
  }
  return self;
}

- (void)redirectIfNeeded
{
  UIView<RNCEKVGuideHost> *host = _host;
  UIView *target = host.linkTarget;
  if (!host || !host.guideEnabled || !target ||
      ![host.maskPolicy redirectsScreenReader:UIAccessibilityIsVoiceOverRunning()]) {
    return;
  }

  UIView *targetElement = [RNCEKVFocusService accessibilityElementFor:target];
  if ([[RNCEKVFocusService sharedService].previousFocusedView isDescendantOfView:targetElement]) return;

  // Posted once, on the next main-loop turn (out of the focus notification VoiceOver is still delivering). Not delayed
  // or repeated: every post restarts VoiceOver's wait before it moves, which is already ~800ms (traced on device).
  // Until then VoiceOver is still on the guide, so a swipe made meanwhile continues from the guide (documented limit).
  __weak UIView *weakTargetElement = targetElement;
  dispatch_async(dispatch_get_main_queue(), ^{
    UIView *element = weakTargetElement;
    if (element) [[RNCEKVFocusService sharedService] focus:element];
  });
}

@end
