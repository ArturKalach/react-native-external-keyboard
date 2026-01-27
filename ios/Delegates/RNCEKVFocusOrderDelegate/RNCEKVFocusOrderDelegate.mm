//
//  RNCEKVFocusOrderDelegate.mm
//  react-native-external-keyboard
//
//  Created by Artur Kalach on 25/06/2025.
//

#import <Foundation/Foundation.h>


#import "RNCEKVFocusOrderDelegate.h"
#import "RNCEKVFocusOrderProtocol.h"
#import "RNCEKVFocusEffectUtility.h"
#import "RNCEKVOrderLinking.h"
#import "RNCEKVExternalKeyboardView.h"
#import "UIViewController+RNCEKVExternalKeyboard.h"
#import "RNCEKVOrderSubscriber.h"
#import "RNCEKVFocusLinkObserver.h"
#import "RNCEKVFocusGuideHelper.h"
#import "RNCEKVFocusGuideDelegate.h"

static NSNumber *const FOCUS_DEFAULT = nil;
static NSNumber *const FOCUS_LOCK = @0;
static NSNumber *const FOCUS_UPDATE = @1;

@implementation RNCEKVFocusOrderDelegate{
  BOOL _isFocused;
  UIView<RNCEKVFocusOrderProtocol>* _delegate;
  UIView* _entry;
  UIView* _exit;
  UIView* _lock;
  
  RNCEKVFocusGuideDelegate *_focusGuideDelegate;
  NSMutableDictionary<NSNumber *, id> *_updateLinks;
  NSMutableDictionary<NSNumber *, id> *_removeLinks;

}

- (instancetype _Nonnull )initWithView:(UIView<RNCEKVFocusOrderProtocol> *_Nonnull)delegate{
  self = [super init];
  if (self) {
    _delegate = delegate;
    _focusGuideDelegate = [[RNCEKVFocusGuideDelegate alloc] initWithView:delegate];
    _subscribers = [NSMutableDictionary dictionary];
    _isFocused = false;
  }
  return self;
}

- (void)subscribeToDirection:(RNCEKVFocusGuideDirection)direction
                      linkId:(NSString *)linkId {
  if (!linkId) {
    return;
  }
  
  if(_subscribers[@(direction)]) {
    [self clearDirection: direction];
  }
  
  __typeof(self) __weak weakSelf = self;
  RNCEKVFocusGuideDirection capturedDirection = direction;
  
  LinkUpdatedCallback onLinkUpdated = ^(UIView *link) {
    [self->_focusGuideDelegate setGuideFor:capturedDirection withView: link];
  };
  
  LinkRemovedCallback onLinkRemoved = ^{
    [self->_focusGuideDelegate removeGuideFor: capturedDirection];
  };
  
  RNCEKVOrderSubscriber* subscriber = [[RNCEKVFocusLinkObserver sharedManager] subscribe:linkId
                                                                           onLinkUpdated:onLinkUpdated
                                                                           onLinkRemoved:onLinkRemoved];
  self.subscribers[@(direction)] = subscriber;
}

- (void)clearDirection:(RNCEKVFocusGuideDirection)direction {
  if (!self.subscribers[@(direction)]) {
    return;
  }
  
  [[RNCEKVFocusLinkObserver sharedManager] unsubscribe:self.subscribers[@(direction)]];
  self.subscribers[@(direction)] = nil;
  [_focusGuideDelegate removeGuideFor: direction];
}

- (void)refreshDirection:(RNCEKVFocusGuideDirection)direction
                  prevId:(NSString *)prevId
                  nextId:(NSString *)nextId {
  [self clearDirection:direction];
  [self subscribeToDirection:direction linkId:nextId];
}

- (void)keyboardedViewFocus:(UIView *)view {
  if ([view isKindOfClass:[RNCEKVExternalKeyboardView class]]) {
    [(RNCEKVExternalKeyboardView*)view focus];
  }
}

- (void)defaultViewFocus:(UIView *)view {
  UIViewController *controller = _delegate.reactViewController;
  
  if (controller != nil) {
    controller.rncekvCustomFocusView = view;
    dispatch_async(dispatch_get_main_queue(), ^{
      [controller setNeedsFocusUpdate];
      [controller updateFocusIfNeeded];
    });
  }
}


#pragma mark - Next Focus Handling
- (void)handleNextFocus:(UIView *)current currentIndex:(NSInteger)currentIndex {
  RNCEKVOrderRelationship* orderRelationship = [[RNCEKVOrderLinking sharedInstance] getInfo: _delegate.orderGroup];
  UIView* _entry = orderRelationship.entry;
  UIView* _exit = orderRelationship.exit;
  
  BOOL isEntry = _entry == current;
  if (isEntry) {
    UIView* firstElement = [orderRelationship getItem: 0];
    [self keyboardedViewFocus: firstElement];
  }
  
  BOOL isLast = currentIndex == orderRelationship.count - 1 && _exit;
  if (isLast) {
    [self defaultViewFocus: _exit];
  }
  
  BOOL inOrderRange = currentIndex >= 0 && currentIndex < orderRelationship.count - 1;
  if (inOrderRange) {
    UIView* nextElement = [orderRelationship getItem: currentIndex + 1];
    [self keyboardedViewFocus: nextElement];
  }
}


#pragma mark - Prev Focus Handling
- (void)handlePrevFocus:(UIView *)current currentIndex:(NSInteger)currentIndex {
  RNCEKVOrderRelationship* orderRelationship = [[RNCEKVOrderLinking sharedInstance] getInfo: _delegate.orderGroup];
  
  UIView* _exit = orderRelationship.exit;
  UIView* _entry = orderRelationship.entry;
  
  BOOL isExit = _exit == current;
  int orderCount = [orderRelationship count];
  if (isExit) {
    UIView* lastElement = [orderRelationship getItem: orderCount - 1];
    [self keyboardedViewFocus: lastElement];
  }
  
  BOOL isFirst = currentIndex == 0 && _entry;
  if (isFirst) {
    [self defaultViewFocus: _entry];
  }
  
  BOOL inRange = currentIndex > 0 && currentIndex <= orderCount - 1;
  if (inRange) {
    UIView* prevElement =  [orderRelationship getItem: currentIndex - 1];
    [self keyboardedViewFocus: prevElement];
  }
}

#pragma mark - Focus Order Handler
- (NSNumber*)shouldUpdateFocusInContext:(UIFocusUpdateContext *)context {
  UIFocusHeading movementHint = context.focusHeading;
  UIView *next = (UIView *)context.nextFocusedItem;
  UIView *current = (UIView *)context.previouslyFocusedItem;
  UIView* targetView = [_delegate getFocusTargetView];
  
  BOOL isTarget = current == targetView;
  if (isTarget) {
    NSMutableDictionary<NSNumber *, NSString *> *orderMapping = [NSMutableDictionary dictionary]; //Todo create custom structure
    if (_delegate.orderLast) {
      orderMapping[@(UIFocusHeadingLast)] = _delegate.orderLast;
    }
    if (_delegate.orderFirst) {
      orderMapping[@(UIFocusHeadingFirst)] = _delegate.orderFirst;
    }
    if (_delegate.orderForward) {
      orderMapping[@(UIFocusHeadingNext)] = _delegate.orderForward;
    }
    if (_delegate.orderBackward) {
      orderMapping[@(UIFocusHeadingPrevious)] = _delegate.orderBackward;
    }
    
    NSString *orderKey = orderMapping[@(movementHint)];
    if (orderKey) {
      UIView *nextView = [[RNCEKVOrderLinking sharedInstance] getOrderView:orderKey];
      [self keyboardedViewFocus:nextView];
      return FOCUS_LOCK;
    }
  }
  
  
  if (current == targetView) {
    NSUInteger rawFocusLockValue = [_delegate.lockFocus unsignedIntegerValue];
    
    BOOL isDirectionLock = (rawFocusLockValue & movementHint) != 0;
    if (isDirectionLock) {
      return FOCUS_LOCK;
    }
  }
  
  if(_delegate.orderGroup && _delegate.orderPosition != nil) {
    RNCEKVOrderRelationship* orderRelationship = [[RNCEKVOrderLinking sharedInstance] getInfo: _delegate.orderGroup];
    NSArray *order = [orderRelationship getArray];
    if(order.count == 0) {
      return FOCUS_DEFAULT;
    }
    
    UIView* _exit = orderRelationship.exit;
    UIView* _entry = orderRelationship.entry;
    
    int currentIndex = [orderRelationship getItemIndex:current];
    int nextIndex = [orderRelationship getItemIndex:next];
    //    [self findOrderIndex:order element:current];
    
    //    [self findOrderIndex:order element:next];
    
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
      return FOCUS_UPDATE;
    }
    
    
    if(context.focusHeading == UIFocusHeadingPrevious) {
      [self handlePrevFocus:current currentIndex: currentIndex];
      return FOCUS_UPDATE;
    }
  }
  
  return FOCUS_DEFAULT;
}

- (void)linkId {
  RNCEKVFocusLinkObserver *focusLinkObserver = [RNCEKVFocusLinkObserver sharedManager];
  
  NSString* orderId = _delegate.orderId;
  UIView* view = [_delegate getFocusTargetView];
  
  if(orderId != nil) {
    [focusLinkObserver emitWithId:orderId link:view];
  }
  
  [self subscribeToDirection:RNCEKVFocusGuideDirectionLeft
                      linkId:_delegate.orderLeft];
  
  [self subscribeToDirection:RNCEKVFocusGuideDirectionRight
                      linkId:_delegate.orderRight
  ];
  
  [self subscribeToDirection:RNCEKVFocusGuideDirectionUp
                      linkId:_delegate.orderUp
  ];
  
  [self subscribeToDirection:RNCEKVFocusGuideDirectionDown
                      linkId:_delegate.orderDown
  ];
}

- (void)refreshId: (NSString*)prev next:(NSString*)next {
  RNCEKVFocusLinkObserver *focusLinkObserver = [RNCEKVFocusLinkObserver sharedManager];
  UIView* view = [_delegate getFocusTargetView];
  
  
  if(prev != nil) {
    [focusLinkObserver emitRemoveWithId: prev];
    [[RNCEKVOrderLinking sharedInstance] cleanOrderId: prev];
  }
  
  if(next != nil && view != nil) {
    [[RNCEKVOrderLinking sharedInstance] storeOrderId: next withView:_delegate];
    [focusLinkObserver emitWithId:next link:view];
  }
};

- (void)setIsFocused:(BOOL)value {
  return [_focusGuideDelegate setIsFocused: value];
}

- (void)refreshLeft:(NSString*)prev next:(NSString*)next {
  [self refreshDirection:RNCEKVFocusGuideDirectionLeft
                  prevId:prev
                  nextId:next];
}

- (void)refreshRight:(NSString*)prev next:(NSString*)next{
  [self refreshDirection:RNCEKVFocusGuideDirectionRight
                  prevId:prev
                  nextId:next];
}

- (void)refreshUp:(NSString*)prev next:(NSString*)next{
  [self refreshDirection:RNCEKVFocusGuideDirectionUp
                  prevId:prev
                  nextId:next];
}

- (void)refreshDown:(NSString*)prev next:(NSString*)next{
  [self refreshDirection:RNCEKVFocusGuideDirectionDown
                  prevId:prev
                  nextId:next];
}

- (void)clear {
  [self clearDirection:RNCEKVFocusGuideDirectionLeft];
  [self clearDirection:RNCEKVFocusGuideDirectionRight];
  [self clearDirection:RNCEKVFocusGuideDirectionUp];
  [self clearDirection:RNCEKVFocusGuideDirectionDown];
  
  [self refreshId: _delegate.orderId next:nil];
}

@end
