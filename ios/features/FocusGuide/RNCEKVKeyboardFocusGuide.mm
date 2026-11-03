//
//  RNCEKVKeyboardFocusGuide.mm
//  react-native-external-keyboard
//

#import "RNCEKVKeyboardFocusGuide.h"
#import <UIKit/UIKit.h>
#import <React/RCTViewManager.h>
#import "RNCEKVFocusService.h"
#import "RNCEKVGroupIdentifierDelegate.h"
#import "RNCEKVGuideHost.h"
#import "RNCEKVGuideKeyboardRedirect.h"
#import "RNCEKVGuideScreenReaderRedirect.h"
#import "RNCEKVGuideTargetLink.h"

#ifdef RCT_NEW_ARCH_ENABLED
#include <string>
#import <react/renderer/components/RNExternalKeyboardViewSpec/ComponentDescriptors.h>
#import <react/renderer/components/RNExternalKeyboardViewSpec/Props.h>
#import <react/renderer/components/RNExternalKeyboardViewSpec/RCTComponentViewHelpers.h>

#import <React/RCTFabricComponentsPlugins.h>

using namespace facebook::react;

@interface RNCEKVKeyboardFocusGuide () <RCTKeyboardFocusGuideViewProtocol>
@end
#endif

@interface RNCEKVKeyboardFocusGuide () <RNCEKVFocusServiceSubscriber, RNCEKVGuideHost, RNCEKVGroupIdentifierProtocol>
@end

/// Keeps props, the view's own accessibility/focus state and the UIKit overrides; the rest is delegated:
/// `RNCEKVGuideTargetLink` (target), `RNCEKVGuideKeyboardRedirect` and `RNCEKVGuideScreenReaderRedirect` (inputs),
/// with the input policy in `RNCEKVGuideMaskPolicy`.
@implementation RNCEKVKeyboardFocusGuide {
  RNCEKVGuideMaskPolicy *_mask;
  RNCEKVGuideTargetLink *_link;
  RNCEKVGuideKeyboardRedirect *_keyboard;
  RNCEKVGuideScreenReaderRedirect *_screenReader;
  RNCEKVGroupIdentifierDelegate *_groupId;
}

#pragma mark - Lifecycle

- (instancetype)initWithFrame:(CGRect)frame
{
  if (self = [super initWithFrame:frame]) {
    _guideEnabled = YES;
    _mask = [[RNCEKVGuideMaskPolicy alloc] initWithValue:RNCEKVGuideMaskDefault];
    __weak RNCEKVKeyboardFocusGuide *weakSelf = self;
    _link = [[RNCEKVGuideTargetLink alloc] initWithOnChange:^{
      [weakSelf targetDidChange];
    }];
    _keyboard = [[RNCEKVGuideKeyboardRedirect alloc] initWithHost:self];
    _screenReader = [[RNCEKVGuideScreenReaderRedirect alloc] initWithHost:self];
    _groupId = [[RNCEKVGroupIdentifierDelegate alloc] initWithView:self];
    if (@available(iOS 15.0, *)) {
      // Never focused for real, so it must not draw a focus ring.
      self.focusEffect = nil;
    }
#ifdef RCT_NEW_ARCH_ENABLED
    static const auto defaultProps = std::make_shared<const KeyboardFocusGuideProps>();
    _props = defaultProps;
#endif
  }
  return self;
}

- (void)dealloc
{
  [_link teardown];
  [[RNCEKVFocusService sharedService] unsubscribe:self];
}

#pragma mark - RNCEKVGuideHost

- (void)targetDidChange
{
  [_keyboard updateLayoutGuide];
}

- (RNCEKVGuideMaskPolicy *)maskPolicy
{
  return _mask;
}

- (UIView *)linkTarget
{
  return _link.target;
}

#pragma mark - Props

- (NSString *)preferredFocusOrderId
{
  return _link.preferredId;
}

- (void)setPreferredFocusOrderId:(NSString *)preferredFocusOrderId
{
  _link.preferredId = preferredFocusOrderId;
}

- (void)setGuideEnabled:(BOOL)guideEnabled
{
  if (_guideEnabled == guideEnabled) return;
  _guideEnabled = guideEnabled;
  [_keyboard updateLayoutGuide];
}

- (NSInteger)guideMask
{
  return _mask.value;
}

- (void)setGuideMask:(NSInteger)guideMask
{
  if (_mask.value == guideMask) return;
  _mask = [[RNCEKVGuideMaskPolicy alloc] initWithValue:guideMask];
  [_keyboard updateLayoutGuide];
  [self updateScreenReaderSubscription];
}

#pragma mark - Screen reader

/// Whether VoiceOver is redirected right now. Asked at use time, so there is no state to keep in sync.
- (BOOL)redirectsScreenReader
{
  return [_mask redirectsScreenReader:UIAccessibilityIsVoiceOverRunning()];
}

/// Silent while it redirects: VoiceOver must land on the guide to be redirected, but it should only read the target,
/// so neither the guide's own label nor its text children are announced. Tried on device and dropped:
/// - the target's label instead: read twice (on the guide, then on the target) and the move was no faster;
/// - a container holding the target (`accessibilityElements = @[target]`) instead of landing: the target lost its own
///   place in the VoiceOver order (cell1 -> cell3, skipping cell2), since an element has only one place in it.
- (NSString *)accessibilityLabel
{
  return [self redirectsScreenReader] ? @"" : [super accessibilityLabel];
}

/// One element for the whole guide while the screen reader is redirected: its text children are not reachable separately.
- (BOOL)isAccessibilityElement
{
  return [self redirectsScreenReader];
}

- (void)didMoveToWindow
{
  [super didMoveToWindow];
  [self updateScreenReaderSubscription];
}

/// Subscribed to the shared VoiceOver focus service only while it can redirect VoiceOver.
- (void)updateScreenReaderSubscription
{
  RNCEKVFocusService *service = [RNCEKVFocusService sharedService];
  if (_mask.hasScreenReader && self.window) {
    [service subscribe:self];
  } else {
    [service unsubscribe:self];
  }
}

- (void)accessibilityElementDidBecomeFocused:(UIView *)view
{
  if (view != self) return;
  [_screenReader redirectIfNeeded];
}

/// Required by the subscriber protocol; the guide has nothing to do when VoiceOver leaves it.
- (void)accessibilityElementDidUnfocused:(UIView *)view {}

#pragma mark - Focus (Tab)

/// The guide is a Tab stop, so it must group like the views around it: with generated unique ids it is its
/// own group (else Tab from its neighbour skips it), and in a named group it joins it (else Ctrl+Tab does).
- (NSString *)focusGroupIdentifier
{
  return _groupId.focusGroupIdentifier ?: [super focusGroupIdentifier];
}

- (UIView *)getFocusTargetView
{
  return self;
}

- (BOOL)canBecomeFocused
{
  return [_keyboard canHostBecomeFocused];
}

- (BOOL)shouldUpdateFocusInContext:(UIFocusUpdateContext *)context
{
  if ([_keyboard shouldRedirectInContext:context]) return NO;
  return [super shouldUpdateFocusInContext:context];
}

 - (void)didUpdateFocusInContext:(UIFocusUpdateContext *)context
        withAnimationCoordinator:(UIFocusAnimationCoordinator *)coordinator
 {
   [super didUpdateFocusInContext:context withAnimationCoordinator:coordinator];
   [_keyboard handleFocusDidLandInContext:context];
 }

#ifdef RCT_NEW_ARCH_ENABLED

#pragma mark - Fabric

+ (ComponentDescriptorProvider)componentDescriptorProvider
{
  return concreteComponentDescriptorProvider<KeyboardFocusGuideComponentDescriptor>();
}

- (void)prepareForRecycle
{
  [super prepareForRecycle];
  _link.preferredId = nil;
  _guideEnabled = YES;
  _mask = [[RNCEKVGuideMaskPolicy alloc] initWithValue:RNCEKVGuideMaskDefault];
  _customGroupId = nil;
  _uniqueGroupIdentifierEnabled = NO;
  [_keyboard updateLayoutGuide];
  [[RNCEKVFocusService sharedService] unsubscribe:self];
}

- (void)updateProps:(Props::Shared const &)props oldProps:(Props::Shared const &)oldProps
{
  const auto &newViewProps = *std::static_pointer_cast<KeyboardFocusGuideProps const>(props);

  NSString *nextId = newViewProps.preferredFocusOrderId.empty()
      ? nil
      : [NSString stringWithUTF8String:newViewProps.preferredFocusOrderId.c_str()];
  [self setPreferredFocusOrderId:nextId];
  [self setGuideEnabled:newViewProps.enabled];
  [self setGuideMask:newViewProps.guideMask];
  self.customGroupId = newViewProps.groupIdentifier.empty()
      ? nil
      : [NSString stringWithUTF8String:newViewProps.groupIdentifier.c_str()];
  self.uniqueGroupIdentifierEnabled = newViewProps.uniqueGroupIdentifierEnabled;

  [super updateProps:props oldProps:oldProps];
}

Class<RCTComponentViewProtocol> KeyboardFocusGuideCls(void)
{
  return RNCEKVKeyboardFocusGuide.class;
}

#endif

@end
