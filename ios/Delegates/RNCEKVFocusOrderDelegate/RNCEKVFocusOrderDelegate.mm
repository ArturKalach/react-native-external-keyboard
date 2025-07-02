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
  [_delegate addLayoutGuide:_leftFocusGuide];
  
  [NSLayoutConstraint activateConstraints:@[
    [_leftFocusGuide.topAnchor constraintEqualToAnchor:_delegate.topAnchor],
    [_leftFocusGuide.bottomAnchor constraintEqualToAnchor:_delegate.bottomAnchor],
    [_leftFocusGuide.rightAnchor constraintEqualToAnchor:_delegate.leftAnchor],
    [_leftFocusGuide.widthAnchor constraintEqualToConstant:1]
  ]];
  
  _leftFocusGuide.preferredFocusEnvironments = @[view];
  
  _leftFocusGuide.enabled = _isFocused;
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

- (void)removeLeftGuide {
  if (_leftFocusGuide) {
    [_delegate removeLayoutGuide: _leftFocusGuide];
    _leftFocusGuide = nil;
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

- (void)orderLeftLink:(NSString*) linkId {
  RNCEKVFocusLinkObserverManager *manager = [RNCEKVFocusLinkObserverManager sharedManager];
  RNCEKVFocusLinkObserver *focusLinkObserver = manager.focusLinkObserver;
  
  if(linkId != nil && !_leftLinkUpdated && !_leftLinkRemoved) {
    __typeof(self) __weak weakSelf = self;
    
    _leftLinkUpdated = ^(UIView *link) {
      if (!weakSelf) return;
      [weakSelf setLeftGuide:link];
    };
    
    _leftLinkRemoved = ^{
      if (!weakSelf) return;
      [weakSelf removeLeftGuide];
    };
    
    [focusLinkObserver subscribeWithId: linkId
                         onLinkUpdated:_leftLinkUpdated
                         onLinkRemoved:_leftLinkRemoved];
  }
}

-(void)orderUpLink:(NSString*) linkId {
  RNCEKVFocusLinkObserverManager *manager = [RNCEKVFocusLinkObserverManager sharedManager];
  RNCEKVFocusLinkObserver *focusLinkObserver = manager.focusLinkObserver;
  
  if(linkId != nil && !_upLinkUpdated && !_upLinkRemoved) {
    __typeof(self) __weak weakSelf = self;
    _upLinkUpdated = ^(UIView *link) {
      if (!weakSelf) return;
      [weakSelf setUpGuide: link];
    };
    _upLinkRemoved = ^{
      if (!weakSelf) return;
      [weakSelf removeUpGuide];
    };
    [focusLinkObserver subscribeWithId: linkId
                         onLinkUpdated:_upLinkUpdated
                         onLinkRemoved:_upLinkRemoved];
  }
}

-(void)orderDownLink:(NSString*) linkId {
  RNCEKVFocusLinkObserverManager *manager = [RNCEKVFocusLinkObserverManager sharedManager];
  RNCEKVFocusLinkObserver *focusLinkObserver = manager.focusLinkObserver;
  
  if(linkId != nil && !_downLinkUpdated && !_downLinkRemoved) {
    __typeof(self) __weak weakSelf = self;
    _downLinkUpdated = ^(UIView *link) {
      if (!weakSelf) return;
      [weakSelf setDownGuide: link];
    };
    _downLinkRemoved = ^{
      if (!weakSelf) return;
      [weakSelf removeDownGuide];
    };
    [focusLinkObserver subscribeWithId: linkId
                         onLinkUpdated:_downLinkUpdated
                         onLinkRemoved:_downLinkRemoved];
  }
}

-(void)orderRightLink: (NSString*) linkId {
  RNCEKVFocusLinkObserverManager *manager = [RNCEKVFocusLinkObserverManager sharedManager];
  RNCEKVFocusLinkObserver *focusLinkObserver = manager.focusLinkObserver;
  
  
  if(linkId != nil && !_rightLinkUpdated && !_rightLinkRemoved) {
    __typeof(self) __weak weakSelf = self;
    _rightLinkUpdated = ^(UIView *link) {
      if (!weakSelf) return;
      [weakSelf setRightGuide: link];
    };
    _rightLinkRemoved = ^{
      if (!weakSelf) return;
      [weakSelf removeRightGuide];
    };
    [focusLinkObserver subscribeWithId: linkId
                         onLinkUpdated:_rightLinkUpdated
                         onLinkRemoved:_rightLinkRemoved];
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
  
  
  
  [self orderLeftLink: _delegate.orderLeft];
  [self orderRightLink: _delegate.orderRight];
  [self orderUpLink: _delegate.orderUp];
  [self orderDownLink: _delegate.orderDown];
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

- (void) clearLeftLink: (NSString*) linkId {
  RNCEKVFocusLinkObserverManager *manager = [RNCEKVFocusLinkObserverManager sharedManager];
  RNCEKVFocusLinkObserver *focusLinkObserver = manager.focusLinkObserver;
  
  if(linkId != nil && _leftLinkUpdated != nil && _leftLinkRemoved != nil) {
    [focusLinkObserver unsubscribeWithId:linkId
                           onLinkUpdated:_leftLinkUpdated
                           onLinkRemoved:_leftLinkRemoved];
    _leftLinkUpdated = nil;
    _leftLinkRemoved = nil;
    [self removeLeftGuide];
  }
}

-(void)clearRightLink: (NSString*) linkId {
  RNCEKVFocusLinkObserverManager *manager = [RNCEKVFocusLinkObserverManager sharedManager];
  RNCEKVFocusLinkObserver *focusLinkObserver = manager.focusLinkObserver;
  
  if(linkId != nil && _rightLinkUpdated != nil && _rightLinkRemoved != nil) {
    [focusLinkObserver unsubscribeWithId:linkId
                           onLinkUpdated:_rightLinkUpdated
                           onLinkRemoved:_rightLinkRemoved];
    
    _rightLinkUpdated = nil;
    _rightLinkRemoved = nil;
    [self removeRightGuide];
  }
}

-(void)clearUpLink: (NSString*) linkId {
  RNCEKVFocusLinkObserverManager *manager = [RNCEKVFocusLinkObserverManager sharedManager];
  RNCEKVFocusLinkObserver *focusLinkObserver = manager.focusLinkObserver;
  
  if(linkId != nil && _upLinkUpdated != nil && _upLinkRemoved != nil) {
    [focusLinkObserver unsubscribeWithId:linkId
                           onLinkUpdated:_upLinkUpdated
                           onLinkRemoved:_upLinkRemoved];
    _upLinkUpdated = nil;
    _upLinkRemoved = nil;

    [self removeUpGuide];
  }
}

-(void)clearDownLink: (NSString*) linkId {
  RNCEKVFocusLinkObserverManager *manager = [RNCEKVFocusLinkObserverManager sharedManager];
  RNCEKVFocusLinkObserver *focusLinkObserver = manager.focusLinkObserver;
  
  if(linkId != nil && _downLinkUpdated != nil && _downLinkRemoved != nil) {
    [focusLinkObserver unsubscribeWithId:linkId
                           onLinkUpdated:_downLinkUpdated
                           onLinkRemoved:_downLinkRemoved];

    _downLinkUpdated = nil;
    _downLinkRemoved = nil;
    
    [self removeDownGuide];
  }
  
}

- (void)refreshLeft:(NSString*)prev next:(NSString*)next {
  [self clearLeftLink: prev];
  [self orderLeftLink: next];
}

- (void)refreshRight:(NSString*)prev next:(NSString*)next{
  
  [self clearRightLink: prev];
  [self orderRightLink: next];
}

- (void)refreshUp:(NSString*)prev next:(NSString*)next{
  [self clearUpLink: prev];
  [self orderUpLink: next];
}

- (void)refreshDown:(NSString*)prev next:(NSString*)next{
  [self clearDownLink: prev];
  [self orderDownLink: next];
}

- (void)clear {
  NSString* orderId = _delegate.orderId;
  if(orderId != nil) {
    [[RNCEKVOrderLinking sharedInstance] cleanOrderId: orderId];
  }
 
  [self clearLeftLink: _delegate.orderLeft];
  [self clearRightLink: _delegate.orderRight];
  [self clearUpLink: _delegate.orderUp];
  [self clearDownLink: _delegate.orderDown];
  
  [self refreshId: _delegate.orderId next:nil];

}



@end
