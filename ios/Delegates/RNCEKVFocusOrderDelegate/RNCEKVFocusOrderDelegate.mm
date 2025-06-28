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
#import "RNCEKVFocusLinkObserverManager.h"
#import "RNCEKVOrderSubscriber.h"

static NSNumber *const FOCUS_DEFAULT = nil;
static NSNumber *const FOCUS_LOCK = @0;
static NSNumber *const FOCUS_UPDATE = @1;

@implementation RNCEKVFocusOrderDelegate{
  BOOL _isFocused;
  UIView<RNCEKVFocusOrderProtocol>* _delegate;
  UIView* _entry;
  UIView* _exit;
  UIView* _lock;
  LinkUpdatedCallback _leftLinkUpdated;
  LinkRemovedCallback _leftLinkRemoved;
  LinkUpdatedCallback _rightLinkUpdated;
  LinkRemovedCallback _rightLinkRemoved;
  LinkUpdatedCallback _upLinkUpdated;
  LinkRemovedCallback _upLinkRemoved;
  LinkUpdatedCallback _downLinkUpdated;
  LinkRemovedCallback _downLinkRemoved;
  
  UIFocusGuide *_leftFocusGuide;
  UIFocusGuide *_rightFocusGuide;
  UIFocusGuide *_upFocusGuide;
  UIFocusGuide *_downFocusGuide;
}

- (instancetype _Nonnull )initWithView:(UIView<RNCEKVFocusOrderProtocol> *_Nonnull)delegate{
  self = [super init];
  if (self) {
    _delegate = delegate;
    _isFocused = false;
  }
  return self;
}

#pragma mark - Get Order Focus List
- (NSArray<UIView *> *)getOrder {
  RNCEKVRelashioship* orderRelationship = [[RNCEKVOrderLinking sharedInstance] getInfo: _delegate.orderGroup];
  return [orderRelationship getArray];
}


#pragma mark - Find Index of Focus Order Element
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

- (void)keyboardedViewFocus:(UIView *)view {
  if ([view isKindOfClass:[RNCEKVExternalKeyboardView class]]) {
    [(RNCEKVExternalKeyboardView*)view focus];
  }
}

- (void)defaultViewFocus:(UIView *)view {
  UIViewController *controller = _delegate.reactViewController;
  
  if (controller != nil) {
    controller.customFocusView = view;
    dispatch_async(dispatch_get_main_queue(), ^{
      [controller setNeedsFocusUpdate];
      [controller updateFocusIfNeeded];
    });
  }
}


#pragma mark - Next Focus Handling
- (void)handleNextFocus:(UIView *)current currentIndex:(NSInteger)currentIndex {
  NSArray<UIView *> * order = [self getOrder];
  RNCEKVRelashioship* orderRelationship = [[RNCEKVOrderLinking sharedInstance] getInfo: _delegate.orderGroup];
  UIView* _entry = orderRelationship.entry;
  UIView* _exit = orderRelationship.exit;
  
  BOOL isEntry = _entry == current;
  if (isEntry) {
    UIView* firstElement = order[0];
    [self keyboardedViewFocus: firstElement];
  }
  
  BOOL isLast = currentIndex == order.count - 1 && _exit;
  if (isLast) {
    [self defaultViewFocus: _exit];
  }
  
  BOOL inOrderRange = currentIndex >= 0 && currentIndex < order.count - 1;
  if (inOrderRange) {
    UIView* nextElement = order[currentIndex + 1];
    [self keyboardedViewFocus: nextElement];
  }
}


#pragma mark - Prev Focus Handling
- (void)handlePrevFocus:(UIView *)current currentIndex:(NSInteger)currentIndex {
  NSArray<UIView *> * order = [self getOrder];
  RNCEKVRelashioship* orderRelationship = [[RNCEKVOrderLinking sharedInstance] getInfo: _delegate.orderGroup];
  
  UIView* _exit = orderRelationship.exit;
  UIView* _entry = orderRelationship.entry;
  
  BOOL isExit = _exit == current;
  if (isExit) {
    UIView* lastElement = order[order.count - 1];
    [self keyboardedViewFocus: lastElement];
  }
  
  BOOL isFirst = currentIndex == 0 && _entry;
  if (isFirst) {
    [self defaultViewFocus: _entry];
  }
  
  BOOL inRange = currentIndex > 0 && currentIndex <= order.count - 1;
  if (inRange) {
    UIView* prevElement = order[currentIndex - 1];
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
    RNCEKVRelashioship* orderRelationship = [[RNCEKVOrderLinking sharedInstance] getInfo: _delegate.orderGroup];
    NSArray *order = [orderRelationship getArray];
    if(order.count == 0) {
      return FOCUS_DEFAULT;
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
      return FOCUS_UPDATE;
    }
    
    
    if(context.focusHeading == UIFocusHeadingPrevious) {
      [self handlePrevFocus:current currentIndex: currentIndex];
      return FOCUS_UPDATE;
    }
  }
  
  return FOCUS_DEFAULT;
}



- (void)setLeftGuide:(UIView *)view {
  if (!view) {
    return;
  }
  
  [self removeLeftGuide];
  
  _leftFocusGuide = [[UIFocusGuide alloc] init];
  
  // Add the focus guide to the parent view where the focus movement should be adjusted
  [_delegate addLayoutGuide:_leftFocusGuide];
  
  // Set up constraints for the focus guide so it spans near the left of the `view`
  [NSLayoutConstraint activateConstraints:@[
    [_leftFocusGuide.topAnchor constraintEqualToAnchor:_delegate.topAnchor],
    [_leftFocusGuide.bottomAnchor constraintEqualToAnchor:_delegate.bottomAnchor],
    [_leftFocusGuide.rightAnchor constraintEqualToAnchor:_delegate.leftAnchor],  // Place it to the left of the view
    [_leftFocusGuide.widthAnchor constraintEqualToConstant:1]              // Optional: define a width for the focus guide
  ]];
  
  // Assign the `preferredFocusEnvironments` target for the focus guide
  _leftFocusGuide.preferredFocusEnvironments = @[view];
  
  _leftFocusGuide.enabled = _isFocused;
}

- (void)removeLeftGuide {
  //     Check if the focus guide exists
  if (_leftFocusGuide) {
    // Remove the focus guide from the layout
    [_delegate removeLayoutGuide: _leftFocusGuide];
    
    // Clean up the stored reference
    _leftFocusGuide = nil;
  }
}

- (void)setRightGuide:(UIView *)view {
  if (!view) return;
  
  [self removeRightGuide];
  
  _rightFocusGuide = [[UIFocusGuide alloc] init];
  [_delegate addLayoutGuide: _rightFocusGuide];
  
  [NSLayoutConstraint activateConstraints:@[
    [_rightFocusGuide.topAnchor constraintEqualToAnchor: _delegate.topAnchor],
    [_rightFocusGuide.bottomAnchor constraintEqualToAnchor: _delegate.bottomAnchor],
    [_rightFocusGuide.leftAnchor constraintEqualToAnchor: _delegate.rightAnchor],
    [_rightFocusGuide.widthAnchor constraintEqualToConstant: 1]
  ]];
  
  _rightFocusGuide.preferredFocusEnvironments = @[view];
  
  _rightFocusGuide.enabled = _isFocused;
}

- (void)setUpGuide:(UIView *)view {
  if (!view) return;
  
  [self removeUpGuide];
  
  _upFocusGuide = [[UIFocusGuide alloc] init];
  [_delegate addLayoutGuide: _upFocusGuide];
  
  [NSLayoutConstraint activateConstraints:@[
    [_upFocusGuide.leftAnchor constraintEqualToAnchor:_delegate.leftAnchor],
    [_upFocusGuide.rightAnchor constraintEqualToAnchor:_delegate.rightAnchor],
    [_upFocusGuide.bottomAnchor constraintEqualToAnchor:_delegate.topAnchor],
    [_upFocusGuide.heightAnchor constraintEqualToConstant:1]
  ]];
  
  _upFocusGuide.preferredFocusEnvironments = @[view];
  
  _upFocusGuide.enabled = _isFocused;
}

- (void)setDownGuide:(UIView *)view {
  if (!view) return;
  
  [self removeDownGuide];
  
  _downFocusGuide = [[UIFocusGuide alloc] init];
  [_delegate addLayoutGuide:_downFocusGuide];
  
  [NSLayoutConstraint activateConstraints:@[
    [_downFocusGuide.leftAnchor constraintEqualToAnchor:_delegate.leftAnchor],
    [_downFocusGuide.rightAnchor constraintEqualToAnchor:_delegate.rightAnchor],
    [_downFocusGuide.topAnchor constraintEqualToAnchor:_delegate.bottomAnchor],
    [_downFocusGuide.heightAnchor constraintEqualToConstant:1]
  ]];
  
  _downFocusGuide.preferredFocusEnvironments = @[view];
  
  _downFocusGuide.enabled = _isFocused;
}

- (void)setIsFocused:(BOOL)value {
  _isFocused = value;
  
  if(_leftFocusGuide != nil) {
    _leftFocusGuide.enabled = value;
  }
  
  if(_rightFocusGuide != nil) {
    _rightFocusGuide.enabled = value;
  }
  
  if(_upFocusGuide != nil) {
    _upFocusGuide.enabled = value;
  }
  
  if(_downFocusGuide != nil) {
    _downFocusGuide.enabled = value;
  }
}

- (void)removeRightGuide {
  if (_rightFocusGuide) {
    [_delegate removeLayoutGuide: _rightFocusGuide];
    _rightFocusGuide = nil;
  }
}

- (void)removeUpGuide {
  if (_upFocusGuide) {
    [_delegate removeLayoutGuide:_upFocusGuide];
    _upFocusGuide = nil;
  }
}

- (void)removeDownGuide {
  if (_downFocusGuide) {
    [_delegate removeLayoutGuide:_downFocusGuide];
    _downFocusGuide = nil;
  }
}

- (void)linkId {
  RNCEKVFocusLinkObserverManager *manager = [RNCEKVFocusLinkObserverManager sharedManager];
  RNCEKVFocusLinkObserver *focusLinkObserver = manager.focusLinkObserver;
  
  NSString* orderId = _delegate.orderId;
  UIView* view = [_delegate getFocusTargetView];
  
  if(orderId != nil) {
    [focusLinkObserver emitWithId:orderId link:view];
  }
  
  if(_delegate.orderLeft) {
    __typeof(self) __weak weakSelf = self;
    
    _leftLinkUpdated = ^(UIView *link) {
      if (!weakSelf) return;
      [weakSelf setLeftGuide:link];
    };
    
    _leftLinkRemoved = ^{
      if (!weakSelf) return;
      [weakSelf removeLeftGuide];
    };
    
    [focusLinkObserver subscribeWithId:_delegate.orderLeft
                         onLinkUpdated:_leftLinkUpdated
                         onLinkRemoved:_leftLinkRemoved];
  }
  
  if(_delegate.orderRight) {
    __typeof(self) __weak weakSelf = self;
    _rightLinkUpdated = ^(UIView *link) {
      if (!weakSelf) return;
      [weakSelf setRightGuide: link];
    };
    _rightLinkRemoved = ^{
      if (!weakSelf) return;
      [weakSelf removeRightGuide];
    };
    
    [focusLinkObserver subscribeWithId:_delegate.orderRight
                         onLinkUpdated:_rightLinkUpdated
                         onLinkRemoved:_rightLinkRemoved];
  }
  
  if(_delegate.orderUp) {
    __typeof(self) __weak weakSelf = self;
    _upLinkUpdated = ^(UIView *link) {
      if (!weakSelf) return;
      [weakSelf setUpGuide: link];
    };
    _upLinkRemoved = ^{
      if (!weakSelf) return;
      [weakSelf removeUpGuide];
    };
    
    [focusLinkObserver subscribeWithId:_delegate.orderUp
                         onLinkUpdated:_upLinkUpdated
                         onLinkRemoved:_upLinkRemoved];
  }
  
  if(_delegate.orderDown) {
    __typeof(self) __weak weakSelf = self;
    _downLinkUpdated = ^(UIView *link) {
      if (!weakSelf) return;
      [weakSelf setDownGuide: link];
    };
    _downLinkRemoved = ^{
      if (!weakSelf) return;
      [weakSelf removeDownGuide];
    };
    
    [focusLinkObserver subscribeWithId:_delegate.orderDown
                         onLinkUpdated:_downLinkUpdated
                         onLinkRemoved:_downLinkRemoved];
  }
}

- (void)refreshId: (NSString*)prev next:(NSString*)next {
  RNCEKVFocusLinkObserverManager *manager = [RNCEKVFocusLinkObserverManager sharedManager];
  RNCEKVFocusLinkObserver *focusLinkObserver = manager.focusLinkObserver;
  UIView* view = [_delegate getFocusTargetView];
  
  
  if(prev != nil) {
    [[RNCEKVOrderLinking sharedInstance] cleanOrderId: prev];
    [focusLinkObserver emitRemoveWithId: prev];
  }
  
  if(next != nil && view != nil) {
    [[RNCEKVOrderLinking sharedInstance] storeOrderId: next withView:_delegate];
    [focusLinkObserver emitWithId:next link:view];
  }
};



- (void)removeId {
  RNCEKVFocusLinkObserverManager *manager = [RNCEKVFocusLinkObserverManager sharedManager];
  RNCEKVFocusLinkObserver *focusLinkObserver = manager.focusLinkObserver;
  
  NSString* orderId = _delegate.orderId;
  if(orderId != nil) {
    [focusLinkObserver emitRemoveWithId: orderId];
  }
  
  if(_delegate.orderLeft) {
    [focusLinkObserver unsubscribeWithId:_delegate.orderLeft
                           onLinkUpdated:_leftLinkUpdated
                           onLinkRemoved:_leftLinkRemoved];
  }
  
  if(_delegate.orderRight) {
    [focusLinkObserver unsubscribeWithId:_delegate.orderRight
                           onLinkUpdated:_rightLinkUpdated
                           onLinkRemoved:_rightLinkRemoved];
  }
  
  if(_delegate.orderUp) {
    [focusLinkObserver unsubscribeWithId:_delegate.orderUp
                           onLinkUpdated:_upLinkUpdated
                           onLinkRemoved:_upLinkRemoved];
  }
  
  if(_delegate.orderDown) {
    [focusLinkObserver unsubscribeWithId:_delegate.orderDown
                           onLinkUpdated:_downLinkUpdated
                           onLinkRemoved:_downLinkRemoved];
  }
};


- (void)refreshLeft:(NSString*)prev next:(NSString*)next {
  RNCEKVFocusLinkObserverManager *manager = [RNCEKVFocusLinkObserverManager sharedManager];
  RNCEKVFocusLinkObserver *focusLinkObserver = manager.focusLinkObserver;
  
  if(prev != nil && _leftLinkUpdated != nil && _leftLinkRemoved != nil) {
    [focusLinkObserver unsubscribeWithId:prev
                           onLinkUpdated:_leftLinkUpdated
                           onLinkRemoved:_leftLinkRemoved];
  }
  
  if(next != nil) {
    __typeof(self) __weak weakSelf = self;
    _leftLinkUpdated = ^(UIView *link) {
      if (!weakSelf) return;
      [weakSelf setLeftGuide: link];
    };
    _leftLinkRemoved = ^{
      if (!weakSelf) return;
      [weakSelf removeLeftGuide];
    };
    
    [focusLinkObserver subscribeWithId: next
                         onLinkUpdated:_leftLinkUpdated
                         onLinkRemoved:_leftLinkRemoved];
  }
}

- (void)refreshRight:(NSString*)prev next:(NSString*)next{
  RNCEKVFocusLinkObserverManager *manager = [RNCEKVFocusLinkObserverManager sharedManager];
  RNCEKVFocusLinkObserver *focusLinkObserver = manager.focusLinkObserver;
  
  if(prev != nil && _rightLinkUpdated != nil && _rightLinkRemoved != nil) {
    [focusLinkObserver unsubscribeWithId:prev
                           onLinkUpdated:_rightLinkUpdated
                           onLinkRemoved:_rightLinkRemoved];
  }
  
  if(next != nil) {
    __typeof(self) __weak weakSelf = self;
    _rightLinkUpdated = ^(UIView *link) {
      if (!weakSelf) return;
      [weakSelf setRightGuide: link];
    };
    _rightLinkRemoved = ^{
      if (!weakSelf) return;
      [weakSelf removeRightGuide];
    };
    
    [focusLinkObserver subscribeWithId: next
                         onLinkUpdated:_rightLinkUpdated
                         onLinkRemoved:_rightLinkRemoved];
  }
}

- (void)refreshUp:(NSString*)prev next:(NSString*)next{
  RNCEKVFocusLinkObserverManager *manager = [RNCEKVFocusLinkObserverManager sharedManager];
  RNCEKVFocusLinkObserver *focusLinkObserver = manager.focusLinkObserver;
  
  if(prev != nil && _upLinkUpdated != nil && _upLinkRemoved != nil) {
    [focusLinkObserver unsubscribeWithId:prev
                           onLinkUpdated:_upLinkUpdated
                           onLinkRemoved:_upLinkRemoved];
  }
  
  if(next != nil) {
    __typeof(self) __weak weakSelf = self;
    _upLinkUpdated = ^(UIView *link) {
      if (!weakSelf) return;
      [weakSelf setUpGuide: link];
    };
    _upLinkRemoved = ^{
      if (!weakSelf) return;
      [weakSelf removeUpGuide];
    };
    
    [focusLinkObserver subscribeWithId: next
                         onLinkUpdated:_upLinkUpdated
                         onLinkRemoved:_upLinkRemoved];
  }
}

- (void)refreshDown:(NSString*)prev next:(NSString*)next{
  RNCEKVFocusLinkObserverManager *manager = [RNCEKVFocusLinkObserverManager sharedManager];
  RNCEKVFocusLinkObserver *focusLinkObserver = manager.focusLinkObserver;
  
  if(prev != nil && _downLinkUpdated != nil && _downLinkRemoved != nil) {
    [focusLinkObserver unsubscribeWithId:prev
                           onLinkUpdated:_downLinkUpdated
                           onLinkRemoved:_downLinkRemoved];
  }
  
  if(next != nil) {
    __typeof(self) __weak weakSelf = self;
    _downLinkUpdated = ^(UIView *link) {
      if (!weakSelf) return;
      [weakSelf setDownGuide: link];
    };
    _downLinkRemoved = ^{
      if (!weakSelf) return;
      [weakSelf removeDownGuide];
    };
    
    [focusLinkObserver subscribeWithId: next
                         onLinkUpdated:_downLinkUpdated
                         onLinkRemoved:_downLinkRemoved];
  }
}

- (void)clear {
  [self removeLeftGuide];
  [self removeRightGuide];
  [self removeUpGuide];
  [self removeDownGuide];
  
  [self refreshLeft: _delegate.orderLeft next: nil];
  [self refreshRight: _delegate.orderRight next: nil];
  [self refreshUp: _delegate.orderUp next: nil];
  [self refreshDown: _delegate.orderDown next: nil];
  
  [self refreshId: _delegate.orderId next:nil];
}



@end
