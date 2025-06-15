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

#import "RNCEKVPropHelper.h"
#import "RCTFabricComponentsPlugins.h"
#import "RNCEKVFabricEventHelper.h"
#import <React/RCTConversions.h>
#import <stdlib.h>
#import "RNAOA11yOrderLinking.h"

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
  BOOL _isLinked;
  BOOL _isIdLinked;
}

- (void)linkIndex:(UIView *)subview {
  if(_orderPosition != nil && _orderGroup != nil && !_isLinked) {
    [[RNAOA11yOrderLinking sharedInstance] add: _orderPosition withOrderKey: _orderGroup withObject:self];
    _isLinked = YES;
  }
  if(_orderId != nil && !_isIdLinked) {
    [[RNAOA11yOrderLinking sharedInstance] storeOrderId:_orderId withView: self];
    _isIdLinked = YES;
  }
}

- (void)didAddSubview:(UIView *)subview {
  [super didAddSubview:subview];
  [self linkIndex:subview];
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
  _isLinked = NO;
  self.focusGroupIdentifier = nil;
}

#pragma mark - Get Focus Order Info
- (NSArray<UIView *> *)getOrder {
  RNAOA11yRelashioship* orderRelationship = [[RNAOA11yOrderLinking sharedInstance] getInfo:_orderGroup];
  return [orderRelationship getArray];
}


#pragma mark - Focus Find Index
- (int)findOrderIndex:(NSArray *)order element:(UIView*)el  {
  int resultIndex = -1;

  for (int i = 0; i < order.count; i++) {
    UIView *element = order[i];
      if (element.subviews[0] == el) { //ToDo focus element
        resultIndex = i;
        break;
      }
  }
  
  return resultIndex;
}


#pragma mark - Next Focus Handling
- (void)handleNextFocus:(UIView *)current currentIndex:(NSInteger)currentIndex {
  NSArray<UIView *> * order = [self getOrder];
  RNAOA11yRelashioship* orderRelationship = [[RNAOA11yOrderLinking sharedInstance] getInfo:_orderGroup];
  UIView* _entry = orderRelationship.entry;
  UIView* _exit = orderRelationship.exit;
  
  BOOL isEntry = _entry == current;
  if (isEntry) {
    UIView* firstElement = order[0];
    if ([firstElement isKindOfClass:[RNCEKVExternalKeyboardView class]]) {
      [(RNCEKVExternalKeyboardView*)firstElement focus];
    }
  }
  
  BOOL isLast = currentIndex == order.count - 1 && _exit;
  if (isLast) {
    [self updateSideFocus: _exit];
  }
  
  BOOL inOrderRange = currentIndex >= 0 && currentIndex < order.count - 1;
  if (inOrderRange) {
    UIView* nextElement = order[currentIndex + 1];
    if ([nextElement isKindOfClass:[RNCEKVExternalKeyboardView class]]) {
      [(RNCEKVExternalKeyboardView*)nextElement focus];
    }
  }
}

#pragma mark - Prev Focus Handling
- (void)handlePrevFocus:(UIView *)current currentIndex:(NSInteger)currentIndex {
  NSArray<UIView *> * order = [self getOrder];
  RNAOA11yRelashioship* orderRelationship = [[RNAOA11yOrderLinking sharedInstance] getInfo:_orderGroup];

  UIView* _exit = orderRelationship.exit;
  UIView* _entry = orderRelationship.entry;
  
  BOOL isExit = _exit == current;
  if (isExit) {
    UIView* lastElement = order[order.count - 1];
    if ([lastElement isKindOfClass:[RNCEKVExternalKeyboardView class]]) {
      [(RNCEKVExternalKeyboardView*)lastElement focus];
    }
  }
  
  BOOL isFirst = currentIndex == 0 && _entry;
  if (isFirst) {
    [self updateSideFocus: _entry];
  }
  
  BOOL inRange = currentIndex > 0 && currentIndex <= order.count - 1;
  if (inRange) {
    UIView* prevElement = order[currentIndex - 1];
    if ([prevElement isKindOfClass:[RNCEKVExternalKeyboardView class]]) {
      [(RNCEKVExternalKeyboardView*)prevElement focus];
    }
  }
}


- (BOOL)shouldUpdateFocusInContext:(UIFocusUpdateContext *)context {
  UIFocusHeading movementHint = context.focusHeading;
//  if(_orderLeft != nil && movementHint == UIFocusHeadingLeft) {
//   UIView* leftview = [[RNAOA11yOrderLinking sharedInstance] getOrderView: _orderLeft];
//    NSLog(@"Left");
//  }
//  
//  if(_orderRight != nil && movementHint == UIFocusHeadingRight) {
//    RNCEKVExternalKeyboardView* rightview = [[RNAOA11yOrderLinking sharedInstance] getOrderView: _orderRight];
//    [rightview focus];
//    return YES;
//  }
  
  if(!_orderGroup && !_orderPosition && !_lockFocus) {
    return [super shouldUpdateFocusInContext: context];
  }
  
  
  UIView *next = (UIView *)context.nextFocusedItem;
  UIView *current = (UIView *)context.previouslyFocusedItem;
//  UIFocusHeading movementHint = context.focusHeading;
  UIView* targetView = [self getFocusTargetView];
  
  if (current == targetView) {
      NSUInteger rawFocusLockValue = [self.lockFocus unsignedIntegerValue];

      BOOL isDirectionLock = (rawFocusLockValue & movementHint) != 0;
      if (isDirectionLock) {
          return NO;
      }
  }
  
  if(_orderGroup && _orderPosition != nil) {
    RNAOA11yRelashioship* orderRelationship = [[RNAOA11yOrderLinking sharedInstance] getInfo:_orderGroup];
    NSArray *order = [orderRelationship getArray];
    if(order.count == 0) {
      return [super shouldUpdateFocusInContext: context];
    }
    
    UIView* _exit = orderRelationship.exit;
    UIView* _entry = orderRelationship.entry;
    int currentIndex = [self findOrderIndex:order element:current];
    int nextIndex = [self findOrderIndex:order element:next];

    BOOL isEntryElement = _entry == nil && currentIndex == -1 && movementHint == UIFocusHeadingNext;

    if(isEntryElement) {
      orderRelationship.entry = current;
    }
    
    BOOL isExit = _exit == nil && nextIndex == -1 && movementHint == UIFocusHeadingNext;
    if(isExit) {
      orderRelationship.exit = next;
    }
    
    if(context.focusHeading == UIFocusHeadingNext) {
      [self handleNextFocus:current currentIndex: currentIndex];
      return YES;
    }
    
    
    if(context.focusHeading == UIFocusHeadingPrevious) {
      [self handlePrevFocus:current currentIndex: currentIndex];
      return YES;
    }
  }
  
  return [super shouldUpdateFocusInContext: context];
}


- (void)updateSideFocus:(UIView *)focusingView {
  UIViewController *controller = self.reactViewController;

  if (controller != nil) {
    controller.customFocusView = focusingView;
    dispatch_async(dispatch_get_main_queue(), ^{
      [controller setNeedsFocusUpdate];
      [controller updateFocusIfNeeded];
    });
  }
}

- (void)updateOrderPosition:(NSNumber *)position {
   if(_orderPosition != nil || _orderPosition != position) {
     if(_orderGroup != nil && self.subviews.count > 0 && _isLinked) {
       [[RNAOA11yOrderLinking sharedInstance] update:position lastPosition:_orderPosition withOrderKey: _orderGroup withView: self];
        }
     _orderPosition = position;
    }
    
    if(_orderPosition == nil && _orderPosition != position) {
      _orderPosition = position;
    }
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
  
  if(_orderPosition != nil && _orderGroup != nil) {
      [[RNAOA11yOrderLinking sharedInstance] remove:_orderPosition withOrderKey:_orderGroup];
  }

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

- (void)finalizeUpdates:(RNComponentViewUpdateMask)updateMask {
    [super finalizeUpdates:updateMask];
    if(self.subviews.count > 0) {
        [self linkIndex: self.subviews[0]];
    }
}
//
//- (BOOL)shouldUpdateStringProp:(NSString *)prop newValue:(std::string)newValue {
//    NSString *value = newValue.empty() ? @"" : [NSString stringWithUTF8String:newValue.c_str()];
//    
//    if(prop == nil && value.length == 0) {
//      return false;
//    }
//
//    return (prop == nil || value.length == 0 || ![prop isEqualToString:value]);
//}
//
//- (BOOL)shouldUpdateIntProp:(NSNumber *)prop value:(int)value {
//    if (prop == nil && value == -1) {
//        return NO;
//    }
//
//  return (prop == nil || value == -1 || prop.intValue != value);
//}
//
//- (NSString*)unwrapValue:(std::string)newValue {
//    NSString *value = newValue.empty() ? nil : [NSString stringWithUTF8String:newValue.c_str()];
//    return value.length > 0 ? value : nil;
//}


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

  if (oldViewProps.lockFocus != newViewProps.lockFocus) {
    [self setLockFocus: @(newViewProps.lockFocus)];
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
  
  
  BOOL isIndexChanged = [RNCEKVPropHelper isPropChanged:_orderPosition intValue: newViewProps.orderIndex];
  if(isIndexChanged) {
    NSNumber* position = [RNCEKVPropHelper unwrapIntValue: newViewProps.orderIndex];
    [self updateOrderPosition: position];
  }
  
  RKNA_PROP_UPDATE(orderGroup, setOrderGroup, newViewProps);
  RKNA_PROP_UPDATE(orderId, setOrderId, newViewProps);
  RKNA_PROP_UPDATE(orderLeft, setOrderLeft, newViewProps);
  RKNA_PROP_UPDATE(orderRight, setOrderRight, newViewProps);
  RKNA_PROP_UPDATE(orderUp, setOrderUp, newViewProps);
  RKNA_PROP_UPDATE(orderDown, setOrderDown, newViewProps);
  RKNA_PROP_UPDATE(orderForward, setOrderForward, newViewProps);
  RKNA_PROP_UPDATE(orderBackward, setOrderBackward, newViewProps);
  
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

// - (void)setupLayout {
//   self.focusGuide = [[UIFocusGuide alloc] init];
//   UIFocusGuide *focusGuide2 = [[UIFocusGuide alloc] init];
//   [self addLayoutGuide:self.focusGuide];
//   [self addLayoutGuide: focusGuide2];
//   self.focusGuide.preferredFocusEnvironments = @[self];
//   focusGuide2.preferredFocusEnvironments = @[self];

//    // Activate constraints for the focus guide to "bridge" Button A and Button C
//    [NSLayoutConstraint activateConstraints:@[
//         [self.focusGuide.widthAnchor constraintEqualToAnchor: self.widthAnchor],
//         [self.focusGuide.heightAnchor constraintEqualToAnchor: self.heightAnchor],
//         [self.focusGuide.topAnchor constraintEqualToAnchor: self.bottomAnchor],
//         [self.focusGuide.leftAnchor constraintEqualToAnchor: self.leftAnchor]
//    ]];
  
//   [NSLayoutConstraint activateConstraints:@[
//        [focusGuide2.widthAnchor constraintEqualToAnchor: self.widthAnchor],
//        [focusGuide2.heightAnchor constraintEqualToAnchor: self.heightAnchor],
//        [focusGuide2.leftAnchor constraintEqualToAnchor: self.rightAnchor],
//        [focusGuide2.topAnchor constraintEqualToAnchor: self.topAnchor]
//   ]];
  
// }

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
  [_haloDelegate displayHalo: true];
  if (self.autoFocus) {
    [self updateFocus:self.reactViewController];
  }
}

// ToDo RNCEKV-8 review and find better place for halo calculation
- (void)layoutSubviews {
  [super layoutSubviews];
  [_haloDelegate displayHalo];

  [_gIdDelegate updateGroupIdentifier];
//  [self setupLayout];
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
