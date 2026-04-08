//
//  RNCEKVViewOrderGroupBase.m
//  react-native-external-keyboard
//
//  Created by Artur Kalach on 07/04/2026.
//

#import <Foundation/Foundation.h>
#import "RNCEKVViewOrderGroupBase.h"
#import "RNCEKVFocusOrderDelegate.h"
#import "RNCEKVOrderLinking.h"
#import "UIViewController+RNCEKVExternalKeyboard.h"
#import "UIView+React.h"

#ifdef RCT_NEW_ARCH_ENABLED
#include "RNCEKVOrderProps.h"
#import "RNCEKVPropHelper.h"
#endif

@interface RNCEKVViewOrderGroupBase ()
@property (nonatomic, strong, readwrite) RNCEKVFocusOrderDelegate* focusOrderDelegate;
@end

@implementation RNCEKVViewOrderGroupBase

- (instancetype)initWithFrame:(CGRect)frame
{
  if (self = [super initWithFrame:frame]) {
    _focusOrderDelegate = [[RNCEKVFocusOrderDelegate alloc] initWithView:self];
  }

  return self;
}

- (BOOL)getIsViewFocused:(UIFocusUpdateContext *)context {
  return context.nextFocusedView == [self getStoredView];
}


- (void)didUpdateFocusInContext:(UIFocusUpdateContext *)context
       withAnimationCoordinator:(UIFocusAnimationCoordinator *)coordinator {
  BOOL isFocused = [self getIsViewFocused: context];
  [_focusOrderDelegate setIsFocused: isFocused];
  
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
  [_focusOrderDelegate unlink];
  
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
  if (self.window) {
    [_focusOrderDelegate link];
  } else {
    [_focusOrderDelegate unlink];
  }
}

- (BOOL)shouldUpdateFocusInContext:(UIFocusUpdateContext *)context {
  NSNumber* result = [_focusOrderDelegate shouldUpdateFocusInContext: context];

  if(result == nil) {
    return [super shouldUpdateFocusInContext: context];
  }

  return result.boolValue;
}

#ifdef RCT_NEW_ARCH_ENABLED
- (void)updateFocusOrderProps:(const RNCEKV::OrderProps &)oldViewProps
                     newProps:(const RNCEKV::OrderProps &)newViewProps {
  if ((oldViewProps.lockFocus != newViewProps.lockFocus)) {
    NSNumber* lockValue = [RNCEKVPropHelper unwrapIntValue: newViewProps.lockFocus];
    [self setLockFocus: lockValue];
  }

  if ((oldViewProps.orderIndex != newViewProps.orderIndex)) {
    NSNumber* position = [RNCEKVPropHelper unwrapIntValue: newViewProps.orderIndex];
    [self setOrderPosition: position];
  }

  if ((oldViewProps.orderGroup != newViewProps.orderGroup)) {
    NSString* orderGroup = [RNCEKVPropHelper unwrapStringValue: newViewProps.orderGroup];
    [self setOrderGroup: orderGroup];
  }

  if ((oldViewProps.orderId != newViewProps.orderId)) {
    NSString* orderId = [RNCEKVPropHelper unwrapStringValue: newViewProps.orderId];
    [self setOrderId: orderId];
  }

  if ((oldViewProps.orderLeft != newViewProps.orderLeft)) {
    NSString* orderLeft = [RNCEKVPropHelper unwrapStringValue: newViewProps.orderLeft];
    [self setOrderLeft: orderLeft];
  }

  if ((oldViewProps.orderRight != newViewProps.orderRight)) {
    NSString* orderRight = [RNCEKVPropHelper unwrapStringValue: newViewProps.orderRight];
    [self setOrderRight: orderRight];
  }

  if ((oldViewProps.orderUp != newViewProps.orderUp)) {
    NSString* orderUp = [RNCEKVPropHelper unwrapStringValue: newViewProps.orderUp];
    [self setOrderUp: orderUp];
  }

  if ((oldViewProps.orderDown != newViewProps.orderDown)) {
    NSString* orderDown = [RNCEKVPropHelper unwrapStringValue: newViewProps.orderDown];
    [self setOrderDown: orderDown];
  }

  if ((oldViewProps.orderForward != newViewProps.orderForward)) {
    NSString* orderForward = [RNCEKVPropHelper unwrapStringValue: newViewProps.orderForward];
    [self setOrderForward: orderForward];
  }

  if ((oldViewProps.orderBackward != newViewProps.orderBackward)) {
    NSString* orderBackward = [RNCEKVPropHelper unwrapStringValue: newViewProps.orderBackward];
    [self setOrderBackward: orderBackward];
  }

  if ((oldViewProps.orderLast != newViewProps.orderLast)) {
    NSString* orderLast = [RNCEKVPropHelper unwrapStringValue: newViewProps.orderLast];
    [self setOrderLast: orderLast];
  }

  if ((oldViewProps.orderFirst != newViewProps.orderFirst)) {
    NSString* orderFirst = [RNCEKVPropHelper unwrapStringValue: newViewProps.orderFirst];
    [self setOrderFirst: orderFirst];
  }
}
#endif


- (void)setOrderGroup:(NSString *)orderGroup {
  [_focusOrderDelegate updateOrderGroup: orderGroup];
  _orderGroup = orderGroup;
}


- (void)setOrderId:(NSString *)next {
  [_focusOrderDelegate refreshId:_orderId next:next];
  _orderId = next;
}

- (void)setOrderLeft:(NSString *)orderLeft {
  [_focusOrderDelegate refreshLeft: _orderLeft next: orderLeft];
  _orderLeft = orderLeft;
}

- (void)setOrderRight:(NSString *)orderRight {
  [_focusOrderDelegate refreshRight: _orderRight next: orderRight];
  _orderRight = orderRight;
}

- (void)setOrderUp:(NSString *)orderUp {
  [_focusOrderDelegate refreshUp: _orderUp next: orderUp];
  _orderUp = orderUp;
}

- (void)setOrderDown:(NSString *)orderDown {
  [_focusOrderDelegate refreshDown: _orderDown next: orderDown];
  _orderDown = orderDown;
}


- (void)setOrderPosition:(NSNumber *)position {
  [_focusOrderDelegate updatePosition: position];
  _orderPosition = position;
}

@end
