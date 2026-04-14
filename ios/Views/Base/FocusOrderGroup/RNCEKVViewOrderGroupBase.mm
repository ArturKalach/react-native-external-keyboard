//
//  RNCEKVViewOrderGroupBase.m
//  react-native-external-keyboard
//
//  Created by Artur Kalach on 07/04/2026.
//

#import <Foundation/Foundation.h>
#import "RNCEKVViewOrderGroupBase.h"
#import "RNCEKVOrderLinking.h"
#import "UIViewController+RNCEKVExternalKeyboard.h"
#import "UIView+React.h"
#import "RNCEKVPropHelper.h"

#ifdef RCT_NEW_ARCH_ENABLED
#include "RNCEKVNativeProps.h"
#import "RNCEKVPropHelper.h"
#endif

@interface RNCEKVViewOrderGroupBase ()
@property (nonatomic, strong, readwrite) RNCEKVFocusSequenceDelegate* sequenceDelegate;
@property (nonatomic, strong, readwrite) RNCEKVFocusLinkDelegate* linkDelegate;
@end

@implementation RNCEKVViewOrderGroupBase

- (instancetype)initWithFrame:(CGRect)frame
{
  if (self = [super initWithFrame:frame]) {
    _sequenceDelegate = [[RNCEKVFocusSequenceDelegate alloc] initWithView:self];
    _linkDelegate = [[RNCEKVFocusLinkDelegate alloc] initWithView:self];
  }
  return self;
}

- (BOOL)getIsViewFocused:(UIFocusUpdateContext *)context {
  return context.nextFocusedView == [self getStoredView];
}

- (void)didUpdateFocusInContext:(UIFocusUpdateContext *)context
       withAnimationCoordinator:(UIFocusAnimationCoordinator *)coordinator {
  [_linkDelegate setIsFocused:[self getIsViewFocused:context]];
  [super didUpdateFocusInContext:context withAnimationCoordinator:coordinator];
}

- (void)focus {
  UIViewController *controller = self.reactViewController;
  BOOL isAttached = self.superview != nil && controller != nil;

  if (isAttached) {
    [controller rncekvFocusView:[self getStoredView]];
  }
}

- (void)cleanReferences {
  [super cleanReferences];
  [_sequenceDelegate unlink];
  [_linkDelegate unlink];

  _orderGroup = nil;
  _orderPosition = nil;
  _orderLeft = nil;
  _orderRight = nil;
  _orderUp = nil;
  _orderDown = nil;
  _orderForward = nil;
  _orderBackward = nil;
  _orderLast = nil;
  _orderFirst = nil;
  _orderId = nil;
  _lockFocus = nil;
}

- (UIView *)getFocusTargetView {
  return [self getStoredView];
}

- (void)didMoveToWindow {
  [super didMoveToWindow];
  if (self.window) {
    [_sequenceDelegate link];
    [_linkDelegate link];
  } else {
    [_sequenceDelegate unlink];
    [_linkDelegate unlink];
  }
}

- (BOOL)shouldUpdateFocusInContext:(UIFocusUpdateContext *)context {
  NSNumber *sequenceResult = [_sequenceDelegate shouldUpdateFocusInContext:context];
  if (sequenceResult != nil) {
    return sequenceResult.boolValue;
  }

  NSNumber *linkResult = [_linkDelegate shouldUpdateFocusInContext:context];
  if (linkResult != nil) {
    return linkResult.boolValue;
  }

  return [super shouldUpdateFocusInContext:context];
}

#ifdef RCT_NEW_ARCH_ENABLED
- (void)updateFocusOrderProps:(const RNCEKV::OrderProps &)oldViewProps
                     newProps:(const RNCEKV::OrderProps &)newViewProps {
  NSNumber* lockFocus = [RNCEKVPropHelper unwrapIntValue: newViewProps.lockFocus];
  if (![_lockFocus isEqual: lockFocus]) {
    [self setLockFocus: lockFocus];
  }

  NSNumber* position = [RNCEKVPropHelper unwrapIntValue: newViewProps.orderIndex];
  if (![_orderPosition isEqual: position]) {
    [self setOrderPosition: position];
  }

  NSString* orderGroup = [RNCEKVPropHelper unwrapStringValue: newViewProps.orderGroup];
  if (![_orderGroup isEqual: orderGroup]) {
    [self setOrderGroup: orderGroup];
  }

  NSString* orderId = [RNCEKVPropHelper unwrapStringValue: newViewProps.orderId];
  if (![_orderId isEqual: orderId]) {
    [self setOrderId: orderId];
  }

  NSString* orderLeft = [RNCEKVPropHelper unwrapStringValue: newViewProps.orderLeft];
  if (![_orderLeft isEqual: orderLeft]) {
    [self setOrderLeft: orderLeft];
  }

  NSString* orderRight = [RNCEKVPropHelper unwrapStringValue: newViewProps.orderRight];
  if (![_orderRight isEqual: orderRight]) {
    [self setOrderRight: orderRight];
  }

  NSString* orderUp = [RNCEKVPropHelper unwrapStringValue: newViewProps.orderUp];
  if (![_orderUp isEqual: orderUp]) {
    [self setOrderUp: orderUp];
  }

  NSString* orderDown = [RNCEKVPropHelper unwrapStringValue: newViewProps.orderDown];
  if (![_orderDown isEqual: orderDown]) {
    [self setOrderDown: orderDown];
  }

  NSString* orderForward = [RNCEKVPropHelper unwrapStringValue: newViewProps.orderForward];
  if (![_orderForward isEqual: orderForward]) {
    [self setOrderForward: orderForward];
  }

  NSString* orderBackward = [RNCEKVPropHelper unwrapStringValue: newViewProps.orderBackward];
  if (![_orderBackward isEqual: orderBackward]) {
    [self setOrderBackward: orderBackward];
  }

  NSString* orderLast = [RNCEKVPropHelper unwrapStringValue: newViewProps.orderLast];
  if (![_orderLast isEqual: orderLast]) {
    [self setOrderLast: orderLast];
  }

  NSString* orderFirst = [RNCEKVPropHelper unwrapStringValue: newViewProps.orderFirst];
  if (![_orderFirst isEqual: orderFirst]) {
    [self setOrderFirst: orderFirst];
  }
}
#endif

- (void)setOrderGroup:(NSString *)orderGroup {
  [_sequenceDelegate updateOrderGroup:orderGroup];
  _orderGroup = orderGroup;
}

- (void)setOrderPosition:(NSNumber *)position {
  NSNumber* newPosition = [position intValue] == -1 ? nil : position;
  [_sequenceDelegate updatePosition:newPosition];
  _orderPosition = newPosition;
}

- (void)setOrderId:(NSString *)next {
  [_linkDelegate refreshId:_orderId next:next];
  _orderId = next;
}

- (void)setOrderLeft:(NSString *)orderLeft {
  [_linkDelegate refreshLeft:orderLeft];
  _orderLeft = orderLeft;
}

- (void)setOrderRight:(NSString *)orderRight {
  [_linkDelegate refreshRight:orderRight];
  _orderRight = orderRight;
}

- (void)setOrderUp:(NSString *)orderUp {
  [_linkDelegate refreshUp:orderUp];
  _orderUp = orderUp;
}

- (void)setOrderDown:(NSString *)orderDown {
  [_linkDelegate refreshDown:orderDown];
  _orderDown = orderDown;
}

@end
