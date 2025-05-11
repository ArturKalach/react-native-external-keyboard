#import "RNCEKVExternalKeyboardView.h"
#import "RNCEKVFocusDelegate.h"
#import "RNCEKVGroupIdentifierDelegate.h"
#import "RNCEKVHaloDelegate.h"
#import "RNCEKVKeyboardKeyPressHandler.h"
#import "UIViewController+RNCEKVExternalKeyboard.h"
#import <React/RCTViewManager.h>
#import <UIKit/UIKit.h>

#ifdef RCT_NEW_ARCH_ENABLED
#import <react/renderer/components/RNExternalKeyboardViewSpec/ComponentDescriptors.h>
#import <react/renderer/components/RNExternalKeyboardViewSpec/EventEmitters.h>
#import <react/renderer/components/RNExternalKeyboardViewSpec/Props.h>
#import <react/renderer/components/RNExternalKeyboardViewSpec/RCTComponentViewHelpers.h>
#include <string>

#import "RCTFabricComponentsPlugins.h"
#import "RNCEKVFabricEventHelper.h"
#import <React/RCTConversions.h>

using namespace facebook::react;

@interface RNCEKVExternalKeyboardView () <RCTExternalKeyboardViewViewProtocol>

@end

#endif

@implementation RNCEKVExternalKeyboardView {
  RNCEKVKeyboardKeyPressHandler *_keyboardKeyPressHandler;
  RNCEKVHaloDelegate *_haloDelegate;
  RNCEKVFocusDelegate *_focusDelegate;
  RNCEKVGroupIdentifierDelegate *_gIdDelegate;

  NSNumber *_isFocused;
  BOOL _isAttachedToWindow;
  BOOL _isAttachedToController;
}

@synthesize haloCornerRadius = _haloCornerRadius;
@synthesize haloExpendX = _haloExpendX;
@synthesize haloExpendY = _haloExpendY;

- (instancetype)initWithFrame:(CGRect)frame {
  if (self = [super initWithFrame:frame]) {
#ifdef RCT_NEW_ARCH_ENABLED
    static const auto defaultProps =
        std::make_shared<const ExternalKeyboardViewProps>();
    _props = defaultProps;
#endif
    _isAttachedToController = NO;
    _isAttachedToWindow = NO;
    _enableA11yFocus = NO;
    _keyboardKeyPressHandler = [[RNCEKVKeyboardKeyPressHandler alloc] init];
    _haloDelegate = [[RNCEKVHaloDelegate alloc] initWithView:self];
    _focusDelegate = [[RNCEKVFocusDelegate alloc] initWithView:self];
    _gIdDelegate = [[RNCEKVGroupIdentifierDelegate alloc] initWithView:self];

    if (@available(iOS 13.0, *)) {
      UIContextMenuInteraction *interaction =
          [[UIContextMenuInteraction alloc] initWithDelegate:self];
      [self addInteraction:interaction];
    }
  }

  return self;
}

- (void)cleanReferences {
  _isAttachedToController = NO;
  _isAttachedToWindow = NO;
  _isHaloActive = @2; // ToDo RNCEKV-0
  _haloExpendX = 0;
  _haloExpendY = 0;
  _haloCornerRadius = 0;
  _customGroupId = nil;
  _enableA11yFocus = NO;
  [_haloDelegate clear];
  [_gIdDelegate clear];
  self.focusGroupIdentifier = nil;
}

#ifdef RCT_NEW_ARCH_ENABLED
+ (ComponentDescriptorProvider)componentDescriptorProvider {
  return concreteComponentDescriptorProvider<
      ExternalKeyboardViewComponentDescriptor>();
}

- (void)prepareForRecycle {
  [super prepareForRecycle];
  [self cleanReferences];
}

- (void)willRemoveSubview:(UIView *)subview {
  [super willRemoveSubview:subview];
  if (_customGroupId && _gIdDelegate) {
    [_gIdDelegate clear];
  }
}

- (void)handleCommand:(const NSString *)commandName args:(const NSArray *)args {
  NSString *FOCUS = @"focus";
  if ([commandName isEqual:FOCUS]) {
    [self focus];
  }
}

- (void)updateProps:(Props::Shared const &)props
           oldProps:(Props::Shared const &)oldProps {
  const auto &oldViewProps =
      *std::static_pointer_cast<ExternalKeyboardViewProps const>(_props);
  const auto &newViewProps =
      *std::static_pointer_cast<ExternalKeyboardViewProps const>(props);
  [super updateProps:props oldProps:oldProps];

  if (_hasOnFocusChanged != newViewProps.hasOnFocusChanged) {
    [self setHasOnFocusChanged:newViewProps.hasOnFocusChanged];
  }

  if (oldViewProps.canBeFocused != newViewProps.canBeFocused) {
    [self setCanBeFocused:newViewProps.canBeFocused];
  }

  if (oldViewProps.hasKeyUpPress != newViewProps.hasKeyUpPress) {
    [self setHasOnPressUp:newViewProps.hasKeyUpPress];
  }

  if (oldViewProps.hasKeyDownPress != newViewProps.hasKeyDownPress) {
    [self setHasOnPressDown:newViewProps.hasKeyDownPress];
  }

  if (oldViewProps.autoFocus != newViewProps.autoFocus) {
    BOOL hasAutoFocus = newViewProps.autoFocus;
    [self setAutoFocus:hasAutoFocus];
  }

  if (_enableA11yFocus != newViewProps.enableA11yFocus) {
    [self setEnableA11yFocus:newViewProps.enableA11yFocus];
  }

  UIColor *newColor = RCTUIColorFromSharedColor(newViewProps.tintColor);
  BOOL renewColor = newColor != nil && self.tintColor == nil;
  BOOL isColorChanged = oldViewProps.tintColor != newViewProps.tintColor;
  if (isColorChanged || renewColor) {
    self.tintColor = RCTUIColorFromSharedColor(newViewProps.tintColor);
  }

  if (oldViewProps.group != newViewProps.group) {
    [self setIsGroup:newViewProps.group];
  }

  BOOL isNewGroup =
      oldViewProps.groupIdentifier != newViewProps.groupIdentifier;
  BOOL recoverCustomGroup =
      !self.customGroupId && !newViewProps.groupIdentifier.empty();
  if (isNewGroup || recoverCustomGroup) {
    if (newViewProps.groupIdentifier.empty() && self.customGroupId != nil) {
      self.customGroupId = nil;
    }
    if (!newViewProps.groupIdentifier.empty()) {
      NSString *newGroupId =
          [NSString stringWithUTF8String:newViewProps.groupIdentifier.c_str()];
      [self setCustomGroupId:newGroupId];
    }
  }

  // ToDo RNCEKV-0, refactor, condition for halo effect has side effect, recycle
  // is a question. The problem that we have to check the condition, (true means
  // we skip, but when it was false we should reset) and recycle (view is reused
  // and we need to double check whether a new place for view should be with or
  // without halo)
  if (self.isHaloActive != nil || newViewProps.haloEffect == false) {
    BOOL haloState = newViewProps.haloEffect;
    if (![self.isHaloActive isEqual:@(haloState)]) {
      [self setIsHaloActive:@(haloState)];
    }
  }

  if (_haloExpendX != newViewProps.haloExpendX) {
    [self setHaloExpendX:newViewProps.haloExpendX];
  }

  if (_haloExpendY != newViewProps.haloExpendY) {
    [self setHaloExpendY:newViewProps.haloExpendY];
  }

  if (_haloCornerRadius != newViewProps.haloCornerRadius) {
    [self setHaloCornerRadius:newViewProps.haloCornerRadius];
  }
}

- (void)mountChildComponentView:
            (UIView<RCTComponentViewProtocol> *)childComponentView
                          index:(NSInteger)index {
  [super mountChildComponentView:childComponentView index:index];
}

Class<RCTComponentViewProtocol> ExternalKeyboardViewCls(void) {
  return RNCEKVExternalKeyboardView.class;
}

#endif

// ToDo RNCEKV-DEPRICATED-0 remove after new system migration
- (NSArray<id<UIFocusEnvironment>> *)preferredFocusEnvironments {
  if (self.myPreferredFocusedView == nil) {
    return @[];
  }
  return @[ self.myPreferredFocusedView ];
}

- (BOOL)canBecomeFocused {
  if (!_canBeFocused)
    NO;
  return [_focusDelegate canBecomeFocused];
}

- (void)focus {
  UIViewController *viewController = self.reactViewController;
  [self updateFocus:viewController];
}

- (UIView *)getFocusTargetView {
  return [_focusDelegate getFocusingView];
}

- (void)updateFocus:(UIViewController *)controller {
  UIView *focusingView = self; // [_focusDelegate getFocusingView];

  if (self.superview != nil && controller != nil) {
    controller.customFocusView = focusingView;
    dispatch_async(dispatch_get_main_queue(), ^{
      [controller setNeedsFocusUpdate];
      [controller updateFocusIfNeeded];
      [self a11yFocus];
    });
  }
}

- (void)didUpdateFocusInContext:(UIFocusUpdateContext *)context
       withAnimationCoordinator:(UIFocusAnimationCoordinator *)coordinator {
  _isFocused = [_focusDelegate isFocusChanged:context];

  if ([self hasOnFocusChanged]) {
    if (_isFocused != nil) {
      _isAttachedToWindow = YES;
      _isAttachedToController = YES;
      [self onFocusChangeHandler:[_isFocused isEqual:@YES]];
    }

    return;
  }

  [super didUpdateFocusInContext:context withAnimationCoordinator:coordinator];
}

#ifdef RCT_NEW_ARCH_ENABLED
- (void)onContextMenuPressHandler {
  [RNCEKVFabricEventHelper onContextMenuPressEventEmmiter:_eventEmitter];
}

- (void)onBubbledContextMenuPressHandler {
  [RNCEKVFabricEventHelper onBubbledContextMenuPressEventEmmiter:_eventEmitter];
}

- (void)onFocusChangeHandler:(BOOL)isFocused {
  [RNCEKVFabricEventHelper onFocusChangeEventEmmiter:isFocused
                                         withEmitter:_eventEmitter];
}

- (void)onKeyDownPressHandler:(NSDictionary *)eventInfo {
  [RNCEKVFabricEventHelper onKeyDownPressEventEmmiter:eventInfo
                                          withEmitter:_eventEmitter];
}

- (void)onKeyUpPressHandler:(NSDictionary *)eventInfo {
  [RNCEKVFabricEventHelper onKeyUpPressEventEmmiter:eventInfo
                                        withEmitter:_eventEmitter];
}

#else

- (void)onContextMenuPressHandler {
  if (self.onContextMenuPress) {
    self.onContextMenuPress(@{});
  }
}

- (void)onBubbledContextMenuPressHandler {
  if (self.onBubbledContextMenuPress) {
    self.onBubbledContextMenuPress(@{});
  }
}

- (void)onFocusChangeHandler:(BOOL)isFocused {
  if (self.onFocusChange) {
    self.onFocusChange(@{@"isFocused" : @(isFocused)});
  }
}

- (void)onKeyDownPressHandler:(NSDictionary *)eventInfo {
  if (self.onKeyDownPress) {
    self.onKeyDownPress(eventInfo);
  }
}

- (void)onKeyUpPressHandler:(NSDictionary *)eventInfo {
  if (self.onKeyUpPress) {
    self.onKeyUpPress(eventInfo);
  }
}

#endif

- (void)a11yFocus {
  if (!_enableA11yFocus)
    return;
  UIView *focusView = [self getFocusTargetView];
  UIAccessibilityPostNotification(UIAccessibilityLayoutChangedNotification,
                                  focusView);
}

- (void)pressesBegan:(NSSet<UIPress *> *)presses
           withEvent:(UIPressesEvent *)event {
  NSDictionary *eventInfo = [_keyboardKeyPressHandler actionDownHandler:presses
                                                              withEvent:event];

  if (self.hasOnPressUp || self.hasOnPressDown) {
    [self onKeyDownPressHandler:eventInfo];
  }

  [super pressesBegan:presses withEvent:event];
}

- (void)pressesEnded:(NSSet<UIPress *> *)presses
           withEvent:(UIPressesEvent *)event {
  NSDictionary *eventInfo = [_keyboardKeyPressHandler actionUpHandler:presses
                                                            withEvent:event];

  if (self.hasOnPressUp || self.hasOnPressDown) {
    [self onKeyUpPressHandler:eventInfo];
  }

  [super pressesEnded:presses withEvent:event];
}

- (void)setIsHaloActive:(NSNumber *_Nullable)isHaloActive {
  _isHaloActive = isHaloActive;
  [_haloDelegate displayHalo];
}

- (void)setHaloCornerRadius:(CGFloat)haloCornerRadius {
  _haloCornerRadius = haloCornerRadius;
  if (_isAttachedToWindow) {
    [_haloDelegate updateHalo];
  }
}

- (void)setHaloExpendX:(CGFloat)haloExpendX {
  _haloExpendX = haloExpendX;
  if (_isAttachedToWindow) {
    [_haloDelegate updateHalo];
  }
}

- (void)setHaloExpendY:(CGFloat)haloExpendY {
  _haloExpendY = haloExpendY;
  if (_isAttachedToWindow) {
    [_haloDelegate updateHalo];
  }
}

- (void)didMoveToWindow {
  [super didMoveToWindow];

  if (self.window) {
    [[NSNotificationCenter defaultCenter]
        addObserver:self
           selector:@selector(viewControllerChanged:)
               name:@"ViewControllerChangedNotification"
             object:nil];
  } else {
    [[NSNotificationCenter defaultCenter]
        removeObserver:self
                  name:@"ViewControllerChangedNotification"
                object:nil];
  }

  if (self.window && !_isAttachedToWindow) {
    [self onViewAttached];
    _isAttachedToWindow = YES;
  }
}

- (void)onViewAttached {
  if (self.autoFocus) {
    [self updateFocus:self.reactViewController];
  }
}

// ToDo RNCEKV-8 review and find better place for halo calculation
- (void)layoutSubviews {
  [super layoutSubviews];
  [_haloDelegate displayHalo];

  [_gIdDelegate updateGroupIdentifier];
}

- (void)viewControllerChanged:(NSNotification *)notification {
  UIViewController *viewController = notification.object;
  if (self.autoFocus && !_isAttachedToController) {
    _isAttachedToController = YES;
    [self updateFocus:viewController];
  }
}

- (UIContextMenuConfiguration *)contextMenuInteraction:
                                    (UIContextMenuInteraction *)interaction
                        configurationForMenuAtLocation:(CGPoint)location
    API_AVAILABLE(ios(13.0)) {
  if (_isFocused != nil && [_isFocused isEqual:@YES]) {
    [self onContextMenuPressHandler];
    [self onBubbledContextMenuPressHandler];
  }

  return nil;
}

@end
